const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const auth = require('../middleware/auth');

// Get all categories
router.get('/', async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

const multer = require('multer');

// Configure multer for file uploads
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'server/uploads/';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'category-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    const extname = path.extname(file.originalname).toLowerCase().replace('.', '');
    const mimetype = file.mimetype;
    const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp'];

    if (imageExts.includes(extname) && (mimetype.startsWith('image/') || mimetype === 'application/octet-stream')) {
        return cb(null, true);
    }
    cb(new Error('Only image files are allowed'));
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Configure static file serving for uploads if not already handled in index.js
// It's assumed index.js handles /uploads static serving.

// Create category (Admin only)
router.post('/', auth, upload.single('coverImage'), async (req, res) => {
    try {
        const categoryData = {
            name: req.body.name,
            description: req.body.description,
        };

        if (req.file) {
            categoryData.coverImage = `/uploads/${req.file.filename}`;
        } else if (req.body.coverImage) {
            // Allow manual URL if no file uploaded (fallback/legacy)
            categoryData.coverImage = req.body.coverImage;
        }

        const category = new Category(categoryData);
        const newCategory = await category.save();
        res.status(201).json(newCategory);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update category (Admin only)
router.put('/:id', auth, upload.single('coverImage'), async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) return res.status(404).json({ message: 'Category not found' });

        if (req.body.name) category.name = req.body.name;
        if (req.body.description) category.description = req.body.description;

        if (req.file) {
            // Optional: Delete old image if it exists and is local
            // if (category.coverImage && category.coverImage.startsWith('/uploads/')) { ... }
            category.coverImage = `/uploads/${req.file.filename}`;
        } else if (req.body.coverImage) {
            category.coverImage = req.body.coverImage;
        }

        const updatedCategory = await category.save();
        res.json(updatedCategory);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete category (Admin only)
router.delete('/:id', auth, async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) return res.status(404).json({ message: 'Category not found' });

        await category.deleteOne();
        res.json({ message: 'Category deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
