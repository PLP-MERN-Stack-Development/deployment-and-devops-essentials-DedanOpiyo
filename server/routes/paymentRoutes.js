// routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { ownerOrAdmin } = require('../middleware/ownerOrAdmin');
const paymentsController = require("../controllers/paymentsController");
const mpesaCallbackController = require("../controllers/mpesaCallbackController");

router.post("/stk", protect, paymentsController.initiateSTK);
router.post("/callback", mpesaCallbackController.mpesaCallback);

// History
router.get("/history", protect, ownerOrAdmin, paymentsController.getPaymentHistory);
router.get("/:id", protect, ownerOrAdmin, paymentsController.getPaymentById);

// Invoice Download
router.get("/:id/invoice", protect, paymentsController.getInvoicePDF);

module.exports = router;
