// utils/sendNotification.js
const Notification = require("../models/Notification.js");

const sendNotification = async (userId, title, message, type = "info") => {
  return await Notification.create({
    user: userId,
    title,
    message,
    type,
  });
}

module.exports = { sendNotification };

// Notification Helper (Reusable Notification Sender)

