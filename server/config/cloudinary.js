const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
require('dotenv').config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'ask-tours',
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'mp4', 'webm', 'ogg'],
        resource_type: 'auto', // Auto-detect for videos/images
    },
});

module.exports = { cloudinary, storage };
