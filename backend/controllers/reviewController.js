// backend/controllers/reviewController.js
const Review = require('../models/Review');
const Booking = require('../models/Booking');

// Crear una reseña
const createReview = async (req, res) => {
  try {
    const { bookingId, rating, comment } = req.body;

    // Verificar que la reserva existe y pertenece al usuario
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Reserva no encontrada' });
    }

    if (booking.guestId.toString() !== req.userId) {
      return res.status(403).json({ message: 'No autorizado' });
    }

    // Verificar que la fecha de check-out ya pasó
    if (new Date(booking.checkOut) > new Date()) {
      return res.status(400).json({ message: 'Solo puedes reseñar después de tu estancia' });
    }

    // Verificar que no haya reseña previa
    const existingReview = await Review.findOne({ bookingId });
    if (existingReview) {
      return res.status(400).json({ message: 'Ya has reseñado esta propiedad' });
    }

    const review = new Review({
      bookingId,
      propertyId: booking.propertyId,
      userId: req.userId,
      rating,
      comment
    });

    await review.save();

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear reseña', error: error.message });
  }
};

// Obtener reseñas de una propiedad
const getPropertyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ propertyId: req.params.propertyId })
      .populate('userId', 'name profilePicture')
      .sort({ createdAt: -1 });

    // Calcular promedio
    const averageRating = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

    res.json({
      reviews,
      averageRating,
      totalReviews: reviews.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener reseñas' });
  }
};

// Eliminar reseña (admin)
const deleteReview = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'No autorizado' });
    }

    await Review.findByIdAndDelete(req.params.id);
    res.json({ message: 'Reseña eliminada' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar reseña' });
  }
};

module.exports = {
  createReview,
  getPropertyReviews,
  deleteReview
};