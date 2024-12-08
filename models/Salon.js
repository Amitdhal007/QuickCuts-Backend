const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true
  }
}, { timestamps: true });

const salonSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  address: { type: String, required: true },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  services: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service' }],
  operatingHours: {
    start: { type: String, required: true },
    end: { type: String, required: true }
  },
  mainPicture: { type: String, default: null },
  carouselImages: [{ type: String }],
  reviews: [reviewSchema],
  averageRating: { type: Number, default: 0 }
}, { timestamps: true });

// Add a 2dsphere index for geospatial queries
salonSchema.index({ location: '2dsphere' });

salonSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

salonSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

salonSchema.methods.calculateAverageRating = function() {
  if (this.reviews.length === 0) {
    this.averageRating = 0;
  } else {
    const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
    this.averageRating = sum / this.reviews.length;
  }
  return this.averageRating;
};

module.exports = mongoose.model('Salon', salonSchema);