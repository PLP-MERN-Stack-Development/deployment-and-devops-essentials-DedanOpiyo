// models/Refund.js
const mongoose = require("mongoose");

const refundSchema = new mongoose.Schema(
  {
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
      required: true,
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    amount: { type: Number, required: true },
    reason: { type: String, default: "Not specified" },

    status: {
      type: String,
      enum: ["pending", "processing", "success", "failed"],
      default: "pending",
    },

    receiptNumber: { type: String }, // MpesaReceiptNumber
    reversalCode: { type: String },
    callbackMetadata: { type: Object },

    initiatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Refund", refundSchema);
