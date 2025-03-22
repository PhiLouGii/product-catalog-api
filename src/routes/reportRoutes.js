const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

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
 *     summary: Get low stock products
 *     tags: [Reports]
 *     parameters:
 *       - in: query
 *         name: threshold
 *         schema:
 *           type: integer
 *           minimum: 0
 *         example: 10
 *     responses:
 *       200:
 *         description: Low stock products
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 - name: "Product A"
 *                   variants:
 *                     - sku: "A123"
 *                       inventory: 5
 *       500:
 *         description: Server error
 */
router.get('/low-stock', async (req, res) => {
  try {
    const threshold = parseInt(req.query.threshold) || 10;
    
    const products = await Product.find({
      'variants.inventory': { $lt: threshold }
    }).populate('categories');

    res.json({ 
      success: true,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to generate low stock report"
    });
  }
});

module.exports = router;