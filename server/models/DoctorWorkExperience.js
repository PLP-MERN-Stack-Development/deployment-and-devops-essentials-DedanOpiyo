// models/DoctorWorkExperience.js
const mongoose = require("mongoose");

const DoctorWorkExperienceSchema = new mongoose.Schema({
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  hospital: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hospital",
    required: true
  },
  title: String,
  from: Date,
  to: Date
});

module.exports = mongoose.model("DoctorWorkExperience", DoctorWorkExperienceSchema);
