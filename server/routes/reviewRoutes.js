// server/routes/reviewRoutes.js
const express = require('express');
const router = express.Router();
const { addReview, getDoctorReviews } = require("../controllers/reviewController.js");
const { protect } = require('../middleware/authMiddleware');

router.post("/", protect, addReview); // patient adds a review
router.get("/doctor/:doctorId", getDoctorReviews); // public doctor review list

module.exports = router;
