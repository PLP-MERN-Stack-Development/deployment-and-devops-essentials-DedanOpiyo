// models/Hospital.js
const mongoose = require("mongoose");

const HospitalSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: String,
  location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Location",
    required: true
  }
});

module.exports = mongoose.model("Hospital", HospitalSchema);
