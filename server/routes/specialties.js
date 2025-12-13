// routes/specialties.js
const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const { restrictTo } = require("../middleware/roleMiddleware");

const {
  createSpecialty,
  getAllSpecialties,
  updateSpecialty,
  deleteSpecialty
} = require("../controllers/specialtyController");

// Admin create
router.post(
  "/",
  protect,
  restrictTo("admin"),
  createSpecialty
);

// Public view
router.get("/", getAllSpecialties);

router.put(
  "/:id",
  protect,
  restrictTo("admin"),
  updateSpecialty
);

router.delete(
  "/:id",
  protect,
  restrictTo("admin"),
  deleteSpecialty
);

module.exports = router;
