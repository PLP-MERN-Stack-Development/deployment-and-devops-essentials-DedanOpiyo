// controllers/doctorController.js
const User = require("../models/User");
const DoctorAvailability = require("../models/DoctorAvailability");
const FeePolicy = require("../models/FeePolicy");

const fs = require("fs");
const path = require("path");

// @desc Get all doctors
// @route GET /api/doctors
// @access Public
exports.getAllDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ role: "doctor" })
      .populate("specialty", "name")
      .select("-password");

    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Get doctor profile
// @route GET /api/doctors/:id
// @access Public
exports.getDoctorProfile = async (req, res) => {
  try {
    const doctor = await User.findOne({ _id: req.params.id, role: "doctor" })
      .populate("specialty", "name")
      .select("-password");

    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    res.json(doctor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Get Doctor profile
// @route GET /api/doctors/profile
// @access Doctor only
exports.getMyProfile = async (req, res) => {
  try {
    const doctor = await User.findOne({ _id: req.user._id })
      .populate("specialty", "name")
      .select("-password");

    res.json(doctor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Update doctor profile (bio, specialty, picture)
// @route PUT /api/doctors/profile
// @access Doctor only
exports.updateDoctorProfile = async (req, res) => {
  try {
    const doctor = await User.findById(req.user._id);
    if (!doctor || doctor.role !== "doctor") {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const { bio, specialty, removePicture, currentHospital } = req.body;

    // Update bio
    if (bio !== undefined) doctor.bio = bio;

    // Update or clear specialty
    if (specialty === "") doctor.specialty = null;
    else if (specialty !== undefined) doctor.specialty = specialty;

    // Update current hospital (allow clearing)
    if (currentHospital === "") doctor.currentHospital = null;
    else if (currentHospital !== undefined) doctor.currentHospital = currentHospital;

    // Handle remove picture
    if (removePicture === "true") {
      if (doctor.picture) {
        const filePath = path.join("uploads", doctor.picture);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      }
      doctor.picture = null;
    }

    // Handle new picture upload
    if (req.file) {
      // Delete old file
      if (doctor.picture) {
        const oldPath = path.join("uploads", doctor.picture);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      doctor.picture = req.file.filename;
    }

    await doctor.save();
    res.json(doctor);
  } catch (err) {
    console.error("Update doctor profile error:", err);
    res.status(500).json({ message: "Server error updating profile" });
  }
};

// Get my fee
// @access Doctor only
exports.getMyFee = async (req, res) => {
  const doctor = await User.findById(req.user._id).populate("specialty");

  const policy = await FeePolicy.findOne({ specialty: doctor.specialty?._id });

  res.json({
    fee: doctor.fee,
    specialty: doctor.specialty?.name,
    policy,       // includes min, max, defaultFee, allowPatientInput
  });
};

// Update my fee
// @access Doctor only
exports.updateMyFee = async (req, res) => {
  const { fee } = req.body;

  if (fee === null || fee === undefined || fee < 0)
    return res.status(400).json({ message: "Invalid fee" });

  const doctor = await User.findById(req.user._id).populate("specialty");
  const policy = await FeePolicy.findOne({ specialty: doctor.specialty });

  if (policy) {
    if (fee < policy.min || fee > policy.max) {
      return res.status(400).json({
        message: `Your specialty policy requires fee between ${policy.min} - ${policy.max}`,
      });
    }
  }

  doctor.fee = fee;
  await doctor.save();

  res.json({ message: "Fee updated", fee });
};

// Handles doctor list, profile, and profile edit.