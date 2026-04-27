const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');
const Property = require('./models/Property');

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Conectado a MongoDB');

    // Crear anfitrión
    const host = new User({
      name: "Anfitrión Principal",
      email: "anfitrion@amanecercpm.com",
      password: "host123",
      role: "host"
    });
    await host.save();
    console.log('Usuario anfitrión creado:', host._id);

    const propiedades = [
      {
        title: "Hermoso apartamento en El Poblado",
        description: "Apartamento completamente equipado en la mejor zona de Medellín",
        city: "Medellín",
        address: "Calle 10 # 43-12, El Poblado",
        pricePerNight: 250000,
        maxGuests: 4,
        bedrooms: 2,
        bathrooms: 2,
        amenities: ["Wifi", "Piscina", "Gimnasio", "Parqueadero"],
        images: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800"],
        location: { type: "Point", coordinates: [-75.5745, 6.2109] },
        hostId: host._id,
        isActive: true
      },
      {
        title: "Casa campestre en Bogotá",
        description: "Casa rodeada de naturaleza con vista a las montañas",
        city: "Bogotá",
        address: "Vía La Calera Km 8",
        pricePerNight: 350000,
        maxGuests: 8,
        bedrooms: 4,
        bathrooms: 3,
        amenities: ["Wifi", "Chimenea", "Jacuzzi", "BBQ"],
        images: ["https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800"],
        location: { type: "Point", coordinates: [-74.0313, 4.7110] },
        hostId: host._id,
        isActive: true
      },
      {
        title: "Apartamento frente al mar en Cartagena",
        description: "Espectacular vista al mar Caribe",
        city: "Cartagena",
        address: "Bocagrande, Cra 1 # 8-12",
        pricePerNight: 450000,
        maxGuests: 6,
        bedrooms: 3,
        bathrooms: 2,
        amenities: ["Wifi", "Piscina", "Aire acondicionado", "Vista al mar"],
        images: ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800"],
        location: { type: "Point", coordinates: [-75.5610, 10.3910] },
        hostId: host._id,
        isActive: true
      },
      {
        title: "Habitación privada en Santa Marta",
        description: "Habitación económica en el centro histórico",
        city: "Santa Marta",
        address: "Cra 2 # 11-23, Centro Histórico",
        pricePerNight: 80000,
        maxGuests: 2,
        bedrooms: 1,
        bathrooms: 1,
        amenities: ["Wifi", "Desayuno incluido", "Aire acondicionado"],
        images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800"],
        location: { type: "Point", coordinates: [-74.2165, 11.2396] },
        hostId: host._id,
        isActive: true
      }
    ];

    await Property.insertMany(propiedades);
    console.log(`✅ ${propiedades.length} propiedades insertadas`);

    await mongoose.disconnect();
    console.log('Desconectado');
  } catch (error) {
    console.error('Error:', error.message);
    await mongoose.disconnect();
  }
}

seedDatabase();
