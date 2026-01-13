const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Gallery = require('../models/Gallery');
const auth = require('../middleware/auth'); // Assuming you have auth middleware

const { storage, cloudinary } = require('../config/cloudinary');

const upload = multer({ storage });

// GET /api/gallery - Fetch all images
router.get('/', async (req, res) => {
    try {
        const images = await Gallery.find().sort({ createdAt: -1 });
        res.json(images);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /api/gallery - Upload new images (Admin only)
router.post('/', auth, upload.any(), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No files uploaded' });
        }

        const promises = req.files.map(file => {
            const newImage = new Gallery({
                url: file.path, // Cloudinary URL
                title: req.body.title || 'Gallery Image'
            });
            return newImage.save();
        });

        const savedImages = await Promise.all(promises);
        res.status(201).json(savedImages);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// DELETE /api/gallery/:id - Delete image (Admin only)
router.delete('/:id', auth, async (req, res) => {
    try {
        const image = await Gallery.findById(req.params.id);
        if (!image) {
            return res.status(404).json({ message: 'Image not found' });
        }

        // Delete from Cloudinary
        if (image.url.includes('cloudinary.com')) {
            const splitUrl = image.url.split('/');
            const filename = splitUrl[splitUrl.length - 1];
            const folder = splitUrl[splitUrl.length - 2];
            const publicId = `${folder}/${filename.split('.')[0]}`;
            try {
                await cloudinary.uploader.destroy(publicId);
            } catch (err) {
                console.error("Cloudinary delete error:", err);
            }
        } else {
            // Legacy Local Delete
            const filePath = path.join(__dirname, '../uploads', path.basename(image.url));
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        await Gallery.findByIdAndDelete(req.params.id);
        res.json({ message: 'Image deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
