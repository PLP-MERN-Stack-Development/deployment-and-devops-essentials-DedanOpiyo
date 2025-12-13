// routes/adminFeePolicy.js
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/admin.js");
const FeePolicy = require("../models/FeePolicy");

// GET ALL POLICIES
router.get("/", async (req, res) => {
  const policies = await FeePolicy.find().populate("specialty");
  res.json(policies);
});

// CREATE POLICY
router.post("/", async (req, res) => {
  const { specialty, min, max, defaultFee, allowPatientInputFee, allowFreeService } = req.body;

  const exists = await FeePolicy.findOne({ specialty });
  if (exists) return res.status(400).json({ message: "Policy already exists for this specialty." });

  const policy = await FeePolicy.create({
    specialty,
    min,
    max,
    defaultFee,
    allowPatientInputFee,
    allowFreeService,
  });

  res.status(201).json(policy);
});

// UPDATE POLICY
router.put("/:id", async (req, res) => {
  const policy = await FeePolicy.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(policy);
});

// DELETE POLICY
router.delete("/:id", async (req, res) => {
  await FeePolicy.findByIdAndDelete(req.params.id);
  res.json({ message: "Policy deleted" });
});

module.exports = router;
