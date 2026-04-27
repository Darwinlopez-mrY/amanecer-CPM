const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const User = require('./models/User');

async function fixUser() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Conectado a MongoDB');
    
    // Eliminar todos los usuarios
    await User.deleteMany({});
    console.log('✅ Todos los usuarios eliminados');
    
    // Crear usuario admin con hash correcto
    const hashedPassword = await bcrypt.hash('admin123', 10);
    console.log('Hash generado:', hashedPassword);
    
    const admin = new User({
      name: 'Darwin Admin',
      email: 'guelopezadrian@gmail.com',
      password: hashedPassword,
      role: 'admin'
    });
    
    await admin.save();
    console.log('✅ Usuario admin creado');
    
    // Verificar
    const user = await User.findOne({ email: 'guelopezadrian@gmail.com' });
    const isValid = await bcrypt.compare('admin123', user.password);
    console.log('Verificación de contraseña:', isValid ? '✅ OK' : '❌ FALLO');
    
    if (isValid) {
      console.log('\n📝 Credenciales correctas:');
      console.log('   Email: guelopezadrian@gmail.com');
      console.log('   Contraseña: admin123');
    }
    
    await mongoose.disconnect();
    console.log('✅ Desconectado');
    
  } catch (error) {
    console.error('Error:', error);
    await mongoose.disconnect();
  }
}

fixUser();
