const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { successResponse, errorResponse } = require('../utils/response');
const Product = require('../models/Product');

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management endpoints
 */

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *           example:
 *             name: "Premium Wireless Headphones"
 *             description: "Noise-cancelling Bluetooth headphones"
 *             price: 299.99
 *             variants:
 *               - name: "Midnight Black"
 *                 sku: "HP-MB-2023"
 *                 price: 299.99
 *                 inventory: 50
 *                 attributes:
 *                   color: "Black"
 *                   size: "Standard"
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               error:
 *                 code: 400
 *                 message: "Validation failed: Name is required"
 */
router.post('/', productController.createProduct);

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: Items per page
 *     responses:
 *       200:
 *         description: List of products with pagination
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     pages:
 *                       type: integer
 *       500:
 *         description: Server error
 */
router.get('/', productController.getProducts);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update a product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: mongoId
 *         description: MongoDB product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Product not found
 */
router.put('/:id', productController.updateProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete a product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: mongoId
 *         description: MongoDB product ID
 *     responses:
 *       204:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 */
router.delete('/:id', productController.deleteProduct);

/**
 * @swagger
 * /api/products/search:
 *   get:
 *     summary: Search products with filters
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Text search query
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *           minimum: 0
 *         description: Minimum price filter
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *           minimum: 0
 *         description: Maximum price filter
 *       - in: query
 *         name: color
 *         schema:
 *           type: string
 *         description: Filter by variant color
 *       - in: query
 *         name: size
 *         schema:
 *           type: string
 *         description: Filter by variant size
 *     responses:
 *       200:
 *         description: Successful search results
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       400:
 *         description: Invalid search parameters
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               error:
 *                 code: 400
 *                 message: "Invalid price range"
 */
router.get('/search', async (req, res) => {
  try {
    const { q, minPrice, maxPrice, color, size } = req.query;
    const filter = {};

    // Text search
    if (q) filter.$text = { $search: q };

    // Price range filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
      
      if (minPrice > maxPrice) {
        return errorResponse(res, 'Invalid price range', 400);
      }
    }

    // Variant filters
    if (color) filter['variants.attributes.color'] = color;
    if (size) filter['variants.attributes.size'] = size;

    const products = await Product.find(filter);
    successResponse(res, products);
  } catch (err) {
    errorResponse(res, 'Search failed: ' + err.message, 400);
  }
});

module.exports = router;