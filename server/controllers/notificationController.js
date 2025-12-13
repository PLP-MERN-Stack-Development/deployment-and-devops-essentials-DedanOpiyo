// controllers/notificationController.js
const Notification = require("../models/Notification.js");

exports.getUserNotifications = async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id })
    .sort({ createdAt: -1 });

  res.json({ notifications });
};

exports.markAsRead = async (req, res) => {
  await Notification.findByIdAndUpdate(req.params.id, { read: true });
  res.json({ msg: "Marked as read" });
};

exports.markAllAsRead = async (req, res) => {
  await Notification.updateMany(
    { user: req.user._id, read: false },
    { read: true }
  );
  res.json({ msg: "All notifications read" });
};

