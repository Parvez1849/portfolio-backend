// backend/controllers/auth.controller.js
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

// Helper function to generate JWT token
const generateToken = (id) => {
  // JWT_SECRET ko .env file mein daalna chahiye
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallbacksecret123', {
    expiresIn: process.env.JWT_EXPIRE || '30d', // Token kab expire hoga
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    user = await User.create({
      name,
      email,
      password, // Password automatically hash ho jayega (model mein pre-save hook se)
    });

    // Generate token and send response
    const token = generateToken(user._id);
    res.status(201).json({ success: true, token, userId: user._id, name: user.name });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  // Validate email & password
  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password' });
  }

  try {
    // Find user by email (include password for comparison)
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token and send response
    const token = generateToken(user._id);
    res.status(200).json({ success: true, token, userId: user._id, name: user.name });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};