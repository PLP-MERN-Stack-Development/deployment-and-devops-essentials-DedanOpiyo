// routes/hospitals.js
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/admin");

const {
  createHospital,
  getHospitals,
  deleteHospital,
  searchHospitals,
  getHospital
} = require("../controllers/hospitalController");

router.get("/", getHospitals);
router.get("/search", searchHospitals);
router.post("/", protect, adminOnly, createHospital);
router.get("/:id", protect, getHospital);
router.delete("/:id", protect, adminOnly, deleteHospital);

module.exports = router;
