const Product = require('../models/Product');
const { successResponse, errorResponse } = require('../middlewares/response');

exports.createProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json(product);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find().populate('category');
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(product);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Product deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getProducts = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;
  
      const [products, total] = await Promise.all([
        Product.find().skip(skip).limit(limit),
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
    } catch (err) {
      errorResponse(res, 'Failed to fetch products', 500);
    }
  };
