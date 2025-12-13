// controllers/blogMediaController.js
const fs = require("fs");
const path = require("path");
const BlogMedia = require("../models/BlogMedia");
const Post = require("../models/Post");

// UPLOAD
exports.upload = async (req, res) => {
  if (!req.file)
    return res.status(400).json({ message: "No file uploaded" });

  try {
    const url = `/uploads/blog/${req.file.filename}`;

    const media = await BlogMedia.create({
      filename: req.file.filename,
      url,
      user: req.user._id,
      sessionId: req.body.sessionId || null,  // <--- new
      post: req.body.postId || null           // <--- if editing post
    });

    res.json(media);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error saving media" });
  }
};

// DELETE
exports.remove = async (req, res) => {
  try {
    const media = await BlogMedia.findOneAndDelete({
      filename: req.params.filename
    });

    if (!media)
      return res.status(404).json({ message: "Media not found" });

    // owner or admin logic built in later: ownerOrAdmin
    await media.deleteOne();

    const filepath = path.join(__dirname, "..", "uploads", "blog", req.params.filename);
    if (fs.existsSync(filepath)) fs.unlinkSync(filepath);

    res.json({ message: "Media deleted", filename: req.params.filename });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting media" });
  }
};

// REPLACE
exports.replace = async (req, res) => {
  if (!req.file)
    return res.status(400).json({ message: "No file uploaded" });

  try {
    const oldFilename = req.params.filename;

    const old = await BlogMedia.findOne({ filename: oldFilename });
    if (!old)
      return res.status(404).json({ message: "Not found" });

    const oldFilepath = path.join(__dirname, "..", "uploads", "blog", oldFilename);
    if (fs.existsSync(oldFilepath)) fs.unlinkSync(oldFilepath);

    old.filename = req.file.filename;
    old.url = `/uploads/blog/${req.file.filename}`;
    await old.save();

    res.json(old);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error replacing media" });
  }
};

// GET 
// GET media uploaded by the current user
exports.getUserMedia = async (req, res) => {
  const media = await BlogMedia.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(media);
};

// GET media for a specific post
exports.getPostMedia = async (req, res) => {
  const postId = req.params.postId;
  const media = await BlogMedia.find({ post: postId }).sort({ createdAt: -1 });
  res.json(media);
};

// GET media for a draft session
exports.getSessionMedia = async (req, res) => {
  const sessionId = req.params.sessionId;
  const media = await BlogMedia.find({
    sessionId,
    user: req.user._id
  }).sort({ createdAt: -1 });

  res.json(media);
};

// GET a single media record
exports.getSingle = async (req, res) => {
  const media = await BlogMedia.findOne({ filename: req.params.filename });
  if (!media) return res.status(404).json({ message: "Media not found" });
  res.json(media);
};

// CLEANUP (unused media - this is expensive staff)
exports.findUnusedMedia = async (req, res) => {
  const allMedia = await BlogMedia.find();
  const posts = await Post.find();

  const allPostContent = posts.map((p) => p.content).join(" ");
  const allFeatured = posts.map((p) => p.featuredImage).join(" ");

  const unused = allMedia.filter((media) => {
    const usedInContent = allPostContent.includes(media.url);
    const usedInFeatured = allFeatured.includes(media.url);
    return !usedInContent && !usedInFeatured;
  });

  res.json(unused);
};

exports.deleteUnusedMedia = async (req, res) => {
  const unused = await BlogMedia.find({ used: false });

  unused.forEach((media) => {
    const filepath = path.join(__dirname, "..", "uploads", "blog", media.filename);
    if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
  });

  await Media.deleteMany({ used: false });

  res.json({ message: "Unused media removed.", count: unused.length });
};


// GET Endpoints

// We add:

// 3.1 Get all media for a user
// GET /api/blog/media/user

// 3.2 Get all media for a specific post
// GET /api/blog/media/post/:postId

// 3.3 Get all media tied to a session
// GET /api/blog/media/session/:sessionId

// 3.4 Get a single media
// GET /api/blog/media/:filename