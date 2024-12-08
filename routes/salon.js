const express = require('express');
const Salon = require('../models/Salon');
const Service = require('../models/Service');
const { protectSalon, protectUser } = require('../middleware/auth');
const upload = require('../middleware/upload');
const router = express.Router();

// Get salon profile
router.get('/profile', protectSalon, async (req, res) => {
  try {
    const salon = await Salon.findById(req.salon._id).select('-password');
    res.json({ success: true, salon: salon });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update salon profile
router.put('/profile', protectSalon, async (req, res) => {
  try {
    const { name, address, operatingHours, lat, lon } = req.body;
    const updateData = {
      name,
      address,
      operatingHours
    };

    if (lat && lon) {
      updateData.location = {
        type: 'Point',
        coordinates: [lon, lat]
      };
    }

    const salon = await Salon.findByIdAndUpdate(
      req.salon._id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');
    res.json({ success: true, data: salon });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Get all salons (for users to browse)
router.get('/', async (req, res) => {
  try {
    const salons = await Salon.find().select('name address services operatingHours');
    res.json({ success: true, data: salons });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get single salon (for users to view)
router.get('/:id', async (req, res) => {
  try {
    const salon = await Salon.findById(req.params.id).select('name address services operatingHours');
    if (!salon) {
      return res.status(404).json({ success: false, message: 'Salon not found' });
    }
    res.json({ success: true, data: salon });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Add a review to a salon
router.post('/:id/reviews', protectUser, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const salon = await Salon.findById(req.params.id);

    if (!salon) {
      return res.status(404).json({ success: false, message: 'Salon not found' });
    }

    const newReview = {
      user: req.user._id,
      rating,
      comment
    };

    salon.reviews.push(newReview);
    salon.calculateAverageRating();
    await salon.save();

    res.status(201).json({ success: true, data: salon });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Get all reviews for a salon
router.get('/:id/reviews', async (req, res) => {
  try {
    const salon = await Salon.findById(req.params.id).populate('reviews.user', 'name');
    
    if (!salon) {
      return res.status(404).json({ success: false, message: 'Salon not found' });
    }

    res.json({ success: true, data: salon.reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update a review
router.put('/:salonId/reviews/:reviewId', protectUser, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const salon = await Salon.findById(req.params.salonId);

    if (!salon) {
      return res.status(404).json({ success: false, message: 'Salon not found' });
    }

    const review = salon.reviews.id(req.params.reviewId);

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this review' });
    }

    review.rating = rating;
    review.comment = comment;

    salon.calculateAverageRating();
    await salon.save();

    res.json({ success: true, data: salon });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Delete a review
router.delete('/:salonId/reviews/:reviewId', protectUser, async (req, res) => {
  try {
    const salon = await Salon.findById(req.params.salonId);

    if (!salon) {
      return res.status(404).json({ success: false, message: 'Salon not found' });
    }

    const review = salon.reviews.id(req.params.reviewId);

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this review' });
    }

    salon.reviews.pull(req.params.reviewId);
    salon.calculateAverageRating();
    await salon.save();

    res.json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Search and filter salons
router.get('/search', async (req, res) => {
  try {
    const { name, service, minRating, maxPrice, sortBy } = req.query;
    let query = {};

    // Search by name
    if (name) {
      query.name = { $regex: name, $options: 'i' };
    }

    // Filter by service
    if (service) {
      query['services.name'] = { $regex: service, $options: 'i' };
    }

    // Filter by minimum rating
    if (minRating) {
      query.averageRating = { $gte: parseFloat(minRating) };
    }

    // Filter by maximum price
    if (maxPrice) {
      query['services.price'] = { $lte: parseFloat(maxPrice) };
    }

    // Sorting
    let sort = {};
    if (sortBy === 'rating') {
      sort = { averageRating: -1 };
    } else if (sortBy === 'price') {
      sort = { 'services.price': 1 };
    }

    const salons = await Salon.find(query)
      .select('name address services operatingHours averageRating')
      .sort(sort);

    res.json({ success: true, count: salons.length, data: salons });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Search salons by location
router.get('/search/location', async (req, res) => {
  try {
    const { lat, lon, maxDistance = 5000 } = req.query; // maxDistance in meters, default 5km

    if (!lat || !lon) {
      return res.status(400).json({ success: false, message: 'Latitude and longitude are required' });
    }

    const salons = await Salon.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lon), parseFloat(lat)]
          },
          $maxDistance: parseInt(maxDistance)
        }
      }
    }).select('name address location services operatingHours mainPicture averageRating');

    res.json({ success: true, count: salons.length, data: salons });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update main picture
// router.put('/profile/main-picture', protectSalon, upload.single('mainPicture'), async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ success: false, message: 'No file uploaded' });
//     }
//     const mainPicture = `/uploads/salons/${req.file.filename}`;
//     const salon = await Salon.findByIdAndUpdate(
//       req.salon._id,
//       { mainPicture },
//       { new: true, runValidators: true }
//     ).select('-password');
//     res.json({ success: true, data: salon });
//   } catch (error) {
//     res.status(400).json({ success: false, message: error.message });
//   }
// });

router.put('/profile/main-picture', protectSalon, async (req, res) => {
  try {
    const { mainPicture } = req.body;

    // Validate input
    if (!mainPicture) {
      return res.status(400).json({ success: false, message: 'Main picture URL is required.' });
    }

    // Find and update the salon using the ID from req.salon
    const salon = await Salon.findByIdAndUpdate(
      req.salon._id,
      { mainPicture },
      { new: true, runValidators: true }
    ).select('-password');

    if (!salon) {
      return res.status(404).json({ success: false, message: 'Salon not found.' });
    }

    res.json({ success: true, data: salon });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


// Add carousel images
router.post('/profile/carousel-images', protectSalon, upload.array('carouselImages', 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No files uploaded' });
    }
    const carouselImages = req.files.map(file => `/uploads/salons/${file.filename}`);
    const salon = await Salon.findByIdAndUpdate(
      req.salon._id,
      { $push: { carouselImages: { $each: carouselImages } } },
      { new: true, runValidators: true }
    ).select('-password');
    res.json({ success: true, data: salon });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Get salon services
router.get('/:salonId/services', async (req, res) => {
  try {
    const services = await Service.find({ salon: req.params.salonId });
    res.json({ success: true, data: services });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Add a new service
router.post('/services', protectSalon, async (req, res) => {
  try {
    const { name, price, serviceImage } = req.body;
    const service = await Service.create({
      name,
      price,
      serviceImage,
      salon: req.salon._id
    });
    await Salon.findByIdAndUpdate(req.salon._id, { $push: { services: service._id } });
    res.status(201).json({ success: true, data: service });
  } catch (error) {
    console.log("error occur")
    res.status(400).json({ success: false, message: error.message });
  }
});

// Update a service
router.put('/services/:serviceId', protectSalon, async (req, res) => {
  try {
    const { name, price } = req.body;
    const service = await Service.findOneAndUpdate(
      { _id: req.params.serviceId, salon: req.salon._id },
      { name, price },
      { new: true, runValidators: true }
    );
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    res.json({ success: true, data: service });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Delete a service
router.delete('/services/:serviceId', protectSalon, async (req, res) => {
  try {
    const service = await Service.findOneAndDelete({ _id: req.params.serviceId, salon: req.salon._id });
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    await Salon.findByIdAndUpdate(req.salon._id, { $pull: { services: req.params.serviceId } });
    res.json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
