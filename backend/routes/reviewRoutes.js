// backend/routes/reviewRoutes.js
const express = require('express');
const router = express.Router();
const {
  createReview,
  getPropertyReviews,
  deleteReview
} = require('../controllers/reviewController');
const { auth, authorize } = require('../middleware/auth');

router.post('/', auth, createReview);
router.get('/property/:propertyId', getPropertyReviews);
router.delete('/:id', auth, authorize('admin'), deleteReview);

module.exports = router;