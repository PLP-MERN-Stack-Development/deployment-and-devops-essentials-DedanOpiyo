// routes/blogMediaRoutes.js
const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/admin");
const { ownerOrAdmin } = require("../middleware/ownerOrAdmin");
const { uploadBlogMedia } = require("../middleware/uploadMiddleware");
const blogMediaController = require("../controllers/blogMediaController");

// Anyone logged in can upload
router.post(
  "/media/upload",
  protect,
  uploadBlogMedia.single("file"),
  blogMediaController.upload
);

// Fetch media groups
router.get("/media/user", protect, blogMediaController.getUserMedia);
router.get("/media/post/:postId", protect, blogMediaController.getPostMedia);
router.get("/media/session/:sessionId", protect, blogMediaController.getSessionMedia);

// Fetch one media
router.get("/media/:filename", protect, blogMediaController.getSingle);

// Only owner or admin can delete
router.delete(
  "/media/:filename",
  protect,
  ownerOrAdmin,
  blogMediaController.remove
);

// Only owner or admin can replace
router.put(
  "/media/:filename",
  protect,
  ownerOrAdmin,
  uploadBlogMedia.single("file"),
  blogMediaController.replace
);

// Unused media cleanup
router.get("/cleanup/unused", protect, adminOnly, blogMediaController.findUnusedMedia);
router.delete("/cleanup/remove", protect, adminOnly, blogMediaController.deleteUnusedMedia);

module.exports = router;

// No endpoint to get the media because we store the url's in post / blog content

// This dedicated endpoint persists media for blogs
// posts.js simply uploads blog's 'featured' cover image
