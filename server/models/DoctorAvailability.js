// server/models/DoctorAvailability.js
const mongoose = require("mongoose");

const DoctorAvailabilitySchema = new mongoose.Schema(
  {
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    date: { type: Date, required: true },

    slots: {
      type: [String], // ["09:00", "11:00", "14:00"]
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("DoctorAvailability", DoctorAvailabilitySchema);

// This is where doctors define open appointment slots.
// A date can have multiple time strings.
