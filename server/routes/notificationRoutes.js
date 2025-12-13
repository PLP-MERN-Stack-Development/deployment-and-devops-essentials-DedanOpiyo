// routes/notificationRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const notificationController = require("../controllers/notificationController");

router.get("/", protect, notificationController.getUserNotifications);
router.patch("/:id/read", protect, notificationController.markAsRead);
router.patch("/read-all", protect, notificationController.markAllAsRead);

module.exports = router;
