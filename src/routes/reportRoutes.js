const express = require('express');
const router = express.Router();
const {
  getLowStockReport,
  getInventoryValueReport,
  getInventoryMovementsReport,
  getCatalogStats,
} = require('../controllers/reportController');

/**
 * @swagger
 * tags:
 *   name: Reports
 *   description: Reporting endpoints
 */

/**
 * @swagger
 * /api/reports/low-stock:
 *   get:
 *     summary: Get low stock report
 *     tags: [Reports]
 *     description: Fetches a report of products and variants with stock below or at their low stock threshold
 *     responses:
 *       200:
 *         description: Low stock report
 */
router.get('/low-stock', getLowStockReport);

/**
 * @swagger
 * /api/reports/inventory-value:
 *   get:
 *     summary: Get inventory value report
 *     tags: [Reports]
 *     description: Calculates the total value of inventory and breakdown by product
 *     responses:
 *       200:
 *         description: Inventory value report
 */
router.get('/inventory-value', getInventoryValueReport);

/**
 * @swagger
 * /api/reports/inventory-movements:
 *   get:
 *     summary: Get inventory movements report
 *     tags: [Reports]
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for report period
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for report period
 *     description: Provides a report of inventory movement activities for a specified period
 *     responses:
 *       200:
 *         description: Inventory movements report
 */
router.get('/inventory-movements', getInventoryMovementsReport);

/**
 * @swagger
 * /api/reports/catalog-stats:
 *   get:
 *     summary: Get catalog statistics
 *     tags: [Reports]
 *     description: Provides statistics about the product catalog
 *     responses:
 *       200:
 *         description: Catalog statistics
 */
router.get('/catalog-stats', getCatalogStats);

router.get('/low-stock', async (req, res) => {
  const threshold = req.query.threshold || 10;
  const products = await Product.find({
    'variants.inventory': { $lt: threshold }
  });
  res.json(products);
});

module.exports = router;