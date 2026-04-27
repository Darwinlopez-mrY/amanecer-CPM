const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Property = require('../models/Property');
const { auth, authorize } = require('../middleware/auth');

// Crear una reserva
router.post('/', auth, async (req, res) => {
  try {
    const { propertyId, checkIn, checkOut, totalPrice } = req.body;
    
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: 'Propiedad no encontrada' });
    }
    
    const existingBooking = await Booking.findOne({
      propertyId,
      status: 'confirmed',
      $or: [
        { checkIn: { $lt: new Date(checkOut), $gte: new Date(checkIn) } },
        { checkOut: { $gt: new Date(checkIn), $lte: new Date(checkOut) } }
      ]
    });
    
    if (existingBooking) {
      return res.status(400).json({ message: 'Las fechas seleccionadas no están disponibles' });
    }
    
    const booking = new Booking({
      propertyId,
      guestId: req.userId,
      checkIn: new Date(checkIn),
      checkOut: new Date(checkOut),
      totalPrice,
      status: 'confirmed'
    });
    
    await booking.save();
    res.status(201).json(booking);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Error al crear la reserva' });
  }
});

// Obtener reservas del usuario (huésped)
router.get('/my-bookings', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ guestId: req.userId })
      .populate('propertyId', 'title images city pricePerNight')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener reservas' });
  }
});

// Obtener reservas de las propiedades del anfitrión
router.get('/host/bookings', auth, authorize('host', 'admin'), async (req, res) => {
  try {
    const properties = await Property.find({ hostId: req.userId });
    const propertyIds = properties.map(p => p._id);
    
    const bookings = await Booking.find({ propertyId: { $in: propertyIds } })
      .populate('propertyId', 'title city pricePerNight')
      .populate('guestId', 'name email')
      .sort({ createdAt: -1 });
    
    res.json(bookings);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Error al obtener reservas' });
  }
});

// Actualizar estado de reserva
router.put('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Reserva no encontrada' });
    }
    
    const property = await Property.findById(booking.propertyId);
    if (property.hostId.toString() !== req.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'No autorizado' });
    }
    
    booking.status = status;
    await booking.save();
    
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar' });
  }
});

module.exports = router;