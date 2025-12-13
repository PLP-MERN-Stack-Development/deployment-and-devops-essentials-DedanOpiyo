// controllers/categoryController.js
const Category = require('../models/Category');

// Get all categories
exports.getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (err) {
    // next(err);
    res.status(500).json({ message: err.message });
  }
};

// Create new category
exports.createCategory = async (req, res, next) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json(category);
  } catch (err) {
    // next(err);
    res.status(500).json({ message: err.message });
  }
};

// Blog Categories