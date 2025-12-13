// controlers/doctorAvailabilityController.js
const DoctorAvailability = require("../models/DoctorAvailability");
const Appointment = require("../models/Appointment");

// Utility: generate time slots
function generateSlots(startTime, endTime, intervalMinutes = 30) {
  const [startH, startM] = startTime.split(":").map(Number);
  const [endH, endM] = endTime.split(":").map(Number);

  const start = new Date();
  const end = new Date();

  start.setHours(startH, startM, 0, 0);
  end.setHours(endH, endM, 0, 0);

  // Do NOT allow crossing midnight
  if (end <= start) {
    return [];
  }

  const slots = [];

  while (start < end) {
    slots.push(start.toTimeString().slice(0, 5)); // "HH:MM"

    // Add interval
    start.setMinutes(start.getMinutes() + intervalMinutes);
  }

  return slots; // ["08:00","08:30","09:00","10:00","10:30"]
}

// @desc Add availability (doctor submits start/end)
// @route POST /api/doctors/availability
// @access Doctor only
exports.addAvailability = async (req, res) => {
  try {
    const { date, startTime, endTime } = req.body;

    if (!date || !startTime || !endTime) {
      return res.status(400).json({ message: "Invalid availability data" });
    }

    const slots = generateSlots(startTime, endTime);

    if (slots.length === 0) {
      return res.status(400).json({ 
        message: "Invalid time range. End time must be later than start time (same day only)." 
      });
    }

    // Prevent duplicates (same doctor + same date)
    const existing = await DoctorAvailability.findOne({
      doctor: req.user._id,
      date: new Date(date),
    });

    if (existing) {
      return res.status(400).json({
        message: "Availability for this date already exists",
      });
    }

    const availability = await DoctorAvailability.create({
      doctor: req.user._id,
      date,
      slots,
    });

    res.status(201).json(availability);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Get a doctor's availability
// @route GET /api/doctors/:id/availability
// @access Public
exports.getDoctorAvailability = async (req, res) => {
  try {
    const availability = await DoctorAvailability.find({
      doctor: req.params.id,
      date: { $gte: new Date() },
    }).sort({ date: 1 });

    res.json(availability);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @access Private
exports.getMyAvailability = async (req, res) => {
  try {
    const availability = await DoctorAvailability.find({
      doctor: req.user._id,
    }).sort({ date: 1 });

    res.json({
      doctor: req.user._id,
      availabilities: availability,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @access Private
exports.updateAvailability = async (req, res) => {
  try {
    const { id } = req.params; // availability id
    const { date, startTime, endTime } = req.body;

    const availability = await DoctorAvailability.findById(id);

    if (!availability)
      return res.status(404).json({ message: "Availability not found" });

    // Ensure doctor owns this availability
    if (availability.doctor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Prevent editing if appointments exist for that date
    const bookedExists = await Appointment.exists({
      doctor: req.user._id,
      date: {
        $gte: new Date(availability.date),
        $lt: new Date(availability.date).setHours(23, 59, 59, 999),
      },
    });

    if (bookedExists) {
      return res.status(400).json({
        message:
          "Cannot edit availability because appointments have already been booked for this date.",
      });
    }

    // Regenerate slots
    const newSlots = generateSlots(startTime, endTime);

    if (newSlots.length === 0) {
      return res.status(400).json({ message: "Invalid time range" });
    }

    // Update fields
    availability.date = date || availability.date;
    availability.slots = newSlots;

    await availability.save();

    res.json(availability);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @access Private
exports.deleteAvailability = async (req, res) => {
  try {
    const { id } = req.params;

    const availability = await DoctorAvailability.findById(id);

    if (!availability)
      return res.status(404).json({ message: "Availability not found" });

    if (availability.doctor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Check if ANY appointment exists on that date for this doctor
    const hasBookings = await Appointment.exists({
      doctor: req.user._id,
      date: {
        $gte: new Date(availability.date),
        $lt: new Date(availability.date).setHours(23, 59, 59, 999),
      },
    });

    if (hasBookings) {
      return res.status(400).json({
        message: "Cannot delete availability because appointments exist for this date.",
      });
    }

    await availability.deleteOne();

    res.json({ message: "Availability removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Doctors create availability.
// Patients query available dates.

// If ANY appointment exists for that day → doctor cannot edit or delete (updateAvailability / deleteAvailability).
