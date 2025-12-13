// models/BlogMedia.js
const mongoose = require("mongoose");

const BlogMediaSchema = new mongoose.Schema(
  {
    filename: { type: String, required: true, unique: true },
    url: { type: String, required: true },
    
    // User who uploaded it
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    // Post association (null until post is published)
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", default: null },

    // Draft/session ID for "CreatePost" screen
    sessionId: { type: String, default: null }
  },
  { timestamps: true }
);

module.exports = mongoose.model("BlogMedia", BlogMediaSchema);

// Persist blog media so ownerOrAdmin middleware can veryfy users
