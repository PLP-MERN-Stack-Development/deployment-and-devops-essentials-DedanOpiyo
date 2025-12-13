// routes/experience.js
const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const { restrictTo } = require("../middleware/roleMiddleware");

const {
  addExperience,
  getDoctorExperience,
  updateExperience,deleteExperience
} = require("../controllers/experienceController");

router.post("/", protect, restrictTo("doctor"), addExperience);
router.get("/:id", getDoctorExperience);

router.put("/:id", protect, restrictTo("doctor"), updateExperience);
router.delete("/:id", protect, restrictTo("doctor"), deleteExperience);

module.exports = router;
