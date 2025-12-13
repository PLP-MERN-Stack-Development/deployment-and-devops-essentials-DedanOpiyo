// routes/categories.js
const express = require("express");
const router = express.Router();

const categoryController = require('../controllers/categoryController');
const { protect } = require("../middleware/authMiddleware");
const { restrictTo } = require("../middleware/roleMiddleware");

// Create category (admin)
router.post('/', protect, restrictTo("admin"), categoryController.createCategory);

// Public fetch
router.get('/', categoryController.getAllCategories);

module.exports = router;

// Blog Categories