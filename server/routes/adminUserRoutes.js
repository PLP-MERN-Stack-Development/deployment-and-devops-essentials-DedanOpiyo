// routes/adminUserRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/admin.js");
const User = require("../models/User.js");

// Get all users
router.get("/", protect, adminOnly, async (req, res) => {
  const users = await User.find().select("-password");
  res.json({ users });
});

// Toggle user active/inactive
router.patch("/:id/toggle", protect, adminOnly, async (req, res) => {
  const user = await User.findById(req.params.id);
  user.active = !user.active;
  await user.save();
  res.json({ msg: "User status updated", user });
});

module.exports = router;

// Upgrade route later