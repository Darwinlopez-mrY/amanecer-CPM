const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Property = require('./models/Property');

const MONGO_URI = process.env.MONGO_URI;

const resetDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Conectado a MongoDB');
    
    // Limpiar colecciones
    await User.deleteMany({});
    await Property.deleteMany({});
    console.log('✅ Colecciones limpiadas');
    
    // Crear usuario admin
    const admin = new User({
      name: "Darwin Admin",
      email: "guelopezadrian@gmail.com",
      password: await bcrypt.hash("admin123", 10),
      role: "admin"
    });
    await admin.save();
    console.log("✅ Usuario admin creado:", admin.email);
    console.log("  ID:", admin._id.toString());
    
    // Crear propiedades
    const properties = [
      {
        title: "Hermoso apartamento en El Poblado",
        description: "Apartamento completamente equipado en la mejor zona de Medellín. Cerca a centros comerciales, restaurantes y vida nocturna.",
        city: "Medellín",
        address: "Calle 10 # 43-12, El Poblado",
        pricePerNight: 250000,
        maxGuests: 4,
        bedrooms: 2,
        bathrooms: 2,
        amenities: ["wifi", "parking", "pool", "ac"],
        images: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400"],
        location: { type: "Point", coordinates: [-75.5745, 6.2109] },
        hostId: admin._id,
        isActive: true
      },
      {
        title: "Casa campestre con vista a la montaña",
        description: "Casa rodeada de naturaleza, perfecta para desconectarse. Cuenta con chimenea y jacuzzi.",
        city: "Bogotá",
        address: "Vía La Calera Km 8",
        pricePerNight: 350000,
        maxGuests: 8,
        bedrooms: 4,
        bathrooms: 3,
        amenities: ["wifi", "parking", "nature", "bbq"],
        images: ["https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=400"],
        location: { type: "Point", coordinates: [-74.0313, 4.7110] },
        hostId: admin._id,
        isActive: true
      },
      {
        title: "Apartamento frente al mar en Cartagena",
        description: "Vista espectacular al mar Caribe, acceso directo a la playa. Incluye piscina y restaurante.",
        city: "Cartagena",
        address: "Bocagrande, Cra 1 # 8-12",
        pricePerNight: 450000,
        maxGuests: 6,
        bedrooms: 3,
        bathrooms: 2,
        amenities: ["wifi", "pool", "ac", "beach", "parking"],
        images: ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400"],
        location: { type: "Point", coordinates: [-75.5610, 10.3910] },
        hostId: admin._id,
        isActive: true
      },
      {
        title: "Habitación privada en Santa Marta",
        description: "Habitación cómoda y económica, cerca al centro histórico. Comparte áreas comunes.",
        city: "Santa Marta",
        address: "Cra 2 # 11-23, Centro Histórico",
        pricePerNight: 80000,
        maxGuests: 2,
        bedrooms: 1,
        bathrooms: 1,
        amenities: ["wifi", "breakfast", "ac"],
        images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400"],
        location: { type: "Point", coordinates: [-74.2165, 11.2396] },
        hostId: admin._id,
        isActive: true
      },
      {
        title: "Penthouse de lujo en Bucaramanga",
        description: "Penthouse con terraza privada y vista panorámica de la ciudad.",
        city: "Bucaramanga",
        address: "Cra 33 # 45-12, Cabecera",
        pricePerNight: 380000,
        maxGuests: 6,
        bedrooms: 3,
        bathrooms: 3,
        amenities: ["wifi", "parking", "ac", "tv", "kitchen"],
        images: ["https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=400"],
        location: { type: "Point", coordinates: [-73.1198, 7.1193] },
        hostId: admin._id,
        isActive: true
      }
    ];
    
    const created = await Property.insertMany(properties);
    console.log(`✅ ${created.length} propiedades creadas`);
    
    console.log("\n📝 Credenciales para iniciar sesión:");
    console.log("   Email: guelopezadrian@gmail.com");
    console.log("   Contraseña: admin123");
    
    await mongoose.disconnect();
    console.log("✅ Desconectado");
    
  } catch (error) {
    console.error("❌ Error:", error.message);
    await mongoose.disconnect();
  }
};

resetDatabase();
