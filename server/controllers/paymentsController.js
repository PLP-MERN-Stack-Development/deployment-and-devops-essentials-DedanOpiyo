// controllers/paymentsController.js
const axios = require("axios");
const Payment = require("../models/Payment.js");
const { getMpesaToken } = require("../utils/mpesaToken.js");
const Appointment = require("../models/Appointment.js");
const { sendNotification } = require("../utils/sendNotification.js");

const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const logoPath = path.join(process.cwd(), "assets", "logo.png");

exports.initiateSTK = async (req, res) => {
  console.log('🔥 initiateSTK hit');
  console.log('Headers:', req?.headers);
  console.log('Body:', JSON.stringify(req.body, null, 2));
  try {
    const { appointmentId, phone, amount } = req.body;

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) return res.status(404).json({ msg: "Appointment not found" });

    const token = await getMpesaToken();

    const timestamp = new Date()
      .toISOString()
      .replace(/[^0-9]/g, "")
      .slice(0, 14);

    const password = Buffer.from(
      `${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`
    ).toString("base64");

    // Create payment document first
    const payment = await Payment.create({
      appointment: appointmentId,
      patient: req.user._id,
      phone,
      amount,
    });

    const stkUrl =
      process.env.MPESA_ENV === "production"
        ? "https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest"
        : "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest";

    const response = await axios.post(
      stkUrl,
      {
        BusinessShortCode: process.env.MPESA_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: amount,
        PartyA: phone,
        PartyB: process.env.MPESA_SHORTCODE,
        PhoneNumber: phone,
        CallBackURL: process.env.MPESA_CALLBACK_URL,
        AccountReference: appointmentId,
        TransactionDesc: "Appointment Payment",
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    // Save IDs returned by STK
    payment.checkoutRequestID = response.data.CheckoutRequestID;
    payment.merchantRequestID = response.data.MerchantRequestID;
    await payment.save();

    res.json({
      msg: "STK push initiated. Enter PIN on your phone.",
      paymentId: payment._id,
    });
  } catch (err) {
    console.error("STK ERROR:", err.response?.data || err.message);
    res.status(500).json({ msg: "Failed to initiate STK" });
  }
};

exports.getPaymentHistory = async (req, res) => {
  try {
    const payments = await Payment.find({ patient: req.user._id })
      .populate("appointment")
      .sort({ createdAt: -1 });

    res.json({ payments });
  } catch (err) {
    console.error("Payment history error:", err);
    res.status(500).json({ msg: "Could not fetch payment history" });
  }
};

exports.getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findOne({
      _id: req.params.id,
      patient: req.user._id,
    }).populate("appointment patient");

    if (!payment) return res.status(404).json({ msg: "Payment not found" });

    res.json({ payment });
  } catch (err) {
    console.error("Payment details error:", err);
    res.status(500).json({ msg: "Could not fetch payment details" });
  }
};


exports.getInvoicePDF = async (req, res) => {
  try {
    const payment = await Payment.findOne({
      _id: req.params.id,
      patient: req.user._id,
    })
      .populate("patient appointment");

    if (!payment) return res.status(404).json({ msg: "Payment not found" });

    // Create PDF
    const doc = new PDFDocument({ margin: 50 });

    // Set headers so browser downloads PDF
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=invoice-${payment._id}.pdf`
    );

    doc.pipe(res); // Stream to response

    // HEADER
    doc
      .fontSize(22)
      .text("MediReach Healthcare", { align: "right" })
      .moveDown(0.5);

    doc
      .fontSize(10)
      .fillColor("gray")
      .text("Remote Medical Appointments", { align: "right" })
      .text("help@medireach.com", { align: "right" })
      .text("Nairobi, Kenya", { align: "right" })
      .moveDown(2);

    // TITLE
    doc
      .fontSize(20)
      .fillColor("black")
      .text("INVOICE", { align: "left" })
      .moveDown(1);

    // Invoice metadata
    doc
      .fontSize(12)
      .text(`Invoice ID: ${payment._id}`)
      .text(`Date Issued: ${new Date().toLocaleString()}`)
      .text(`Payment Status: ${payment.status}`)
      .moveDown(2);

    // PATIENT INFO
    doc.fontSize(15).text("Bill To:", { underline: true });
    doc
      .fontSize(12)
      .text(`Name: ${payment.patient.username}`) // name
      .text(`Phone: ${payment.phone}`)
      .moveDown(2);

    // APPOINTMENT DETAILS
    doc.fontSize(15).text("Appointment Details:", { underline: true });
    doc
      .fontSize(12)
      .text(`Appointment ID: ${payment.appointment?._id}`)
      .text(
        `Date: ${new Date(payment.appointment?.date).toLocaleDateString()}`
      )
      .text(`Time: ${payment.appointment?.time || "N/A"}`)
      .moveDown(2);

    // PAYMENT INFO TABLE-LIKE LAYOUT
    doc.fontSize(15).text("Payment Summary:", { underline: true }).moveDown(1);

    doc
      .fontSize(12)
      .text(`Amount: Ksh ${payment.amount}`)
      .text(`Mpesa Receipt: ${payment.mpesaReceiptNumber || "—"}`)
      .text(`Transaction Type: ${payment.type || "Consultation Fee"}`)
      .moveDown(3);

    // FOOTER
    doc
      .fontSize(10)
      .fillColor("gray")
      .text(
        "Thank you for using MediReach. This invoice is valid without a signature.",
        { align: "center" }
      );

    doc.end();
  } catch (err) {
    console.error("Invoice PDF Error:", err);
    res.status(500).json({ msg: "Could not generate invoice" });
  }
};

// STK Push Controller
// Payment History
// Invoice Generator

// Add Logo
// If you have a PNG logo:
// Place it in /server/assets/logo.png, then add to the PDF:
// const logoPath = path.join(process.cwd(), "assets", "logo.png");
// doc.image(logoPath, 50, 45, { width: 80 });

