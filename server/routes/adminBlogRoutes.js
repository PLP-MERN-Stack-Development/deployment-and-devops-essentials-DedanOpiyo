// routes/adminBlogRoutes.js (Or adminPostRoutes.js if you like)
const express = require('express');
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/admin.js");
const Post = require("../models/Post.js");

// Get all blogs
router.get("/", protect, adminOnly, async (req, res) => {
  const blogs = await Post.find().populate("author", "name");
  res.json({ blogs });
});

// Delete blog
router.delete("/:id", protect, adminOnly, async (req, res) => {
  await Post.findByIdAndDelete(req.params.id);
  res.json({ msg: "Blog removed" });
});

module.exports = router;

// Admin — Blog / Post Management Routes

// Admins can:
// delete any blog

// edit any blog

// view all blogs
