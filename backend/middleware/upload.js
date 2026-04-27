const multer = require('multer');
const path = require('path');

// Configurar almacenamiento en memoria
const storage = multer.memoryStorage();

// Filtrar tipos de archivos - VERSIÓN MÁS PERMISIVA
const fileFilter = (req, file, cb) => {
  // Obtener extensión del archivo
  const ext = path.extname(file.originalname).toLowerCase();
  
  // Extensiones permitidas
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  
  // Verificar por extensión (más confiable que mimetype)
  const isValidExt = allowedExtensions.includes(ext);
  
  // También verificar mimetype como respaldo
  const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  const isValidMime = allowedMimes.includes(file.mimetype);
  
  console.log('Archivo recibido:', {
    originalname: file.originalname,
    mimetype: file.mimetype,
    extension: ext,
    size: file.size
  });
  
  if (isValidExt || isValidMime) {
    return cb(null, true);
  }
  
  cb(new Error(`Formato no permitido: ${ext || file.mimetype}. Usa JPG, PNG, GIF o WEBP`));
};

const upload = multer({
  storage: storage,
  limits: { 
    fileSize: 10 * 1024 * 1024, // 10MB
    files: 10
  },
  fileFilter: fileFilter
});

module.exports = upload;