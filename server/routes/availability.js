// routes/availability.js
const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const { restrictTo } = require("../middleware/roleMiddleware");

const {
  addAvailability,
  getDoctorAvailability,
  updateAvailability,
  deleteAvailability,
  getMyAvailability
} = require("../controllers/doctorAvailabilityController");

// Doctor-only
router.post(
  "/",
  protect,
  restrictTo("doctor"),
  addAvailability
);

// Doctor self-view route (must be above /:id)
router.get(
  "/me",
  protect,
  restrictTo("doctor"),
  getMyAvailability
);

router.put("/:id", protect, restrictTo("doctor"), updateAvailability);
router.delete("/:id", protect, restrictTo("doctor"), deleteAvailability);

// Public
router.get("/:id", getDoctorAvailability);

module.exports = router;

// Doctor adds availability; public can view.