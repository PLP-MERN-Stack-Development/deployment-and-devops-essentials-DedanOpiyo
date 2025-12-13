// controllers/specialtyController.js
const Specialty = require("../models/Specialty");

// @desc Create specialty (admin only)
// @route POST /api/specialties
// @access Admin
exports.createSpecialty = async (req, res) => {
  try {
    const specialty = await Specialty.create(req.body);
    res.status(201).json(specialty);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Get all specialties
// @route GET /api/specialties
// @access Public
exports.getAllSpecialties = async (req, res) => {
  try {
    const specialties = await Specialty.find().sort({ name: 1 });
    res.json(specialties);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateSpecialty = async (req, res) => {
  try {
    const updated = await Specialty.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteSpecialty = async (req, res) => {
  try {
    await Specialty.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
