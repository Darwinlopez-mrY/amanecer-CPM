// backend/controllers/uploadController.js
const cloudinary = require('../config/cloudinary');

// Subir múltiples imágenes
const uploadImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No se subieron archivos' });
    }

    const uploadPromises = req.files.map(file => {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'amanecer-cpm/properties',
            transformation: [{ width: 1200, height: 800, crop: 'limit' }]
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result.secure_url);
          }
        );
        uploadStream.end(file.buffer);
      });
    });

    const urls = await Promise.all(uploadPromises);
    res.json({ urls });
  } catch (error) {
    res.status(500).json({ message: 'Error al subir imágenes', error: error.message });
  }
};

// Subir una sola imagen (para perfil)
const uploadSingleImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No se subió archivo' });
    }

    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'amanecer-cpm/profiles' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(req.file.buffer);
    });

    res.json({ url: result.secure_url });
  } catch (error) {
    res.status(500).json({ message: 'Error al subir imagen' });
  }
};

module.exports = { uploadImages, uploadSingleImage };