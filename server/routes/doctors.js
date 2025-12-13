// routes/doctors.js
const express = require("express");
const router = express.Router();

const { uploadGeneral } = require("../middleware/uploadMiddleware");
const { protect } = require("../middleware/authMiddleware");
const { restrictTo } = require("../middleware/roleMiddleware");

const {
  getAllDoctors,
  getDoctorProfile,
  updateDoctorProfile,
  getMyProfile,
  getMyFee, 
  updateMyFee
} = require("../controllers/doctorController");

// Doctor-only
router.put(
  "/profile",
  protect,
  restrictTo("doctor"),
  uploadGeneral.single("picture"),
  updateDoctorProfile
);

router.get("/profile", protect, restrictTo("doctor"), getMyProfile);
router.get("/me/fee", protect, restrictTo("doctor"), getMyFee);
router.put("/me/fee", protect, restrictTo("doctor"), updateMyFee);

// Public
router.get("/", getAllDoctors);
router.get("/:id", getDoctorProfile);

module.exports = router;

// Doctor profile & admin doctor listing.