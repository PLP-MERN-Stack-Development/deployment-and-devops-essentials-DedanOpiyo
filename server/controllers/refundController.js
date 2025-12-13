// controllers/refundController.js
const axios = require("axios");
const Refund = require("../models/Refund");
const Payment = require("../models/Payment");
const { getMpesaToken } = require("../utils/mpesaToken.js");
const { sendNotification } = require("../utils/sendNotification.js");
const dotenv = require('dotenv');
dotenv.config();

exports.initiateRefund = async (req, res) => {
  try {
    const { paymentId, reason } = req.body;

    const payment = await Payment.findById(paymentId).populate("patient appointment");

    if (!payment) return res.status(404).json({ msg: "Payment not found" });
    if (payment.status !== "paid")
      return res.status(400).json({ msg: "Only paid transactions can be refunded" });

    const token = await getMpesaToken();

    // Refund record
    const refund = await Refund.create({
      payment: paymentId,
      patient: payment.patient._id,
      amount: payment.amount,
      reason,
      initiatedBy: req.user._id,
      status: "processing",
    });

    const url =
      process.env.MPESA_ENV === "production"
        ? "https://api.safaricom.co.ke/mpesa/reversal/v1/request"
        : "https://sandbox.safaricom.co.ke/mpesa/reversal/v1/request";

    const response = await axios.post(
      url,
      {
        Initiator: process.env.MPESA_INITIATOR_NAME,
        SecurityCredential: process.env.MPESA_SECURITY_CREDENTIAL,
        CommandID: "TransactionReversal",
        TransactionID: payment.mpesaReceiptNumber,
        Amount: payment.amount,
        ReceiverParty: process.env.MPESA_SHORTCODE,
        RecieverIdentifierType: 11,
        Remarks: reason || "Refund",
        QueueTimeOutURL: process.env.MPESA_REFUND_TIMEOUT_URL,
        ResultURL: process.env.MPESA_REFUND_CALLBACK_URL,
        Occasion: "MediReach Refund",
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    refund.reversalCode = response.data.ConversationID;
    await refund.save();

    res.json({
      msg: "Refund request sent to M-Pesa",
      refundId: refund._id,
    });
  } catch (err) {
    console.error("REFUND ERROR:", err.response?.data || err.message);
    res.status(500).json({ msg: "Refund initiation failed" });
  }
};

exports.refundCallback = async (req, res) => {
  try {
    const result = req.body.Result;

    const refund = await Refund.findOne({
      reversalCode: result.ConversationID,
    }).populate("patient payment");

    if (!refund) return res.json({ msg: "Refund not found" });

    refund.callbackMetadata = result;

    if (result.ResultCode === 0) {
      refund.status = "success";
      refund.receiptNumber = result.TransactionID;

      // Re-mark appointment status
      refund.payment.status = "refunded";
      refund.payment.appointment.paymentStatus = "refunded";
      await refund.payment.appointment.save();
      await refund.payment.save();

      // Notify patient
      await sendNotification(
        refund.patient._id,
        "Refund Completed",
        `Your refund for transaction ${refund.payment.mpesaReceiptNumber} is complete.`,
        "system"
      );
    } else {
      refund.status = "failed";
      await sendNotification(
        refund.patient._id,
        "Refund Failed",
        `Refund could not be processed. Reason: ${result.ResultDesc}`,
        "warning"
      );
    }

    await refund.save();

    res.json({ ok: true });
  } catch (err) {
    console.error("REFUND CALLBACK ERROR:", err);
    res.status(500).json({ msg: "Callback error" });
  }
};

// Initiate reversal