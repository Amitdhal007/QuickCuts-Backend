const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Salon = require('../models/Salon');
const { protectUser } = require('../middleware/auth');
const router = express.Router();

// Register user
router.post('/user/register', async (req, res) => {
  console.log("reached")
  try {
    const { name, email, password, phoneNumber } = req.body;
    const user = await User.create({ name, email, password, phoneNumber });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(201).json({ success: true, token });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Login user
router.post('/user/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ success: true, token, user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.post('/user/logout', protectUser, async (req, res) => {
  try {
    res.status(200).json({ success: true, message: 'User logged out successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
})

// Register salon
// router.post('/salon/register', async (req, res) => {
//   try {
//     const { name, email, password, address, operatingHours, lat, lon } = req.body;
//     const salon = await Salon.create({
//       name,
//       email,
//       password,
//       address,
//       location: {
//         type: 'Point',
//         coordinates: [lon, lat] // Note: GeoJSON uses [longitude, latitude] order
//       },
//       operatingHours
//     });
//     const token = jwt.sign({ id: salon._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
//     res.status(201).json({ success: true, token });
//   } catch (error) {
//     res.status(400).json({ success: false, message: error.message });
//   }
// });

router.post('/salon/register', async (req, res) => {
  try {
    const { name, email, password, address, operatingHours, lat, lon } = req.body;

    // Validate required fields
    if (!name || !email || !password || !address || !operatingHours || lat === undefined || lon === undefined) {
      return res.status(400).json({ success: false, message: "All fields including lat and lon are required." });
    }

    // Validate coordinates
    if (typeof lat !== 'number' || typeof lon !== 'number') {
      return res.status(400).json({ success: false, message: "Lat and Lon must be valid numbers." });
    }

    // Create salon
    const salon = await Salon.create({
      name,
      email,
      password,
      address,
      location: {
        type: 'Point',
        coordinates: [lon, lat] 
      },
      operatingHours
    });

    const token = jwt.sign({ id: salon._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(201).json({ success: true, token });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});


// Login salon
router.post('/salon/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const salon = await Salon.findOne({ email });
    if (!salon || !(await salon.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: salon._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ success: true, token, salon });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.post('/salon/logout', protectUser, async (req, res) => {
  try {
    res.status(200).json({ success: true, message: 'Salon logged out successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
})

module.exports = router;
