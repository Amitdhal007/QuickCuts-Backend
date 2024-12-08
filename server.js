const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('MongoDB connection error:', err));

// Serve static files from the 'public' directory
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Routes
const authRoutes = require('./routes/auth');
const salonRoutes = require('./routes/salon');
const bookingRoutes = require('./routes/booking');
const userRoutes = require('./routes/user');

app.use('/api/auth', authRoutes);
app.use('/api/salons', salonRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
