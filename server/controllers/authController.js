// controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Helper: Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user._id);

  const cookieOptions = {
    httpOnly: true,
    // secure: process.env.NODE_ENV === "production",
    // sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: true, // (in development -- important)
    sameSite: "none", // (in development -- important)
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };

  res
    .status(statusCode)
    .cookie("token", token, cookieOptions)
    .json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
};

// @desc Register a new user (patient or doctor or admin)
// @route POST /api/auth/register
// @access Public
exports.register = async (req, res, next) => {
  try {
    const { username, email, password, role, specialty, bio } = req.body;

    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if user exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Create user
    const user = await User.create({
      username,
      email,
      password,
      role: role || "patient",
      specialty: role === "doctor" ? specialty : null,
      bio: role === "doctor" ? bio : null,
    });

    // Generate token
    // const token = generateToken(user._id);

    // res.status(201).json({
    //   success: true,
    //   user: {
    //     id: user._id,
    //     username: user.username,
    //     role: user.role,
    //     email: user.email,
    //   },
    //   token,
    // });

    sendTokenResponse(user, 201, res);
  } catch (error) {
    next(error);
  }
};

// @desc Login user
// @route POST /api/auth/login
// @access Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.checkPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create token
    // const token = generateToken(user._id);

    // res.status(200).json({
    //   success: true,
    //   user: {
    //     id: user._id,
    //     username: user.username,
    //     role: user.role,
    //     email: user.email,
    //   },
    //   token,
    // });

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// LOGOUT
exports.logout = async (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
    // sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    // secure: process.env.NODE_ENV === "production",
    sameSite: "none", // (in development)
    secure: false, // (in development)
  });

  res.json({ success: true, message: "Logged out" });
};

exports.me = async (req, res) => {
  // protect middleware already attached req.user
  res.status(200).json({
    success: true,
    user: req.user
  });
};

// Registration, login, password hashing, JWT issue.