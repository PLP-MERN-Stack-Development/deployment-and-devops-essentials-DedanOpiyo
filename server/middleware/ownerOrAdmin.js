// middleware/ownerOrAdmin.js
const BlogMedia = require("../models/BlogMedia");

exports.ownerOrAdmin = async (req, res, next) => {
  try {
    // Must already have req.user from protect middleware
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // Admins always pass
    if (req.user.role === "admin") {
      return next();
    }

    // For non-admins → check ownership
    const filename = req.params.filename;

    const media = await BlogMedia.findOne({ filename });

    if (!media) {
      return res.status(404).json({ message: "Media not found" });
    }

    if (media.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Permission denied" });
    }

    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
