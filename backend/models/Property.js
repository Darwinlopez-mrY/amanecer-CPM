// backend/models/Property.js
const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  city: {
    type: String,
    required: true
  },
  address: String,
  pricePerNight: {
    type: Number,
    required: true
  },
  maxGuests: Number,
  bedrooms: Number,
  bathrooms: Number,
  amenities: [String],
  images: [String],
  location: {
    type: {
      type: String,
      default: 'Point'
    },
    coordinates: [Number] // [longitud, latitud]
  },
  hostId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Crear índice geoespacial para búsquedas por ubicación
propertySchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Property', propertySchema);