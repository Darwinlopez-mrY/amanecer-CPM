const User = require('../models/User');
const Property = require('../models/Property');
const Booking = require('../models/Booking');

// Obtener estadísticas del sistema
const getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalHosts = await User.countDocuments({ role: 'host' });
    const totalGuests = await User.countDocuments({ role: 'guest' });
    const totalAdmins = await User.countDocuments({ role: 'admin' });
    const totalProperties = await Property.countDocuments({ isActive: true });
    const totalPropertiesAll = await Property.countDocuments();
    const totalBookings = await Booking.countDocuments();
    
    const confirmedBookings = await Booking.find({ status: 'confirmed' });
    const totalRevenue = confirmedBookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
    
    // Reservas por mes (últimos 6 meses)
    const now = new Date();
    const monthlyBookings = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const nextMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      const count = await Booking.countDocuments({
        createdAt: { $gte: date, $lt: nextMonth }
      });
      monthlyBookings.push({
        month: date.toLocaleString('es', { month: 'short' }),
        count
      });
    }
    
    res.json({
      users: { total: totalUsers, hosts: totalHosts, guests: totalGuests, admins: totalAdmins },
      properties: { active: totalProperties, total: totalPropertiesAll },
      bookings: { total: totalBookings, confirmed: confirmedBookings.length },
      revenue: totalRevenue,
      monthlyBookings
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Error al obtener estadísticas' });
  }
};

// Obtener todos los usuarios
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener usuarios' });
  }
};

// Cambiar rol de usuario
const changeUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    
    user.role = role;
    await user.save();
    
    res.json({ message: 'Rol actualizado', user: { id: user._id, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: 'Error al cambiar rol' });
  }
};

// Eliminar usuario
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    
    // No permitir eliminar tu propio usuario
    if (user._id.toString() === req.userId) {
      return res.status(400).json({ message: 'No puedes eliminar tu propio usuario' });
    }
    
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Usuario eliminado' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar usuario' });
  }
};

// Obtener todas las propiedades (para admin)
const getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find()
      .populate('hostId', 'name email')
      .sort({ createdAt: -1 });
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener propiedades' });
  }
};

// Desactivar propiedad
const deactivateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Propiedad no encontrada' });
    }
    
    property.isActive = false;
    await property.save();
    
    res.json({ message: 'Propiedad desactivada' });
  } catch (error) {
    res.status(500).json({ message: 'Error al desactivar propiedad' });
  }
};

// Activar propiedad
const activateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Propiedad no encontrada' });
    }
    
    property.isActive = true;
    await property.save();
    
    res.json({ message: 'Propiedad activada' });
  } catch (error) {
    res.status(500).json({ message: 'Error al activar propiedad' });
  }
};

// Obtener todas las reservas
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('propertyId', 'title city')
      .populate('guestId', 'name email')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener reservas' });
  }
};

module.exports = {
  getStats,
  getAllUsers,
  changeUserRole,
  deleteUser,
  getAllProperties,
  deactivateProperty,
  activateProperty,
  getAllBookings
};