const express = require('express');
const router = express.Router();
const {
  updateInventory,
  getProductInventoryTransactions,
  getVariantInventoryTransactions,
  getAllInventoryTransactions,
  getInventoryLevels,
} = require('../controllers/inventoryController');
const { inventoryTransactionValidationRules } = require('../utils/validators');
const validateRequest = require('../middlewares/validateRequest');

/**
 * @swagger
 * tags:
 *   name: Inventory
 *   description: Inventory management
 */

/**
 * @swagger
 * /api/inventory/update:
 *   post:
 *     summary: Update inventory for a variant
 *     tags: [Inventory]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - variant
 *               - product
 *               - type
 *               - quantity
 *             properties:
 *               variant:
 *                 type: string
 *                 description: Variant ID
 *               product:
 *                 type: string
 *                 description: Product ID
 *               type:
 *                 type: string
 *                 enum: [stock_in, stock_out, adjustment, returned]
 *                 description: Transaction type
 *               quantity:
 *                 type: number
 *                 description: Quantity to add/remove/set
 *               note:
 *                 type: string
 *                 description: Optional note
 *               referenceNumber:
 *                 type: string
 *                 description: Optional reference number
 *               createdBy:
 *                 type: string
 *                 description: User who created the transaction
 *     responses:
 *       201:
 *         description: Inventory updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Variant not found
 */
router.post('/update', inventoryTransactionValidationRules, validateRequest, updateInventory);

/**
 * @swagger
 * /api/inventory/levels:
 *   get:
 *     summary: Get current inventory levels
 *     tags: [Inventory]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *       - in: query
 *         name: lowStock
 *         schema:
 *           type: boolean
 *         description: Filter for low stock items
 *       - in: query
 *         name: stockStatus
 *         schema:
 *           type: string
 *           enum: [in_stock, out_of_stock]
 *         description: Filter by stock status
 *     responses:
 *       200:
 *         description: Current inventory levels
 */
router.get('/levels', getInventoryLevels);

/**
 * @swagger
 * /api/inventory/transactions:
 *   get:
 *     summary: Get all inventory transactions
 *     tags: [Inventory]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [stock_in, stock_out, adjustment, returned]
 *         description: Filter by transaction type
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for filtering
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for filtering
 *     responses:
 *       200:
 *         description: List of inventory transactions
 */
router.get('/transactions', getAllInventoryTransactions);

/**
 * @swagger
 * /api/inventory/product/{productId}:
 *   get:
 *     summary: Get inventory transactions for a product
 *     tags: [Inventory]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [stock_in, stock_out, adjustment, returned]
 *         description: Filter by transaction type
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for filtering
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for filtering
 *     responses:
 *       200:
 *         description: List of inventory transactions for a product
 */
router.get('/product/:productId', getProductInventoryTransactions);

/**
 * @swagger
 * /api/inventory/variant/{variantId}:
 *   get:
 *     summary: Get inventory transactions for a variant
 *     tags: [Inventory]
 *     parameters:
 *       - in: path
 *         name: variantId
 *         required: true
 *         schema:
 *           type: string
 *         description: Variant ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [stock_in, stock_out, adjustment, returned]
 *         description: Filter by transaction type
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for filtering
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for filtering
 *     responses:
 *       200:
 *         description: List of inventory transactions for a variant
 */
router.get('/variant/:variantId', getVariantInventoryTransactions);

module.exports = router;