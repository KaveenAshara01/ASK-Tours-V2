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
const { storage, cloudinary } = require('../config/cloudinary');

// Configure multer with Cloudinary storage
const upload = multer({ storage });

// Helper to delete files from Cloudinary
const deleteFile = async (fileUrl) => {
    if (!fileUrl) return;

    // Check if it's a Cloudinary URL
    if (fileUrl.includes('cloudinary.com')) {
        try {
            // Extract public_id from URL
            // URL format: https://res.cloudinary.com/cloudname/image/upload/v12345678/folder/filename.jpg
            const splitUrl = fileUrl.split('/');
            const filename = splitUrl[splitUrl.length - 1];
            const folder = splitUrl[splitUrl.length - 2];
            const publicId = `${folder}/${filename.split('.')[0]}`;

            await cloudinary.uploader.destroy(publicId);
            console.log(`Deleted Cloudinary image: ${publicId}`);
        } catch (err) {
            console.error(`Error deleting Cloudinary image ${fileUrl}:`, err);
        }
    } else {
        // Legacy: Delete local file
        const cleanPath = fileUrl.startsWith('/') ? fileUrl.slice(1) : fileUrl;
        const fullPath = path.join(__dirname, '..', cleanPath);
        if (fs.existsSync(fullPath)) {
            try {
                fs.unlinkSync(fullPath);
                console.log(`Deleted local file: ${fullPath}`);
            } catch (err) {
                console.error(`Error deleting local file ${fullPath}:`, err);
            }
        }
    }
};

// Create category (Admin only)
router.post('/', auth, upload.fields([{ name: 'coverImage', maxCount: 1 }, { name: 'contentImage', maxCount: 1 }]), async (req, res) => {
    try {
        const categoryData = {
            name: req.body.name,
            description: req.body.description,
        };

        // Handle File Uploads (Cloudinary returns path as URL)
        if (req.files) {
            if (req.files.coverImage) {
                categoryData.coverImage = req.files.coverImage[0].path;
            }
            if (req.files.contentImage) {
                categoryData.contentImage = req.files.contentImage[0].path;
            }
        }

        // Handle Manual String URLs (Fallback)
        if (req.body.coverImage) categoryData.coverImage = req.body.coverImage;
        if (req.body.contentImage) categoryData.contentImage = req.body.contentImage;


        const category = new Category(categoryData);
        const newCategory = await category.save();
        res.status(201).json(newCategory);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update category (Admin only)
router.put('/:id', auth, upload.fields([{ name: 'coverImage', maxCount: 1 }, { name: 'contentImage', maxCount: 1 }]), async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) return res.status(404).json({ message: 'Category not found' });

        if (req.body.name) category.name = req.body.name;
        if (req.body.description) category.description = req.body.description;

        if (req.files) {
            if (req.files.coverImage) {
                // Delete old image if it exists
                if (category.coverImage) await deleteFile(category.coverImage);
                category.coverImage = req.files.coverImage[0].path;
            }
            if (req.files.contentImage) {
                // Delete old image if it exists
                if (category.contentImage) await deleteFile(category.contentImage);
                category.contentImage = req.files.contentImage[0].path;
            }
        }

        if (req.body.coverImage) category.coverImage = req.body.coverImage;
        if (req.body.contentImage) category.contentImage = req.body.contentImage;

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

        // Delete associated images
        if (category.coverImage) await deleteFile(category.coverImage);
        if (category.contentImage) await deleteFile(category.contentImage);

        await category.deleteOne();
        res.json({ message: 'Category deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
