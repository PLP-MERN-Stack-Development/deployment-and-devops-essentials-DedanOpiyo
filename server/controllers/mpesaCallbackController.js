// controllers/mpesaCallbackController.js
const Payment = require("../models/Payment.js");
const { sendNotification } = require("../utils/sendNotification.js");

exports.mpesaCallback = async (req, res) => {
  try {
    console.log('🔥 Callback hit');
    console.log('Headers:', req?.headers);
    console.log('Body:', JSON.stringify(req.body, null, 2));
    const body = req.body;

    const callback = body.Body.stkCallback;

    const payment = await Payment.findOne({
      checkoutRequestID: callback.CheckoutRequestID,
    }).populate("appointment patient");

    if (!payment) return res.json({ msg: "Payment not found" });

    if (callback.ResultCode === 0) {
      // Payment successful
      payment.status = "paid";
      payment.mpesaReceiptNumber =
        callback.CallbackMetadata?.Item?.find((i) => i.Name === "MpesaReceiptNumber")?.Value || "";
      payment.transactionDate =
        callback.CallbackMetadata?.Item?.find((i) => i.Name === "TransactionDate")?.Value || "";

      await payment.save();

      // Mark appointment paid
      payment.appointment.paymentStatus = "paid";
      await payment.appointment.save();

      // Send notification
      await sendNotification(
        payment.patient._id,
        "Payment Successful",
        `Your payment for appointment ${payment.appointment._id} was successful.`,
        "appointment"
      );
    } else {
      payment.status = "failed";
      await payment.save();
    }

    res.json({ ok: true });
  } catch (err) {
    console.error("Callback error:", err);
    res.status(500).json({ msg: "Callback error" });
  }
};

