// controllers/hospitalController.js
const Hospital = require("../models/Hospital");
const Location = require("../models/Location");

exports.createHospital = async (req, res) => {
  try {
    const { name, address, latitude, longitude } = req.body;

    if (!name || !latitude || !longitude)
      return res.status(400).json({ message: "Missing required fields" });

    let location = await Location.findOne({ latitude, longitude });

    if (!location) 
      location = await Location.create({ latitude, longitude });

    const existingHospital = await Hospital.findOne({
      name: name.trim(),
      location: location._id,
    });

    if (existingHospital) {
      return res.status(400).json({
        message: "Hospital already exists at this location",
        hospital: existingHospital,
      });
    }

    const hospital = await Hospital.create({
      name: name.trim(),
      address: address?.trim(),
      location: location._id,
    });

    res.status(201).json(hospital);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getHospitals = async (req, res) => {
  const hospitals = await Hospital.find().populate("location");
  res.json(hospitals);
};

exports.getHospital = async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.params.id).populate("location"); 
    if (!hospital) return res.status(404).json({ message: "Hospital not found" });

    res.json(hospital);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.searchHospitals = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim() === "")
      return res.json([]);

    const hospitals = await Hospital.find({
      name: { $regex: q, $options: "i" }
    })
      .limit(20)
      .populate("location");

    res.json(hospitals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteHospital = async (req, res) => {
  const { id } = req.params;
  await Hospital.findByIdAndDelete(id);
  res.json({ message: "Hospital deleted" });
};
