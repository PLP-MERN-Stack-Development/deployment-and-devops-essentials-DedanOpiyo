// server/models/Appointment.js
const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const AppointmentSchema = new mongoose.Schema(
  {
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    date: { type: Date, required: true },

    // FINAL CHARGED FEE (at moment of booking)
    fee: {
      type: Number,
      min: 0,
      required: true,
    },

    // If FeePolicy allows
    patientProposedFee: {
      amount: Number,
      status: { type: String, enum: ["pending", "approved", "rejected"], default: null }
    },

    // Metadata about how the fee was determined
    feeSource: {
      type: String,
      enum: [
        "doctor_fee",
        "specialty_policy_doctor_fee_clamped",
        "patient_fee",
        "specialty_default",
        "global_default",
        "no_policy_used_default",   // specialty had NO policy
        "no_policy_patient_fee",    // specialty had NO policy but patient provided fee
      ],
      required: true
    },

    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending",
    },

    prescription: { type: String },
    notes: { type: String },

    reviews: [ReviewSchema], // Only allowed when completed
  },
  { timestamps: true }
);

module.exports = mongoose.model("Appointment", AppointmentSchema);

// Designed to support reviews, prescription, and linked doctor/patient.

// Appointment clearly tells why the fee is what it is (through feeSource / Metadata).
// (utils/calcFee.js) will return { fee, feeSource } for bookAppointment use in appointmentController.js