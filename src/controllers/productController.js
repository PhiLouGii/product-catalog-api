const { body, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const Product = require('../models/Product');
const Category = require('../models/Category');
const { ApiError } = require('../utils/errors');
const { successResponse } = require('../middlewares/response');

// Validation middleware
exports.validateProduct = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Product name is required')
    .isLength({ max: 100 })
    .withMessage('Name must be ≤ 100 characters'),
  
  body('price')
    .isFloat({ min: 0.01 })
    .withMessage('Price must be ≥ 0.01'),
  
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description must be ≤ 500 characters'),
  
  body('categories')
    .isArray({ min: 1 })
    .withMessage('At least one category required')
    .custom(async (categories) => {
      if (!categories.every(mongoose.Types.ObjectId.isValid)) {
        throw new Error('Invalid category ID format');
      }
      const validCount = await Category.countDocuments({ _id: { $in: categories } });
      if (validCount !== categories.length) throw new Error('Invalid category IDs');
    }),
  
  body('variants')
    .isArray({ min: 1 })
    .withMessage('At least one variant required'),
  
  body('variants.*.sku')
    .notEmpty()
    .withMessage('Variant SKU required')
    .custom(async (sku) => {
      const exists = await Product.findOne({ 'variants.sku': sku });
      if (exists) throw new Error(`SKU ${sku} already exists`);
    }),
  
  body('variants.*.price')
    .isFloat({ min: 0 })
    .withMessage('Variant price must be ≥ 0'),
  
  body('variants.*.inventory')
    .isInt({ min: 0 })
    .withMessage('Inventory must be ≥ 0')
];

// Create product
exports.createProduct = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ApiError(400, 'Validation failed', { details: errors.array() }));
    }

    const product = await Product.create(req.body);
    successResponse(res, product, 201);
  } catch (error) {
    next(new ApiError(400, 'Product creation failed: ' + error.message));
  }
};

// Get all products (paginated)
exports.getProducts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 10, 100);
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      Product.find()
        .skip(skip)
        .limit(limit)
        .populate('categories')
        .sort('-createdAt'),
      Product.countDocuments()
    ]);

    successResponse(res, {
      data: products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasNext: (page * limit) < total
      }
    });
  } catch (error) {
    next(new ApiError(500, 'Failed to fetch products: ' + error.message));
  }
};

// Get single product
exports.getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('categories');
    if (!product) return next(new ApiError(404, 'Product not found'));
    successResponse(res, product);
  } catch (error) {
    next(new ApiError(500, 'Failed to fetch product: ' + error.message));
  }
};

// Update product
exports.updateProduct = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ApiError(400, 'Validation failed', { details: errors.array() }));
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('categories');

    if (!product) return next(new ApiError(404, 'Product not found'));
    successResponse(res, product);
  } catch (error) {
    next(new ApiError(400, 'Update failed: ' + error.message));
  }
};

// Delete product
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return next(new ApiError(404, 'Product not found'));
    successResponse(res, null, 204);
  } catch (error) {
    next(new ApiError(500, 'Deletion failed: ' + error.message));
  }
};

// Advanced search
exports.searchProducts = async (req, res, next) => {
  try {
    const { q, minPrice, maxPrice, category, color, size, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    
    // Validate price range
    if (minPrice && maxPrice && minPrice > maxPrice) {
      return next(new ApiError(400, 'Invalid price range'));
    }

    const filter = {};
    const variantFilter = {};

    // Text search
    if (q) {
      filter.$text = { $search: q };
    }

    // Price filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    // Category filter
    if (category) {
      filter.categories = category;
    }

    // Variant filters
    if (color) variantFilter['variants.attributes.color'] = color;
    if (size) variantFilter['variants.attributes.size'] = size;

    const [products, total] = await Promise.all([
      Product.find({ ...filter, ...variantFilter })
        .skip(skip)
        .limit(parseInt(limit))
        .populate('categories')
        .sort(q ? { score: { $meta: 'textScore' } } : '-createdAt'),
      Product.countDocuments({ ...filter, ...variantFilter })
    ]);

    successResponse(res, {
      data: products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(new ApiError(400, 'Search failed: ' + error.message));
  }
};

// Bulk create products
exports.bulkCreateProducts = async (req, res, next) => {
  try {
    const result = await Product.insertMany(req.body, { ordered: false });
    
    const response = {
      success: true,
      createdCount: result.length,
      errors: result.writeErrors?.map(err => ({
        index: err.index,
        error: err.errmsg
      })) || []
    };

    successResponse(res, response, 201);
  } catch (error) {
    next(new ApiError(400, 'Bulk operation failed: ' + error.message));
  }
};