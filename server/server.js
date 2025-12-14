// ---------------------------
// MediReach Backend - server.js
// ---------------------------

// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require("cookie-parser");
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// ---------------------------
// Middleware
// ---------------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Allow uploads folder access
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// CORS
const envOrigins =
  process.env.ALLOWED_ORIGINS ||
  process.env.ALLOWED_ORIGIN ||
  "";

const allowedOriginsFromEnv = envOrigins
  .split(",")
  .map(origin => origin.trim())
  .filter(Boolean);

// Default localhost origins (dev fallback)
const defaultOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
];

// Final allowed origins
const allowedOrigins =
  allowedOriginsFromEnv.length > 0
    ? allowedOriginsFromEnv
    : defaultOrigins;

const corsOptions = {
  // origin: allowedOrigins,
  origin: (origin, callback) => {
    // Allow server-to-server / Postman / mobile apps
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // Reject gracefully
    return callback(null, false);
  },
  credentials: true,        // allow cookies
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // VERY IMPORTANT
app.use(cookieParser());

// ---------------------------
// Route Imports
// ---------------------------
const authRoutes = require("./routes/auth");
const doctorRoutes = require("./routes/doctors");
const availabilityRoutes = require("./routes/availability");
const appointmentRoutes = require("./routes/appointments");
const specialtyRoutes = require("./routes/specialties");
const reviewRoutes = require("./routes/reviewRoutes");

const categoryRoutes = require("./routes/categories");
const postRoutes = require("./routes/posts");

const adminUserRoutes = require("./routes/adminUserRoutes");
const adminDoctorRoutes = require("./routes/adminDoctorRoutes");
const adminBlogRoutes = require("./routes/adminBlogRoutes");
const adminStatsRoutes = require("./routes/adminStatsRoutes");

const hospitalRoutes = require("./routes/hospitals");
const experienceRoutes = require("./routes/experience");
const locationRoutes = require("./routes/locations");

const helpRoutes = require("./routes/helpRoutes");
const blogMediaRoutes = require("./routes/blogMediaRoutes");

const notificationRoutes = require("./routes/notificationRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const adminFeePolicyRoutes = require("./routes/adminFeePolicy");

const refundRoutes = require("./routes/refundRoutes.js");


// Log requests in development mode
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });
}

// ---------------------------
// API Routes
// ---------------------------
app.use("/api/auth", authRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/availability", availabilityRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/specialties", specialtyRoutes);

app.use("/api/reviews", reviewRoutes);

app.use("/api/categories", categoryRoutes);
app.use("/api/posts", postRoutes);

app.use("/api/admin/users", adminUserRoutes);
app.use("/api/admin/doctors", adminDoctorRoutes);
app.use("/api/admin/blogs", adminBlogRoutes);
app.use("/api/admin/stats", adminStatsRoutes);

app.use("/api/hospitals", hospitalRoutes);
app.use("/api/experience", experienceRoutes);
app.use("/api/locations", locationRoutes);

app.use("/api/help", helpRoutes);
app.use("/api/blog", blogMediaRoutes);

app.use("/api/notifications", notificationRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/admin/fee-policies", adminFeePolicyRoutes);

app.use("/api/refunds", refundRoutes);


// Root route
app.get('/', (req, res) => {
  res.send('MediReach API Running ✔');
});

// ----------------------------------
// Error handling middleware: Global Error Handler
// ----------------------------------
// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || 'Server Error',
  });
});

// ---------------------------------------------
// Connect to MongoDB and start server (After DB Connect)
// ---------------------------------------------
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');

    // ---- START CRON JOBS AFTER DB CONNECT ----
    require("./cron/reminders.js");
    // ------------------------------------------

    app.listen(PORT, () => {
      console.log(`MediReach Backend running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  });

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  // Close server & exit process
  process.exit(1);
});

module.exports = app; 