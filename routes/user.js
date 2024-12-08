const express = require('express');
const User = require('../models/User');
const { protectUser } = require('../middleware/auth');
const upload = require('../middleware/upload');
const router = express.Router();

// Get user profile
router.get('/profile', protectUser, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update user profile
router.put('/profile', protectUser, async (req, res) => {
  try {
    const { name, phoneNumber } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, phoneNumber },
      { new: true, runValidators: true }
    ).select('-password');
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Update profile picture
router.put('/profile/picture', protectUser, upload.single('profilePicture'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    const profilePicture = `/uploads/users/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { profilePicture },
      { new: true, runValidators: true }
    ).select('-password');
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = router;
