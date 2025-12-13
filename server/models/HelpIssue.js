// models/HelpIssue.js
const mongoose = require("mongoose");

const HelpIssueSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  part: { type: mongoose.Schema.Types.ObjectId, ref: "HelpPart" }, 
  customDescription: String,                   // if user’s issue is not in categorized parts

  message: { type: String, required: true },   // Issue description
  contextPath: String,                         // Where the issue occurred (auto stored)
  contextData: Object,                         // Additional data (if needed)
  
  screenshots: [String],                       // up to 3 stored filenames

  status: {
    type: String,
    enum: ["open", "in-progress", "resolved"],
    default: "open"
  },

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("HelpIssue", HelpIssueSchema);

// User-submitted reports with up to 3 screenshots.