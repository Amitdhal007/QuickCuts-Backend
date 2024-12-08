const express = require('express');
const Booking = require('../models/Booking');
const Service = require('../models/Service'); // Add this line
const { protectUser, protectSalon } = require('../middleware/auth');
const router = express.Router();

// Create a new booking
router.post('/', protectUser, async (req, res) => {
  try {
    const { salon, serviceId, date } = req.body; // Change 'service' to 'serviceId'
    
    // Verify that the service exists and belongs to the specified salon
    const service = await Service.findOne({ _id: serviceId, salon: salon });
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found for this salon' });
    }

    const booking = await Booking.create({
      user: req.user._id,
      salon,
      service: serviceId, // Use the serviceId here
      date
    });
    res.status(201).json({ success: true, data: booking });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Get user's bookings
router.get('/user', protectUser, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('salon', 'name address')
      .populate('service', 'name price duration') // Add this line to populate service details
      .sort('-date');
    res.json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get salon's bookings
router.get('/salon', protectSalon, async (req, res) => {
  try {
    const bookings = await Booking.find({ salon: req.salon._id })
      .populate('user', 'name email')
      .populate('service', 'name price duration') // Add this line to populate service details
      .sort('-date');
    res.json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update booking status (for salon owners)
router.patch('/:id', protectSalon, async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findOneAndUpdate(
      { _id: req.params.id, salon: req.salon._id },
      { status },
      { new: true, runValidators: true }
    );
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    res.json({ success: true, data: booking });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Cancel booking (for users)
router.delete('/:id', protectUser, async (req, res) => {
  try {
    const booking = await Booking.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    res.json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
