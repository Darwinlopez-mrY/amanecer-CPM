const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['guest', 'host', 'admin'],
    default: 'guest'
  },
  profilePicture: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Encriptar contraseña antes de guardar (solo si es nueva o modificada)
userSchema.pre('save', async function(next) {
  // Solo hashear si la contraseña fue modificada Y no parece ya estar hasheada
  if (!this.isModified('password')) return next();
  
  // Verificar si la contraseña ya parece un hash bcrypt (empieza con $2b$ o $2a$)
  if (this.password.startsWith('$2b$') || this.password.startsWith('$2a$')) {
    return next(); // Ya está hasheada, no volver a hashear
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Método para comparar contraseñas
userSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);