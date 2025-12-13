// controllers/helpController.js
const HelpIssue = require("../models/HelpIssue");
const HelpPart = require("../models/HelpPart");

exports.createIssue = async (req, res) => {
  try {
    const { part, customDescription, message, contextPath, contextData } = req.body;

    const screenshots = req.files?.map(f => f.filename) || [];

    if (screenshots.length > 3)
      return res.status(400).json({ message: "Max 3 screenshots allowed" });

    const issue = await HelpIssue.create({
      user: req.user?._id || null,
      part: part || null,
      customDescription: part ? null : customDescription,
      message,
      contextPath,
      contextData: contextData ? JSON.parse(contextData) : {},
      screenshots
    });

    res.status(201).json({ message: "Issue submitted", issue });
  } catch (err) {
    console.error("Help Issue Error", err);
    res.status(500).json({ message: err.message });
  }
};

// Admin View All Issues
// @access Admin only
exports.getAllIssues = async (req, res) => {
  const issues = await HelpIssue.find()
    .populate("user", "username email")
    .populate("part", "name slug");
  res.json(issues);
};

// Admin Update Status
// @access Admin only
exports.updateStatus = async (req, res) => {
  const issue = await HelpIssue.findById(req.params.id);
  if (!issue) return res.status(404).json({ message: "Issue not found" });

  issue.status = req.body.status;
  await issue.save();

  res.json(issue);
};


// Admin CRUD Help Parts
// @access Admin only
exports.createPart = async (req, res) => {
  const { name, description } = req.body;
  const slug = name.toLowerCase().replace(/\s+/g, "-");

  const part = await HelpPart.create({ name, description, slug });
  res.json(part);
};

exports.getParts = async (req, res) => {
  res.json(await HelpPart.find());
};

exports.getPartBySlug = async (req, res) => {
  const { slug } = req.params;
  const part = await HelpPart.findOne({ slug });

  if (!part)
    return res.status(404).json({ message: "Help part not found" });

  res.json(part);
};


// Supports up to 3 screenshots + context/redirect path.