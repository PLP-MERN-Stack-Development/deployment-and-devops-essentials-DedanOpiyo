// controllers/appointmentController.js
const Appointment = require("../models/Appointment");
const DoctorAvailability = require("../models/DoctorAvailability");
const FeePolicy = require("../models/FeePolicy");
const { sendNotification } = require("../utils/sendNotification.js");
const { sendEmail } = require("../utils/sendEmail.js");
const { calculateFee } = require("../utils/calcFee");

// @desc Book an appointment by selecting available slot
// @route POST /api/appointments
// @access Patient only
exports.bookAppointment = async (req, res) => {
  try {
    const { doctorId, date, time, proposedFee } = req.body;

    const availability = await DoctorAvailability.findOne({
      doctor: doctorId,
      date: new Date(date),
      slots: time,
    });

    if (!availability)
      return res.status(400).json({ message: "Selected time slot is not available" });

    // Remove slot to prevent double booking
    availability.slots = availability.slots.filter((s) => s !== time);
    await availability.save();

    // baseline fee (NOT proposal)
    const { fee, feeSource } = await calculateFee({ doctorId });

    // build appointment object
    const apptData = {
      doctor: doctorId,
      patient: req.user._id,
      date: new Date(`${date} ${time}`),
      fee,
      feeSource,
    };

    const doctor = await User.findById(doctorId).populate("specialty");

    // store proposal if provided
    if (proposedFee !== undefined && proposedFee !== null) {
      const policy = await FeePolicy.findOne({ specialty: doctor.specialty });

      let amount = proposedFee;

      // clamp if policy exists
      if (policy) {
        amount = Math.min(Math.max(amount, policy.min), policy.max);
      }

      apptData.patientProposedFee = {
        amount, 
        status: "pending",
      };
    }

    const appointment = await Appointment.create(apptData);

    // Notification
    await sendNotification(
      doctor._id,
      "New Appointment Request",
      `${req.user.name} booked an appointment at ${slot}`,
      "appointment"
    );

    sendEmail(
      doctor.email,
      "New Appointment - MediReach",
      `<p>You have a new appointment booking from <b>${req.user.name}</b>.</p>`
    );

    res.status(201).json(appointment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Propose fee
// @ Unlike that of bookAppointment this is strict on policy.allowPatientInputFee - policy dictates whether proposal is allowed or not
// @access Patient only
exports.proposeFee = async (req, res) => {
  const { id } = req.params;
  const { amount } = req.body;

  const appt = await Appointment.findById(id)
    .populate("doctor")
    .populate("doctor.specialty");

  if (!appt) return res.status(404).json({ message: "Not found" });

  const policy = await FeePolicy.findOne({ specialty: appt.doctor.specialty });

  if (policy && !policy.allowPatientInputFee) {
    return res.status(400).json({
      message: "This specialty does not allow patient fee input."
    });
  }

  if (policy) {
    // clamp into boundaries
    const clamped = Math.min(Math.max(amount, policy.min), policy.max);
    appt.patientProposedFee = { amount: clamped, status: "pending" };
  } else {
    appt.patientProposedFee = { amount, status: "pending" };
  }

  await appt.save();
  res.json({ message: "Proposal sent", appointment: appt });
};

// Doctor approves
// @access Doctor only
exports.approveFee = async (req, res) => {
  const appt = await Appointment.findOne({
    _id: req.params.id,
    doctor: req.user._id
  });

  if (!appt) return res.status(404).json({ message: "Not found" });

  if (!appt.patientProposedFee || appt.patientProposedFee.status !== "pending")
    return res.status(400).json({ message: "No pending proposal" });

  appt.fee = appt.patientProposedFee.amount;
  appt.feeSource = "patient_fee";
  appt.patientProposedFee.status = "approved";

  await appt.save();

  res.json({ message: "Approved", appointment: appt });
};

// Doctor rejects
// @access Doctor only
exports.rejectFee = async (req, res) => {
  const appt = await Appointment.findOne({
    _id: req.params.id,
    doctor: req.user._id
  });

  if (!appt) return res.status(404).json({ message: "Not found" });

  if (!appt.patientProposedFee)
    return res.status(400).json({ message: "No proposal found" });

  appt.patientProposedFee.status = "rejected";

  // fee remains original booking fee
  await appt.save();

  res.json({ message: "Proposal rejected", appointment: appt });
};

// @desc Get patient appointments
// @route GET /api/appointments/me
// @access Patient only
exports.getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.user._id })
      .populate("doctor", "username specialty picture")
      .sort({ date: -1 });

    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Get doctor appointments
// @route GET /api/appointments/doctor
// @access Doctor only
exports.getDoctorAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctor: req.user._id })
      .populate("patient", "username email")
      .sort({ date: -1 });

    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Update appointment status
// @route PUT /api/appointments/:id/status
// @access Doctor only
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowed = ["confirmed", "completed", "cancelled"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const appointment = await Appointment.findOne({
      _id: req.params.id,
      doctor: req.user._id,
    });

    if (!appointment)
      return res.status(404).json({ message: "Appointment not found" });

    appointment.status = status;
    await appointment.save();

    // Notify patient
    await sendNotification(
      appointment.patient._id,
      "Appointment Updated",
      `Your appointment status changed to: ${status}`,
      "appointment"
    );

    res.json(appointment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Add review (only when completed)
// @route POST /api/appointments/:id/review
// @access Patient only
exports.addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const appointment = await Appointment.findOne({
      _id: req.params.id,
      patient: req.user._id,
    });

    if (!appointment)
      return res.status(404).json({ message: "Appointment not found" });

    if (appointment.status !== "completed") {
      return res
        .status(400)
        .json({ message: "Reviews allowed only after completion" });
    }

    appointment.reviews.push({
      patient: req.user._id,
      rating,
      comment,
    });

    await appointment.save();

    res.status(201).json(appointment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Cancel appointment
// @route DELETE /api/appointments/:id
// @access Patient only
exports.cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findOne({
      _id: req.params.id,
      patient: req.user._id,
    });

    if (!appointment)
      return res.status(404).json({ message: "Appointment not found" });

    if (!["pending", "confirmed"].includes(appointment.status)) {
      return res.status(400).json({ message: "Cannot cancel this appointment" });
    }

    // Extract info
    const doctorId = appointment.doctor;
    const apptDate = appointment.date.toISOString().slice(0, 10);
    const apptTime = appointment.date.toTimeString().slice(0, 5);

    // Restore the slot
    const availability = await DoctorAvailability.findOne({
      doctor: doctorId,
      date: new Date(apptDate),
    });

    if (availability) {
      // Avoid duplicates
      if (!availability.slots.includes(apptTime)) {
        availability.slots.push(apptTime);

        // sort HH:MM strings
        availability.slots.sort((a, b) => {
          const da = new Date(`1970-01-01T${a}:00`);
          const db = new Date(`1970-01-01T${b}:00`);
          return da - db;
        });

        await availability.save();
      }
    }

    // Finish cancellation
    appointment.status = "cancelled";
    await appointment.save();

    res.json({ message: "Appointment cancelled, slot restored" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Handles booking, status updates, reviews, etc.


// booking controller (bookAppointment) currently checks:

// ✔ doctorId
// ✔ date
// ✔ time
// ✔ ensures slot exists
// ✔ removes slot to avoid double-booking

// cancelAppointment
// TESTING SCENARIOS (PASSED)
// | Scenario                                  | Expected      | Works? |
// | ----------------------------------------- | ------------- | ------ |
// | Patient cancels pending appointment       | Slot restored | ✔      |
// | Patient cancels confirmed appointment     | Slot restored | ✔      |
// | Patient cancels completed appointment     | Blocked       | ✔      |
// | Slot already restored previously          | No duplicate  | ✔      |
// | Doctor deletes availability for that date | Skip restore  | ✔      |
