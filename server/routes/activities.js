const express = require('express');
const router = express.Router();
const multer = require('multer');
const Activity = require('../models/Activity');
const auth = require('../middleware/auth');
const { storage, cloudinary } = require('../config/cloudinary');
const upload = multer({ storage });

// Helper to delete files from Cloudinary
const deleteFiles = async (filePaths) => {
    if (!filePaths || !Array.isArray(filePaths)) return;
    for (const filePath of filePaths) {
        if (filePath.includes('cloudinary.com')) {
            try {
                const splitUrl = filePath.split('/');
                const filename = splitUrl[splitUrl.length - 1];
                const folder = splitUrl[splitUrl.length - 2];
                const publicId = `${folder}/${filename.split('.')[0]}`;
                const isVideo = filename.match(/\.(mp4|webm|ogg|mov|avi)$/i);
                await cloudinary.uploader.destroy(publicId, { resource_type: isVideo ? 'video' : 'image' });
            } catch (err) {
                console.error(`Error deleting Cloudinary file ${filePath}:`, err);
            }
        }
    }
};

// GET all activities
router.get('/', async (req, res) => {
    try {
        const activities = await Activity.find().sort({ createdAt: -1 });
        res.json(activities);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET single activity
router.get('/:id', async (req, res) => {
    try {
        const activity = await Activity.findById(req.params.id);
        if (!activity) return res.status(404).json({ message: 'Activity not found' });
        res.json(activity);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// CREATE activity (Admin)
router.post('/', auth, upload.fields([
    { name: 'images', maxCount: 10 },
    { name: 'videos', maxCount: 5 }
]), async (req, res) => {
    try {
        const { title, description, shortDescription, price, location } = req.body;
        const images = req.files?.images?.map(f => f.path) || [];
        const videos = req.files?.videos?.map(f => f.path) || [];

        const activity = new Activity({
            title,
            description,
            shortDescription,
            price,
            location,
            images,
            videos
        });

        await activity.save();
        res.status(201).json(activity);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// UPDATE activity (Admin)
router.put('/:id', auth, upload.fields([
    { name: 'images', maxCount: 10 },
    { name: 'videos', maxCount: 5 }
]), async (req, res) => {
    try {
        const { title, description, shortDescription, price, location, existingImages, existingVideos } = req.body;
        const activity = await Activity.findById(req.params.id);
        if (!activity) return res.status(404).json({ message: 'Activity not found' });

        const existingImagesArray = existingImages ? JSON.parse(existingImages) : [];
        const existingVideosArray = existingVideos ? JSON.parse(existingVideos) : [];

        const newImages = req.files?.images?.map(f => f.path) || [];
        const newVideos = req.files?.videos?.map(f => f.path) || [];

        // Identify deleted files
        const imagesToDelete = activity.images.filter(img => !existingImagesArray.includes(img));
        const videosToDelete = activity.videos.filter(vid => !existingVideosArray.includes(vid));
        await deleteFiles([...imagesToDelete, ...videosToDelete]);

        activity.title = title || activity.title;
        activity.description = description || activity.description;
        activity.shortDescription = shortDescription || activity.shortDescription;
        activity.price = price || activity.price;
        activity.location = location || activity.location;
        activity.images = [...existingImagesArray, ...newImages];
        activity.videos = [...existingVideosArray, ...newVideos];

        await activity.save();
        res.json(activity);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE activity (Admin)
router.delete('/:id', auth, async (req, res) => {
    try {
        const activity = await Activity.findById(req.params.id);
        if (!activity) return res.status(404).json({ message: 'Activity not found' });

        await deleteFiles([...activity.images, ...activity.videos]);
        await Activity.findByIdAndDelete(req.params.id);
        res.json({ message: 'Activity deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
