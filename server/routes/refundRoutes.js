// routes/refundRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require("../middleware/admin");
const { ownerOrAdmin } = require("../middleware/ownerOrAdmin");
const refundController = require("../controllers/refundController");

router.post("/initiate", protect, ownerOrAdmin, refundController.initiateRefund);
router.post("/callback", refundController.refundCallback);

module.exports = router;

// Admins/Doctors can initiate refund.