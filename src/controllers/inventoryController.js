const Variant = require('../models/Variant');
const InventoryTransaction = require('../models/Inventory');
const { generatePaginationMetadata } = require('../utils/helpers');

/**
 * @desc    Update inventory for a variant
 * @route   POST /api/inventory/update
 * @access  Private
 */
const updateInventory = async (req, res, next) => {
  try {
    const { variant, product, type, quantity, note, referenceNumber } = req.body;
    
    // Find the variant
    const variantToUpdate = await Variant.findById(variant);
    
    if (!variantToUpdate) {
      res.status(404);
      throw new Error('Variant not found');
    }
    
    // Ensure the variant belongs to the specified product
    if (variantToUpdate.product.toString() !== product) {
      res.status(400);
      throw new Error('Variant does not belong to the specified product');
    }
    
    // Calculate new stock quantity
    const previousQuantity = variantToUpdate.stockQuantity;
    let newQuantity = previousQuantity;
    
    switch (type) {
      case 'stock_in':
        newQuantity = previousQuantity + quantity;
        break;
      case 'stock_out':
        newQuantity = previousQuantity - Math.abs(quantity);
        // Prevent negative inventory
        if (newQuantity < 0) {
          res.status(400);
          throw new Error('Insufficient stock quantity');
        }
        break;
      case 'adjustment':
        newQuantity = quantity;
        break;
      case 'returned':
        newQuantity = previousQuantity + quantity;
        break;
      default:
        res.status(400);
        throw new Error('Invalid transaction type');
    }
    
    // Create inventory transaction
    const transaction = await InventoryTransaction.create({
      variant,
      product,
      type,
      quantity: type === 'adjustment' ? quantity - previousQuantity : quantity,
      previousQuantity,
      newQuantity,
      note,
      referenceNumber,
      createdBy: req.body.createdBy || 'system',
    });
    
    // Update variant stock quantity
    variantToUpdate.stockQuantity = newQuantity;
    await variantToUpdate.save();
    
    res.status(201).json({
      success: true,
      data: {
        transaction,
        variant: variantToUpdate,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get inventory transactions for a product
 * @route   GET /api/inventory/product/:productId
 * @access  Private
 */
const getProductInventoryTransactions = async (req, res, next) => {
  try {
    const page = Number.parseInt(req.query.page, 10) || 1;
    const limit = Number.parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;
    
    // Build filter
    const filter = { product: req.params.productId };
    
    // Filter by transaction type if specified
    if (req.query.type) {
      filter.type = req.query.type;
    }
    
    // Date range filter
    if (req.query.startDate || req.query.endDate) {
      filter.createdAt = {};
      if (req.query.startDate) {
        filter.createdAt.$gte = new Date(req.query.startDate);
      }
      if (req.query.endDate) {
        const endDate = new Date(req.query.endDate);
        endDate.setHours(23, 59, 59, 999);
        filter.createdAt.$lte = endDate;
      }
    }
    
    // Count total documents for pagination
    const totalTransactions = await InventoryTransaction.countDocuments(filter);
    
    // Get transactions
    const transactions = await InventoryTransaction.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate('variant', 'name sku');
    
    // Generate pagination metadata
    const pagination = generatePaginationMetadata(page, limit, totalTransactions);
    
    res.json({
      success: true,
      pagination,
      data: transactions,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get inventory transactions for a variant
 * @route   GET /api/inventory/variant/:variantId
 * @access  Private
 */
const getVariantInventoryTransactions = async (req, res, next) => {
  try {
    const page = Number.parseInt(req.query.page, 10) || 1;
    const limit = Number.parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;
    
    // Build filter
    const filter = { variant: req.params.variantId };
    
    // Filter by transaction type if specified
    if (req.query.type) {
      filter.type = req.query.type;
    }
    
    // Date range filter
    if (req.query.startDate || req.query.endDate) {
      filter.createdAt = {};
      if (req.query.startDate) {
        filter.createdAt.$gte = new Date(req.query.startDate);
      }
      if (req.query.endDate) {
        const endDate = new Date(req.query.endDate);
        endDate.setHours(23, 59, 59, 999);
        filter.createdAt.$lte = endDate;
      }
    }
    
    // Count total documents for pagination
    const totalTransactions = await InventoryTransaction.countDocuments(filter);
    
    // Get transactions
    const transactions = await InventoryTransaction.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    
    // Generate pagination metadata
    const pagination = generatePaginationMetadata(page, limit, totalTransactions);
    
    res.json({
      success: true,
      pagination,
      data: transactions,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all inventory transactions
 * @route   GET /api/inventory/transactions
 * @access  Private
 */
const getAllInventoryTransactions = async (req, res, next) => {
  try {
    const page = Number.parseInt(req.query.page, 10) || 1;
    const limit = Number.parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;
    
    // Build filter
    const filter = {};
    
    // Filter by transaction type if specified
    if (req.query.type) {
      filter.type = req.query.type;
    }
    
    // Date range filter
    if (req.query.startDate || req.query.endDate) {
      filter.createdAt = {};
      if (req.query.startDate) {
        filter.createdAt.$gte = new Date(req.query.startDate);
      }
      if (req.query.endDate) {
        const endDate = new Date(req.query.endDate);
        endDate.setHours(23, 59, 59, 999);
        filter.createdAt.$lte = endDate;
      }
    }
    
    // Count total documents for pagination
    const totalTransactions = await InventoryTransaction.countDocuments(filter);
    
    // Get transactions
    const transactions = await InventoryTransaction.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate('variant', 'name sku')
      .populate('product', 'name slug');
    
    // Generate pagination metadata
    const pagination = generatePaginationMetadata(page, limit, totalTransactions);
    
    res.json({
      success: true,
      pagination,
      data: transactions,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current inventory levels
 * @route   GET /api/inventory/levels
 * @access  Private
 */
const getInventoryLevels = async (req, res, next) => {
  try {
    const page = Number.parseInt(req.query.page, 10) || 1;
    const limit = Number.parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;
    
    // Build filter
    const filter = {};
    
    // Filter for low stock if requested
    if (req.query.lowStock === 'true') {
      filter.$expr = { $lte: ['$stockQuantity', '$lowStockThreshold'] };
    }
    
    // Filter by stock status
    if (req.query.stockStatus === 'in_stock') {
      filter.stockQuantity = { $gt: 0 };
    } else if (req.query.stockStatus === 'out_of_stock') {
      filter.stockQuantity = 0;
    }
    
    // Count total documents for pagination
    const totalVariants = await Variant.countDocuments(filter);
    
    // Get variants with inventory info
    const variants = await Variant.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ stockQuantity: 1 })
      .populate('product', 'name slug');
    
    // Generate pagination metadata
    const pagination = generatePaginationMetadata(page, limit, totalVariants);
    
    res.json({
      success: true,
      pagination,
      data: variants,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  updateInventory,
  getProductInventoryTransactions,
  getVariantInventoryTransactions,
  getAllInventoryTransactions,
  getInventoryLevels,
};