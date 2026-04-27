const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');
const bcrypt = require('bcryptjs');

mongoose.connect(process.env.MONGO_URI);

const setupUser = async () => {
  try {
    // Buscar usuario
    let user = await User.findOne({ email: "guelopezadrian@gmail.com" });
    
    if (user) {
      console.log("✅ Usuario encontrado:");
      console.log("  ID:", user._id.toString());
      console.log("  Email:", user.email);
      console.log("  Nombre:", user.name);
      console.log("  Rol actual:", user.role);
      
      // Actualizar contraseña y rol
      user.password = await bcrypt.hash("admin123", 10);
      user.role = "admin";
      await user.save();
      console.log("✅ Contraseña actualizada a: admin123");
      console.log("✅ Rol actualizado a: admin");
    } else {
      // Crear nuevo usuario
      user = new User({
        name: "Darwin Admin",
        email: "guelopezadrian@gmail.com",
        password: await bcrypt.hash("admin123", 10),
        role: "admin"
      });
      await user.save();
      console.log("✅ Usuario ADMIN creado exitosamente");
      console.log("  Email: guelopezadrian@gmail.com");
      console.log("  Contraseña: admin123");
      console.log("  Rol: admin");
    }
    
    console.log("\n📝 Credenciales para iniciar sesión:");
    console.log("   Email: guelopezadrian@gmail.com");
    console.log("   Contraseña: admin123");
    
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await mongoose.disconnect();
    console.log("Desconectado de MongoDB");
  }
};

setupUser();