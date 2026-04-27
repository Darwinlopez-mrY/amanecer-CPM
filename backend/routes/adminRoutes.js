const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const {
  getStats,
  getAllUsers,
  changeUserRole,
  deleteUser,
  getAllProperties,
  deactivateProperty,
  activateProperty,
  getAllBookings
} = require('../controllers/adminController');

// Todas las rutas requieren autenticación y rol de admin
router.use(auth, authorize('admin'));

router.get('/stats', getStats);
router.get('/users', getAllUsers);
router.put('/users/:id/role', changeUserRole);
router.delete('/users/:id', deleteUser);
router.get('/properties', getAllProperties);
router.put('/properties/:id/deactivate', deactivateProperty);
router.put('/properties/:id/activate', activateProperty);
router.get('/bookings', getAllBookings);

module.exports = router;