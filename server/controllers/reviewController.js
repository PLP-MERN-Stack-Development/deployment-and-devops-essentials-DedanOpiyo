// server/controllers/reviewController.js
const Review = require("../models/Review.js");
const Appointment = require("../models/Appointment.js");

exports.addReview = async (req, res) => {
  try {
    const { appointmentId, rating, comment } = req.body;
    const patientId = req.user._id;

    const appointment = await Appointment.findById(appointmentId)
      .populate("doctor patient");

    if (!appointment) return res.status(404).json({ msg: "Appointment not found" });

    if (String(appointment.patient._id) !== String(patientId))
      return res.status(403).json({ msg: "Not your appointment" });

    if (appointment.status !== "completed")
      return res.status(400).json({ msg: "Appointment not completed yet" });

    const existing = await Review.findOne({ appointment: appointmentId });
    if (existing)
      return res.status(400).json({ msg: "You already reviewed this appointment" });

    const review = await Review.create({
      appointment: appointmentId,
      doctor: appointment.doctor._id,
      patient: patientId,
      rating,
      comment,
    });

    res.json({ msg: "Review added", review });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

exports.getDoctorReviews = async (req, res) => {
  try {
    const doctorId = req.params.doctorId;

    const reviews = await Review.find({ doctor: doctorId })
      .populate("patient", "username")
      .sort({ createdAt: -1 });

    const avgRating =
      reviews.length > 0
        ? reviews.reduce((a, b) => a + b.rating, 0) / reviews.length
        : 0;

    res.json({ reviews, avgRating });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};
