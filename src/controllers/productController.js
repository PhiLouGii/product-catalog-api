const Product = require('../models/Product');
const ApiError = require('../utils/ApiError');
const { successResponse, errorResponse } = require('../middlewares/response');

exports.createProduct = async (req, res) => {
  try {
    if (!req.body.name || req.body.price <= 0) {
      return res.status(400).json({
        success: false,
        error: "Name and valid price required"
      });
    }
    
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message.includes('validation') 
        ? "Validation failed: " + error.message
        : "Product creation failed"
    });
  }
};

exports.getProducts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      Product.find()
        .skip(skip)
        .limit(limit)
        .populate('categories'),
      Product.countDocuments()
    ]);

    successResponse(res, {
      data: products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(new ApiError(500, 'Failed to fetch products'));
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('categories');

    if (!product) {
      return next(new ApiError(404, 'Product not found'));
    }
    successResponse(res, product);
  } catch (error) {
    next(new ApiError(400, 'Update failed: ' + error.message));
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    
    if (!product) {
      return next(new ApiError(404, 'Product not found'));
    }
    successResponse(res, null, 204);
  } catch (error) {
    next(new ApiError(500, 'Deletion failed'));
  }
};

exports.searchProducts = async (req, res, next) => {
  try {
    const { q, minPrice, maxPrice, category, color, size } = req.query;
    const filter = {};

    if (q) {
      filter.$or = [
        { name: new RegExp(q, 'i') },
        { description: new RegExp(q, 'i') }
      ];
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    if (category) filter.categories = category;
    if (color) filter['variants.attributes.color'] = color;
    if (size) filter['variants.attributes.size'] = size;

    const products = await Product.find(filter).populate('categories');
    successResponse(res, products);
  } catch (error) {
    next(new ApiError(400, 'Search failed: ' + error.message));
  }
};