// models/Payment.js
import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      required: true,
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    phone: { type: String, required: true },
    amount: { type: Number, required: true },

    status: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },

    checkoutRequestID: { type: String },
    merchantRequestID: { type: String },
    mpesaReceiptNumber: { type: String },
    transactionDate: { type: String },

    refundRequested: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);
