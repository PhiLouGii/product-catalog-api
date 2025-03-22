const express = require("express");
const router = express.Router();
const {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");

// Create a new category 
router.post("/", createCategory);

// Get all categories 
router.get("/", getAllCategories);

// Get a single category 
router.get("/:id", getCategoryById);

// Update a category 
router.put("/:id", updateCategory);

// Delete a category
router.delete("/:id", deleteCategory);

module.exports = router;



