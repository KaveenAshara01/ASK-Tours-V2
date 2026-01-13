const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Gallery = require('../models/Gallery');
const auth = require('../middleware/auth'); // Assuming you have auth middleware

// Configure Multer for storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = 'server/uploads/'; // Correct path relative to project root
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, 'gallery-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: function (req, file, cb) {
        const filetypes = /jpeg|jpg|png|webp/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error("Error: Images Only!"));
    }
});

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
// Supports multiple files upload
// POST /api/gallery - Upload new images (Admin only)
// Supports multiple files upload
router.post('/', auth, upload.any(), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No files uploaded' });
        }

        const promises = req.files.map(file => {
            const newImage = new Gallery({
                url: `/uploads/${file.filename}`,
                title: req.body.title || 'Gallery Image' // Optional title
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

        // Try to delete file from filesystem
        const filePath = path.join(__dirname, '../uploads', path.basename(image.url));
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        await Gallery.findByIdAndDelete(req.params.id);
        res.json({ message: 'Image deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
