// models/HelpPart.js
const mongoose = require("mongoose");

const HelpPartSchema = new mongoose.Schema({
  name: { type: String, required: true },     // e.g. "Login Issues", "Password Reset"
  description: String,                        // Optional details
  slug: { type: String, unique: true },       // for URLs: login-issues, doctor-profile
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("HelpPart", HelpPartSchema);

// Admin-created catalog of app sections.