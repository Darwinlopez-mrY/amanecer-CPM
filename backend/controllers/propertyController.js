// backend/controllers/propertyController.js
const Property = require('../models/Property');
const Booking = require('../models/Booking');

// Crear propiedad
const createProperty = async (req, res) => {
  try {
    const propertyData = {
      ...req.body,
      hostId: req.userId
    };

    const property = new Property(propertyData);
    await property.save();

    res.status(201).json(property);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear propiedad', error: error.message });
  }
};

// Obtener todas las propiedades con filtros
const getProperties = async (req, res) => {
  try {
    const { city, minPrice, maxPrice, guests, startDate, endDate, mine } = req.query;
    // Si el usuario pide solo sus propiedades (mine=true) y está autenticado
    if (mine === 'true' && req.userId) {
      filter.hostId = req.userId;
    }
    
    let filter = { isActive: true };

    if (city) {
      filter.city = { $regex: city, $options: 'i' };
    }

    if (minPrice || maxPrice) {
      filter.pricePerNight = {};
      if (minPrice) filter.pricePerNight.$gte = Number(minPrice);
      if (maxPrice) filter.pricePerNight.$lte = Number(maxPrice);
    }

    if (guests) {
      filter.maxGuests = { $gte: Number(guests) };
    }

    // Si hay fechas, excluir propiedades ya reservadas
    if (startDate && endDate) {
      const bookedProperties = await Booking.find({
        status: 'confirmed',
        $or: [
          { checkIn: { $lt: new Date(endDate), $gte: new Date(startDate) } },
          { checkOut: { $gt: new Date(startDate), $lte: new Date(endDate) } }
        ]
      }).distinct('propertyId');
      
      filter._id = { $nin: bookedProperties };
    }

    const properties = await Property.find(filter).populate('hostId', 'name email');
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener propiedades', error: error.message });
  }
};

// Obtener una propiedad por ID
const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate('hostId', 'name email');
    if (!property) {
      return res.status(404).json({ message: 'Propiedad no encontrada' });
    }
    res.json(property);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener propiedad' });
  }
};

// Actualizar propiedad
const updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    
    if (!property) {
      return res.status(404).json({ message: 'Propiedad no encontrada' });
    }

    // Verificar que el usuario sea el propietario
    if (property.hostId.toString() !== req.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'No autorizado' });
    }

    const updatedProperty = await Property.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedProperty);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar propiedad' });
  }
};

// Eliminar propiedad (desactivar)
const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    
    if (!property) {
      return res.status(404).json({ message: 'Propiedad no encontrada' });
    }

    if (property.hostId.toString() !== req.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'No autorizado' });
    }

    property.isActive = false;
    await property.save();

    res.json({ message: 'Propiedad desactivada exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar propiedad' });
  }
};

// Obtener fechas no disponibles de una propiedad
const getUnavailableDates = async (req, res) => {
  try {
    const bookings = await Booking.find({
      propertyId: req.params.id,
      status: 'confirmed'
    });

    const unavailableDates = [];
    bookings.forEach(booking => {
      let currentDate = new Date(booking.checkIn);
      const endDate = new Date(booking.checkOut);
      while (currentDate <= endDate) {
        unavailableDates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }
    });

    res.json({ unavailableDates });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener fechas' });
  }
};

module.exports = {
  createProperty,
  getProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
  getUnavailableDates
};