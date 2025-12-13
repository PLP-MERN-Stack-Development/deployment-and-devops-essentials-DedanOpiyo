// routes/adminStatsRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/admin.js");
const User = require("../models/User.js");
const Appointment = require("../models/Appointment.js");
// const Doctor = require("../models/Doctor.js");

router.get("/", protect, adminOnly, async (req, res) => {
  const totalUsers = await User.countDocuments();
  // const totalDoctors = await Doctor.countDocuments();
  const totalDoctors = await User.countDocuments({ role: "doctor" });
  const totalAppointments = await Appointment.countDocuments();
  const completedAppointments = await Appointment.countDocuments({ status: "completed" });

  res.json({
    totalUsers,
    totalDoctors,
    totalAppointments,
    completedAppointments,
  });
});

module.exports = router;

// Admin — System Dashboard Stats