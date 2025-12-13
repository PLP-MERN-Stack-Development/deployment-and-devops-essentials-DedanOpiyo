// routes/blogRoutes.js
const express = require("express");
const router = express.Router();
const { uploadBlogMedia } = require("../middleware/uploadMiddleware");
const { protect } = require("../middleware/authMiddleware");

router.post(
  "/media",
  protect,
  uploadBlogMedia.single("media"),
  (req, res) => {
    const fileUrl = `/uploads/blog/${req.file.filename}`;
    res.json({ url: fileUrl });
  }
);

module.exports = router;

// This dedicated endpoint persists media for blogs
// posts.js simply uploads blog's 'featured' cover image