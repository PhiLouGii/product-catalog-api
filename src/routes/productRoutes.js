const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { validateProduct } = require('../controllers/productController');

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
 *     summary: Create new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Product created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               error:
 *                 code: 400
 *                 message: "Validation failed: Name is required"
 */
router.post('/', validateProduct, productController.createProduct);

/**
 * @swagger
 * /api/products/bulk:
 *   post:
 *     summary: Create multiple products
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Products created
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               createdCount: 5
 *       400:
 *         description: Bulk operation failed
 */
router.post('/bulk', productController.bulkCreateProducts);

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get paginated products
 *     tags: [Products]
 *     parameters:
 *       - $ref: '#/components/parameters/pageParam'
 *       - $ref: '#/components/parameters/limitParam'
 *       - $ref: '#/components/parameters/sortParam'
 *     responses:
 *       200:
 *         description: Product list
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedProducts'
 *       500:
 *         description: Server error
 */
router.get('/', productController.getProducts);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get product by ID
 *     tags: [Products]
 *     parameters:
 *       - $ref: '#/components/parameters/productIdParam'
 *     responses:
 *       200:
 *         description: Product details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 */
router.get('/:id', productController.getProductById);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update product
 *     tags: [Products]
 *     parameters:
 *       - $ref: '#/components/parameters/productIdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Updated product
 *       400:
 *         description: Validation error
 *       404:
 *         description: Product not found
 */
router.put('/:id', validateProduct, productController.updateProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete product
 *     tags: [Products]
 *     parameters:
 *       - $ref: '#/components/parameters/productIdParam'
 *     responses:
 *       204:
 *         description: Product deleted
 *       404:
 *         description: Product not found
 */
router.delete('/:id', productController.deleteProduct);

/**
 * @swagger
 * /api/products/search:
 *   get:
 *     summary: Advanced product search
 *     tags: [Products]
 *     parameters:
 *       - $ref: '#/components/parameters/searchQuery'
 *       - $ref: '#/components/parameters/minPriceParam'
 *       - $ref: '#/components/parameters/maxPriceParam'
 *       - $ref: '#/components/parameters/categoryParam'
 *       - $ref: '#/components/parameters/colorParam'
 *       - $ref: '#/components/parameters/sizeParam'
 *       - $ref: '#/components/parameters/pageParam'
 *       - $ref: '#/components/parameters/limitParam'
 *     responses:
 *       200:
 *         description: Search results
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedProducts'
 *       400:
 *         description: Invalid filters
 */
router.get('/search', productController.searchProducts);

module.exports = router;