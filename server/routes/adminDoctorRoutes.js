// routes/adminDoctorRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/admin.js");
const { uploadGeneral } = require("../middleware/uploadMiddleware");
// const Doctor = require("../models/Doctor.js");
const User = require("../models/User.js");

const fs = require("fs");
const path = require("path");

// Get all doctors
router.get("/", protect, adminOnly, async (req, res) => {
  try {
    // const doctors = await Doctor.find().populate("user", "name email");
    const doctors = await User.find({ role: "doctor" })
      .populate("specialty", "name")
      .select("username email specialty bio picture createdAt");

    res.json(doctors);
  } catch (err) {
    console.error("Admin Get Doctors Error:", err);
    res.status(500).json({ msg: "Server error retrieving doctors" });
  }
});

// Promote user → doctor
router.post("/promote", protect, adminOnly, async (req, res) => {
  try {
    const { userId, bio, specialty } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: "User not found" });

    user.role = "doctor";
    if (bio) user.bio = bio;
    if (specialty) user.specialty = specialty;

    await user.save();

//   const doctor = await Doctor.create({
//     user: userId,
//     name: user.name,
//     specialty,
//     bio,
//   });

    res.json({ msg: "User promoted to doctor", user }); // doctor
  } catch (err) {
    console.error("Promote Error:", err);
    res.status(500).json({ msg: "Server error promoting user" });
  }
});

// Update doctor profile
router.put("/:doctorId", protect, adminOnly, uploadGeneral.single("picture"), async (req, res) => {
  try {
    const { doctorId } = req.params;

    // After using multer:
    const { bio, specialty, currentHospital } = req.body;
    const picture = req.file ? req.file.filename : undefined;

    const doctor = await User.findById(doctorId);
    if (!doctor || doctor.role !== "doctor")
      return res.status(404).json({ msg: "Doctor not found" });

    if (bio !== undefined) doctor.bio = bio;

    // handle specialty safely
    if (specialty === "") {
      doctor.specialty = null;
    } else if (specialty !== undefined) {
      doctor.specialty = specialty;
    }

    // Update current hospital (allow clearing)
    if (currentHospital === "") doctor.currentHospital = null;
    else if (currentHospital !== undefined) doctor.currentHospital = currentHospital;

    // Handle removePicture
    if (req.body.removePicture === "true") {
      if (doctor.picture) {
        const filePath = path.join("uploads", doctor.picture);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      }
      doctor.picture = null;
    }

    if (picture !== undefined) doctor.picture = picture;

    await doctor.save();

    res.json({ msg: "Doctor updated", doctor });
  } catch (err) {
    console.error("Update Doctor Error:", err);
    res.status(500).json({ msg: "Server error updating doctor" });
  }
});

// Delete doctor
router.delete("/:doctorId", protect, adminOnly, async (req, res) => {
  try {
    const { doctorId } = req.params;

    const doctor = await User.findById(doctorId);
    if (!doctor || doctor.role !== "doctor")
      return res.status(404).json({ msg: "Doctor not found" });

    await doctor.deleteOne();

    res.json({ msg: "Doctor removed" });
  } catch (err) {
    console.error("Delete Doctor Error:", err);
    res.status(500).json({ msg: "Server error deleting doctor" });
  }
});

module.exports = router;


// Create Doctor model

// Admin — Doctor Management Routes

// Admins can:
// Approve doctor registration

// Promote a user to “doctor”

// Edit doctor profiles

// Delete doctor profiles
