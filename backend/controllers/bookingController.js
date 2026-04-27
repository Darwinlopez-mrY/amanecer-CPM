// backend/controllers/bookingController.js
const Booking = require('../models/Booking');
const Property = require('../models/Property');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Crear intención de pago con Stripe
const createPaymentIntent = async (req, res) => {
  try {
    const { propertyId, checkIn, checkOut, totalPrice } = req.body;

    // Crear PaymentIntent en Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalPrice * 100), // Stripe usa centavos
      currency: 'cop',
      metadata: {
        propertyId,
        checkIn,
        checkOut,
        guestId: req.userId
      }
    });

    res.json({
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear pago', error: error.message });
  }
};

// Confirmar reserva después del pago
const confirmBooking = async (req, res) => {
  try {
    const { propertyId, checkIn, checkOut, totalPrice, paymentIntentId } = req.body;

    // Verificar que la propiedad existe
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: 'Propiedad no encontrada' });
    }

    // Verificar que las fechas no están ocupadas
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

    // Crear la reserva
    const booking = new Booking({
      propertyId,
      guestId: req.userId,
      checkIn: new Date(checkIn),
      checkOut: new Date(checkOut),
      totalPrice,
      paymentIntentId,
      status: 'confirmed'
    });

    await booking.save();

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Error al confirmar reserva', error: error.message });
  }
};

// Obtener reservas del usuario (huésped)
const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ guestId: req.userId })
      .populate('propertyId', 'title images city pricePerNight')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener reservas' });
  }
};

// Obtener reservas para anfitrión
const getHostBookings = async (req, res) => {
  try {
    // Primero obtener las propiedades del anfitrión
    const properties = await Property.find({ hostId: req.userId });
    const propertyIds = properties.map(p => p._id);

    // Luego obtener las reservas de esas propiedades
    const bookings = await Booking.find({ propertyId: { $in: propertyIds } })
      .populate('propertyId', 'title city')
      .populate('guestId', 'name email')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener reservas del anfitrión' });
  }
};

// Actualizar estado de una reserva (anfitrión o admin)
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Reserva no encontrada' });
    }

    // Verificar permisos: anfitrión de la propiedad o admin
    const property = await Property.findById(booking.propertyId);
    if (property.hostId.toString() !== req.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'No autorizado' });
    }

    booking.status = status;
    await booking.save();

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar reserva' });
  }
};

// Cancelar reserva (huésped)
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Reserva no encontrada' });
    }

    if (booking.guestId.toString() !== req.userId) {
      return res.status(403).json({ message: 'No autorizado' });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.json({ message: 'Reserva cancelada exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al cancelar reserva' });
  }
};

module.exports = {
  createPaymentIntent,
  confirmBooking,
  getUserBookings,
  getHostBookings,
  updateBookingStatus,
  cancelBooking
};
