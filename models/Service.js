const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  serviceImage: { type: String, required: true },
  salon: { type: mongoose.Schema.Types.ObjectId, ref: 'Salon', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);
