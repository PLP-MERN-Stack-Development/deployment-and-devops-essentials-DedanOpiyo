// Post.js - Mongoose model for blog posts
const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true } // Or exclude because true now (Mongoose enables _id by default)
);

const PostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, maxlength: 100 },
    content: { type: String, required: true },

    featuredImage: { type: String, default: "default-post.jpg" },

    thumbnailUrl: { type: String, default: "" },

    slug: { type: String, unique: true },

    excerpt: { type: String, maxlength: 200 },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    tags: [String],

    isPublished: { type: Boolean, default: false },

    viewCount: { type: Number, default: 0 },

    comments: [CommentSchema],
  },
  { timestamps: true }
);

// Slug generation
PostSchema.pre("save", function () {
  if (!this.isModified("title")) return;
  this.slug = this.title
    .toLowerCase()
    .replace(/[^\w]+/g, "-")
    .replace(/--+/g, "-")
    .trim();
});

// Increment view count
PostSchema.methods.incrementViewCount = function () {
  this.viewCount += 1;
  return this.save();
};

// Add comment
PostSchema.methods.addComment = function (userId, content) {
  this.comments.push({ user: userId, content });
  return this.save();
};

module.exports = mongoose.model("Post", PostSchema);


// Blog Model
// models/Blog.js
// blogSchema

// Comment Model
// models/BlogComment.js
// blogCommentSchema

// 📌 1️⃣ Blog Model
// models/Blog.js
// import mongoose from "mongoose";

// const blogSchema = new mongoose.Schema(
//   {
//     title: { type: String, required: true },
//     slug: { type: String, unique: true, required: true },
//     content: { type: String, required: true },

//     author: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true, // doctor or admin
//     },

//     thumbnailUrl: { type: String, default: "" },
//   },
//   { timestamps: true }
// );

// export default mongoose.model("Blog", blogSchema);


// 📌 2️⃣ Comment Model
// models/BlogComment.js
// import mongoose from "mongoose";

// const blogCommentSchema = new mongoose.Schema(
//   {
//     blog: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Blog",
//       required: true,
//     },
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true, // patient only
//     },
//     comment: { type: String, required: true },
//   },
//   { timestamps: true }
// );

// export default mongoose.model("BlogComment", blogCommentSchema);
