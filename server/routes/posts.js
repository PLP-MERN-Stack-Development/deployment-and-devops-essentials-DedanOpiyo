// routes/posts.js
const express = require('express');
const router = express.Router();

const postController = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');
const { restrictTo } = require("../middleware/roleMiddleware");
const { createPostSchema } = require('../validation/postValidation');
const validate = require('../middleware/validateMiddleware');
const { uploadGeneral } = require("../middleware/uploadMiddleware");

// Create post (admin or doctor)
router.post(
  "/",
  protect,
  validate(createPostSchema),
  restrictTo("admin", "doctor"),
  uploadGeneral.single("featuredImage"),
  postController.createPost
);

// Get all published posts
router.get("/search", postController.searchPosts); // before dynamic
router.get('/', postController.getAllPosts); 
router.get('/:id', postController.getPost);

// Get one post by slug (Not used - id used instead)
router.get("/:slug", postController.getPostBySlug); 

// Comment on post (patients only)
router.post(
  "/:id/comment", 
  protect, 
  restrictTo("patient"),
  postController.addComment
); // Comments 

router.put(
  "/:id",
  protect,
  uploadGeneral.single("featuredImage"),
  postController.updatePost
);
router.delete('/:id', protect, postController.deletePost);

module.exports = router;

// Blog route