// models/FeePolicy.js
const mongoose = require("mongoose");

const FeePolicySchema = new mongoose.Schema({
  specialty: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Specialty",
    required: true,
  },
  min: { type: Number, default: 0 },
  max: { type: Number, default: 10000 },
  defaultFee: { type: Number, default: 500 },
  allowPatientInputFee: { type: Boolean, default: false }, // optional feature
  allowFreeService: { type: Boolean, default: true }
});

module.exports = mongoose.model("FeePolicy", FeePolicySchema);

// Admin Fee Policy System
// Purpose: Fee integrity
// If lacking (server/utils/calcFee.js) provides helpful insights / metadata on how appointment fee was calculated (at point of booking)