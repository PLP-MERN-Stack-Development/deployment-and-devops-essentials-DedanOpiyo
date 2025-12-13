// routes/appointments.js
const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const { restrictTo } = require("../middleware/roleMiddleware");

const {
  bookAppointment,
  getMyAppointments,
  getDoctorAppointments,
  updateStatus,
  addReview,
  cancelAppointment,
  proposeFee,
  approveFee, 
  rejectFee
} = require("../controllers/appointmentController");

// Patient: book appointment
router.post(
  "/",
  protect,
  restrictTo("patient"),
  bookAppointment
);

// Patient: get my appointments
router.get(
  "/me",
  protect,
  restrictTo("patient"),
  getMyAppointments
);

// Patient: propose fee
router.post(
  "/:id/propose-fee", 
  protect, 
  restrictTo("patient"), 
  proposeFee
);

// Doctor: approve / reject proposed fee
router.post("/:id/approve-fee", protect, restrictTo("doctor"), approveFee);
router.post("/:id/reject-fee", protect, restrictTo("doctor"), rejectFee);

// Doctor: get their appointments
router.get(
  "/doctor",
  protect,
  restrictTo("doctor"),
  getDoctorAppointments
);

// Doctor: update status
router.put(
  "/:id/status",
  protect,
  restrictTo("doctor"),
  updateStatus
);

// Patient: add review
router.post(
  "/:id/review",
  protect,
  restrictTo("patient"),
  addReview
);

// Patient: cancel
router.delete(
  "/:id",
  protect,
  restrictTo("patient"),
  cancelAppointment
);

module.exports = router;

// Handles booking, patient views, doctor views, status updates, reviews, cancellation.