const express = require('express');
const router = express.Router();
const multer = require('multer');
const Event = require('../models/Event');
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

// GET all events
router.get('/', async (req, res) => {
    try {
        // Sort by startDate ascending (Upcoming first)
        const events = await Event.find().sort({ startDate: 1 });
        res.json(events);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET single event
router.get('/:id', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found' });
        res.json(event);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// CREATE event (Admin)
router.post('/', auth, upload.fields([
    { name: 'images', maxCount: 10 },
    { name: 'videos', maxCount: 5 }
]), async (req, res) => {
    try {
        const { title, description, shortDescription, dateType, startDate, endDate, recurringPattern, location } = req.body;
        const images = req.files?.images?.map(f => f.path) || [];
        const videos = req.files?.videos?.map(f => f.path) || [];

        const event = new Event({
            title,
            description,
            shortDescription,
            dateType,
            startDate,
            endDate,
            recurringPattern,
            location,
            images,
            videos
        });

        await event.save();
        res.status(201).json(event);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// UPDATE event (Admin)
router.put('/:id', auth, upload.fields([
    { name: 'images', maxCount: 10 },
    { name: 'videos', maxCount: 5 }
]), async (req, res) => {
    try {
        const { title, description, shortDescription, dateType, startDate, endDate, recurringPattern, location, existingImages, existingVideos } = req.body;
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found' });

        const existingImagesArray = existingImages ? JSON.parse(existingImages) : [];
        const existingVideosArray = existingVideos ? JSON.parse(existingVideos) : [];

        const newImages = req.files?.images?.map(f => f.path) || [];
        const newVideos = req.files?.videos?.map(f => f.path) || [];

        // Identify deleted files
        const imagesToDelete = event.images.filter(img => !existingImagesArray.includes(img));
        const videosToDelete = event.videos.filter(vid => !existingVideosArray.includes(vid));
        await deleteFiles([...imagesToDelete, ...videosToDelete]);

        event.title = title || event.title;
        event.description = description || event.description;
        event.shortDescription = shortDescription || event.shortDescription;
        event.dateType = dateType || event.dateType;
        event.startDate = startDate || event.startDate;
        event.endDate = endDate || event.endDate;
        event.recurringPattern = recurringPattern || event.recurringPattern;
        event.location = location || event.location;
        event.images = [...existingImagesArray, ...newImages];
        event.videos = [...existingVideosArray, ...newVideos];

        await event.save();
        res.json(event);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE event (Admin)
router.delete('/:id', auth, async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found' });

        await deleteFiles([...event.images, ...event.videos]);
        await Event.findByIdAndDelete(req.params.id);
        res.json({ message: 'Event deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
