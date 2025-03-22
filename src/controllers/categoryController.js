const Category = require("../models/Category");
const Product = require("../models/Product");

// Create a new category
exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    const category = new Category({
      name,
      description,
    });

    await category.save();
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    // Handle duplicate key error (category name already exists)
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ success: false, message: "Category name already exists" });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json({ success: true, count: categories.length, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get a single category
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    res.json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update a category
exports.updateCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name, description },
      { new: true, runValidators: true }
    );

    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    res.json({ success: true, data: category });
  } catch (error) {
    // Handle duplicate key error
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ success: false, message: "Category name already exists" });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a category
exports.deleteCategory = async (req, res) => {
  try {
    // Check if there are products using this category
    const products = await Product.find({ category: req.params.id });

    if (products.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete category with associated products",
      });
    }

    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    res.json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
