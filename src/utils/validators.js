const { body, param, query } = require('express-validator');
const mongoose = require('mongoose');

// Helper function to validate MongoDB ObjectID
const isValidObjectId = (value) => {
  return mongoose.Types.ObjectId.isValid(value);
};

// Product validation rules
const productValidationRules = [
  body('name')
    .trim()
    .notEmpty().withMessage('Product name is required')
    .isLength({ max: 200 }).withMessage('Product name cannot exceed 200 characters'),
  
  body('description')
    .trim()
    .notEmpty().withMessage('Product description is required'),
  
  body('shortDescription')
    .optional()
    .trim()
    .isLength({ max: 300 }).withMessage('Short description cannot exceed 300 characters'),
  
  body('sku')
    .trim()
    .notEmpty().withMessage('SKU is required')
    .isLength({ max: 50 }).withMessage('SKU cannot exceed 50 characters'),
  
  body('basePrice')
    .isNumeric().withMessage('Base price must be a number')
    .isFloat({ min: 0 }).withMessage('Base price cannot be negative'),
  
  body('compareAtPrice')
    .optional()
    .isNumeric().withMessage('Compare at price must be a number')
    .isFloat({ min: 0 }).withMessage('Compare at price cannot be negative'),
  
  body('categories')
    .optional()
    .isArray().withMessage('Categories must be an array')
    .custom((value) => {
      if (value && value.length > 0) {
        return value.every(isValidObjectId);
      }
      return true;
    }).withMessage('Invalid category ID format'),
  
  body('tags')
    .optional()
    .isArray().withMessage('Tags must be an array'),
  
  body('images')
    .optional()
    .isArray().withMessage('Images must be an array'),
  
  body('images.*.url')
    .optional()
    .isURL().withMessage('Image URL must be a valid URL'),
  
  body('featuredImage.url')
    .optional()
    .isURL().withMessage('Featured image URL must be a valid URL'),
  
  body('isActive')
    .optional()
    .isBoolean().withMessage('isActive must be a boolean'),
  
  body('hasVariants')
    .optional()
    .isBoolean().withMessage('hasVariants must be a boolean'),
  
  body('collections')
    .optional()
    .isArray().withMessage('Collections must be an array'),
];

// Variant validation rules
const variantValidationRules = [
  body('product')
    .notEmpty().withMessage('Product ID is required')
    .custom(isValidObjectId).withMessage('Invalid product ID format'),
  
  body('name')
    .trim()
    .notEmpty().withMessage('Variant name is required'),
  
  body('sku')
    .trim()
    .notEmpty().withMessage('SKU is required')
    .isLength({ max: 50 }).withMessage('SKU cannot exceed 50 characters'),
  
  body('price')
    .isNumeric().withMessage('Price must be a number')
    .isFloat({ min: 0 }).withMessage('Price cannot be negative'),
  
  body('compareAtPrice')
    .optional()
    .isNumeric().withMessage('Compare at price must be a number')
    .isFloat({ min: 0 }).withMessage('Compare at price cannot be negative'),
  
  body('stockQuantity')
    .isInt({ min: 0 }).withMessage('Stock quantity must be a non-negative integer'),
  
  body('lowStockThreshold')
    .optional()
    .isInt({ min: 0 }).withMessage('Low stock threshold must be a non-negative integer'),
  
  body('weight')
    .optional()
    .isNumeric().withMessage('Weight must be a number')
    .isFloat({ min: 0 }).withMessage('Weight cannot be negative'),
  
  body('dimensions.length')
    .optional()
    .isNumeric().withMessage('Length must be a number')
    .isFloat({ min: 0 }).withMessage('Length cannot be negative'),
  
  body('dimensions.width')
    .optional()
    .isNumeric().withMessage('Width must be a number')
    .isFloat({ min: 0 }).withMessage('Width cannot be negative'),
  
  body('dimensions.height')
    .optional()
    .isNumeric().withMessage('Height must be a number')
    .isFloat({ min: 0 }).withMessage('Height cannot be negative'),
  
  body('isActive')
    .optional()
    .isBoolean().withMessage('isActive must be a boolean'),
  
  body('images')
    .optional()
    .isArray().withMessage('Images must be an array'),
  
  body('images.*.url')
    .optional()
    .isURL().withMessage('Image URL must be a valid URL'),
];

// Category validation rules
const categoryValidationRules = [
  body('name')
    .trim()
    .notEmpty().withMessage('Category name is required')
    .isLength({ max: 100 }).withMessage('Category name cannot exceed 100 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
  
  body('parent')
    .optional()
    .custom((value) => {
      if (value === null || value === '') return true;
      return isValidObjectId(value);
    }).withMessage('Invalid parent category ID format'),
  
  body('isActive')
    .optional()
    .isBoolean().withMessage('isActive must be a boolean'),
];

// Inventory transaction validation rules
const inventoryTransactionValidationRules = [
  body('variant')
    .notEmpty().withMessage('Variant ID is required')
    .custom(isValidObjectId).withMessage('Invalid variant ID format'),
  
  body('product')
    .notEmpty().withMessage('Product ID is required')
    .custom(isValidObjectId).withMessage('Invalid product ID format'),
  
  body('type')
    .notEmpty().withMessage('Transaction type is required')
    .isIn(['stock_in', 'stock_out', 'adjustment', 'returned']).withMessage('Invalid transaction type'),
  
  body('quantity')
    .isNumeric().withMessage('Quantity must be a number')
    .custom((value, { req }) => {
      if (req.body.type === 'stock_out' && value > 0) {
        return false; // Stock out should have negative quantity
      }
      if (req.body.type === 'stock_in' && value < 0) {
        return false; // Stock in should have positive quantity
      }
      return true;
    }).withMessage('Quantity should be positive for stock_in and negative for stock_out'),
  
  body('note')
    .optional()
    .trim(),
  
  body('referenceNumber')
    .optional()
    .trim(),
];

module.exports = {
  productValidationRules,
  variantValidationRules,
  categoryValidationRules,
  inventoryTransactionValidationRules,
  isValidObjectId
};