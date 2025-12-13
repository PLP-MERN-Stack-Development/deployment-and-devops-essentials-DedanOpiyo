// controllers/experienceController.js
const DoctorWorkExperience = require("../models/DoctorWorkExperience");

exports.addExperience = async (req, res) => {
  try {
    const { hospitalId, title, from, to } = req.body;

    const exp = await DoctorWorkExperience.create({
      doctor: req.user._id,
      hospital: hospitalId,
      title,
      from,
      to,
    });

    res.status(201).json(exp);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getDoctorExperience = async (req, res) => {
  const exp = await DoctorWorkExperience.find({
    doctor: req.params.id,
  }).populate("hospital");
  res.json(exp);
};

exports.updateExperience = async (req, res) => {
  const { id } = req.params;
  const updated = await DoctorWorkExperience.findOneAndUpdate(
    { _id: id, doctor: req.user._id },
    req.body,
    { new: true }
  );
  res.json(updated);
};

exports.deleteExperience = async (req, res) => {
  const { id } = req.params;
  await DoctorWorkExperience.findOneAndDelete({
    _id: id,
    doctor: req.user._id,
  });
  res.json({ message: "Deleted" });
};
