// routes/helpRoutes.js
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/admin");
const { uploadHelpScreenshots } = require("../middleware/uploadMiddleware");

const {
  createIssue,
  getAllIssues,
  updateStatus,
  createPart,
  getParts,
  getPartBySlug
} = require("../controllers/helpController");

// USERS — report issue
router.post(
  "/",
  protect,
  uploadHelpScreenshots.array("screenshots", 3),
  createIssue
);

// ADMIN — manage issues
router.get("/", protect, adminOnly, getAllIssues);
router.put("/:id/status", protect, adminOnly, updateStatus);

// HELP PARTS
router.get("/parts/list", getParts);
router.get("/parts/slug/:slug", getPartBySlug);
router.post("/parts", protect, adminOnly, createPart);

module.exports = router;
