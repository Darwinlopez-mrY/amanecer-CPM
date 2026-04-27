// backend/routes/uploadRoutes.js
const express = require('express');
const router = express.Router();
const { uploadImages, uploadSingleImage } = require('../controllers/uploadController');
const { auth } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/', auth, upload.array('images', 10), uploadImages);
router.post('/single', auth, upload.single('image'), uploadSingleImage);

module.exports = router;