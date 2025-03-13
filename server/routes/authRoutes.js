const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authenticateUser = require('../middleware/authMiddleware');
const router = express.Router();

require('dotenv').config();

// Generate JWT Token Function
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { algorithm: "HS256", expiresIn: "2d" });
};

// User Signup
router.post('/signup', async (req, res) => {
  try {
    const { username, password } = req.body;
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ message: "Username already exists" });
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();
    
    // Generate token upon successful registration
    const token = generateToken(user._id);
    res.status(201).json({ message: "User registered successfully", token });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// User Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    
    // Generate token upon successful login
    const token = generateToken(user._id);
    res.json({ message: "Login successful", token });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// Get authenticated user's details
router.get('/me', authenticateUser, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

module.exports = router;