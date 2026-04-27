// backend/routes/propertyRoutes.js
const express = require('express');
const router = express.Router();
const {
  createProperty,
  getProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
  getUnavailableDates
} = require('../controllers/propertyController');
const { auth, authorize } = require('../middleware/auth');

router.get('/', getProperties);
router.get('/:id', getPropertyById);
router.get('/:id/available-dates', getUnavailableDates);
router.post('/', auth, authorize('host', 'admin'), createProperty);
router.put('/:id', auth, authorize('host', 'admin'), updateProperty);
router.delete('/:id', auth, authorize('host', 'admin'), deleteProperty);

module.exports = router;