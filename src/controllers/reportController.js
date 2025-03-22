const Product = require('../models/Product');
const Variant = require('../models/Variant');
const Category = require('../models/Category');
const InventoryTransaction = require('../models/Inventory');

/**
 * @desc    Get low stock report
 * @route   GET /api/reports/low-stock
 * @access  Private
 */
const getLowStockReport = async (req, res, next) => {
  try {
    // Find all variants with stock quantity below or equal to their low stock threshold
    const lowStockVariants = await Variant.find({
      $expr: { $lte: ['$stockQuantity', '$lowStockThreshold'] },
    })
      .sort({ stockQuantity: 1 })
      .populate('product', 'name slug sku');
    
    // Group variants by product
    const groupedByProduct = {};
    
    for (const variant of lowStockVariants) {
      const productId = variant.product._id.toString();
      
      if (!groupedByProduct[productId]) {
        groupedByProduct[productId] = {
          product: variant.product,
          variants: [],
        };
      }
      
      groupedByProduct[productId].variants.push(variant);
    }
    
    // Convert to array for response
    const report = Object.values(groupedByProduct);
    
    res.json({
      success: true,
      count: lowStockVariants.length,
      data: report,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get inventory value report
 * @route   GET /api/reports/inventory-value
 * @access  Private
 */
const getInventoryValueReport = async (req, res, next) => {
  try {
    // Aggregate to calculate inventory value
    const inventoryValue = await Variant.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: null,
          totalValue: { $sum: { $multiply: ['$stockQuantity', '$price'] } },
          totalItems: { $sum: '$stockQuantity' },
          variantCount: { $sum: 1 },
        },
      },
    ]);
    
    // Get inventory value by product
    const inventoryByProduct = await Variant.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$product',
          totalValue: { $sum: { $multiply: ['$stockQuantity', '$price'] } },
          totalItems: { $sum: '$stockQuantity' },
          variantCount: { $sum: 1 },
        },
      },
      { $sort: { totalValue: -1 } },
      { $limit: 20 }, // Top 20 products by value
    ]);
    
    // Populate product details
    await Product.populate(inventoryByProduct, {
      path: '_id',
      select: 'name slug sku',
      model: 'Product',
    });
    
    res.json({
      success: true,
      data: {
        summary: inventoryValue[0] || { totalValue: 0, totalItems: 0, variantCount: 0 },
        byProduct: inventoryByProduct.map(item => ({
          product: item._id,
          totalValue: item.totalValue,
          totalItems: item.totalItems,
          variantCount: item.variantCount,
        })),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get inventory movements report
 * @route   GET /api/reports/inventory-movements
 * @access  Private
 */
const getInventoryMovementsReport = async (req, res, next) => {
  try {
    // Parse date range
    const startDate = req.query.startDate
      ? new Date(req.query.startDate)
      : new Date(new Date().setMonth(new Date().getMonth() - 1)); // Default to 1 month ago
    
    const endDate = req.query.endDate
      ? new Date(req.query.endDate)
      : new Date(); // Default to current date
    
    endDate.setHours(23, 59, 59, 999); // End of day
    
    // Aggregate to calculate total movements by type
    const movementsByType = await InventoryTransaction.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: '$type',
          totalQuantity: { $sum: '$quantity' },
          transactionCount: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    
    // Aggregate to calculate movements by day
    const movementsByDay = await InventoryTransaction.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            type: '$type',
          },
          totalQuantity: { $sum: '$quantity' },
          transactionCount: { $sum: 1 },
        },
      },
      { $sort: { '_id.date': 1, '_id.type': 1 } },
    ]);
    
    // Format the movements by day for easier consumption
    const formattedMovementsByDay = {};
    
    for (const movement of movementsByDay) {
      const { date, type } = movement._id;
      
      if (!formattedMovementsByDay[date]) {
        formattedMovementsByDay[date] = {
          date,
          movements: {},
        };
      }
      
      formattedMovementsByDay[date].movements[type] = {
        totalQuantity: movement.totalQuantity,
        transactionCount: movement.transactionCount,
      };
    }
    
    res.json({
      success: true,
      data: {
        dateRange: {
          startDate,
          endDate,
        },
        summary: movementsByType,
        daily: Object.values(formattedMovementsByDay),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get catalog statistics
 * @route   GET /api/reports/catalog-stats
 * @access  Private
 */
const getCatalogStats = async (req, res, next) => {
  try {
    // Get product count
    const totalProducts = await Product.countDocuments();
    const activeProducts = await Product.countDocuments({ isActive: true });
    
    // Get variant count
    const totalVariants = await Variant.countDocuments();
    const activeVariants = await Variant.countDocuments({ isActive: true });
    
    // Get category count
    const totalCategories = await Category.countDocuments();
    const activeCategories = await Category.countDocuments({ isActive: true });
    
    // Products with variants
    const productsWithVariants = await Product.countDocuments({ hasVariants: true });
    
    // Products by category
    const productsByCategory = await Product.aggregate([
      { $unwind: '$categories' },
      {
        $group: {
          _id: '$categories',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);
    
    // Populate category details
    await Category.populate(productsByCategory, {
      path: '_id',
      select: 'name slug',
      model: 'Category',
    });
    
    res.json({
      success: true,
      data: {
        products: {
          total: totalProducts,
          active: activeProducts,
          withVariants: productsWithVariants,
        },
        variants: {
          total: totalVariants,
          active: activeVariants,
        },
        categories: {
          total: totalCategories,
          active: activeCategories,
        },
        productsByCategory: productsByCategory.map(item => ({
          category: item._id,
          count: item.count,
        })),
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getLowStockReport,
  getInventoryValueReport,
  getInventoryMovementsReport,
  getCatalogStats,
};