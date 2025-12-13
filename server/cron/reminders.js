// cron/reminders.js
const cron = require("node-cron");
const Appointment = require("../models/Appointment.js");
const { sendNotification } = require("../utils/sendNotification.js");

cron.schedule("*/10 * * * *", async () => {
  const now = new Date();
  const soon = new Date(Date.now() + 60 * 60 * 1000);

  const appointments = await Appointment.find({
    status: "approved",
    appointmentTime: { $gte: now, $lte: soon },
  }).populate("patient");

  for (const appt of appointments) {
    await sendNotification(
      appt.patient._id,
      "Appointment Reminder",
      `Your appointment with ${appt.doctorName} is in 1 hour.`,
      "reminder"
    );
  }

  console.log("Reminder job executed");
});

// Mount in server:
// require ("./cron/reminders.js");

// Resolve:
// [2025-12-11T10:30:15.980Z] [PID: 2904] [NODE-CRON] [WARN] missed execution at Thu Dec 11 2025 13:30:00 GMT+0300 (East Africa Time)! Possible blocking IO or high CPU user at the same process used by node-cron.
// [2025-12-11T10:40:14.482Z] [PID: 2904] [NODE-CRON] [WARN] missed execution at Thu Dec 11 2025 13:40:00 GMT+0300 (East Africa Time)! Possible blocking IO or high CPU user at the same process used by node-cron.
// [2025-12-11T10:50:16.539Z] [PID: 2904] [NODE-CRON] [WARN] missed execution at Thu Dec 11 2025 13:50:00 GMT+0300 (East Africa Time)! Possible blocking IO or high CPU user at the same process used by node-cron.
