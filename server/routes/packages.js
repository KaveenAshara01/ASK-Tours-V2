const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Package = require('../models/Package');
const auth = require('../middleware/auth');

// Configure multer for file uploads
const { storage, cloudinary } = require('../config/cloudinary');

const upload = multer({ storage });

// Helper function to delete files
const deleteFiles = async (filePaths) => {
  if (!filePaths || !Array.isArray(filePaths)) return;

  for (const filePath of filePaths) {
    if (!filePath) continue;

    if (filePath.includes('cloudinary.com')) {
      try {
        const splitUrl = filePath.split('/');
        const filename = splitUrl[splitUrl.length - 1];
        const folder = splitUrl[splitUrl.length - 2];
        const publicId = `${folder}/${filename.split('.')[0]}`;
        const isVideo = filename.match(/\.(mp4|webm|ogg|mov|avi)$/i);

        await cloudinary.uploader.destroy(publicId, {
          resource_type: isVideo ? 'video' : 'image'
        });
        console.log(`Deleted Cloudinary file: ${publicId}`);
      } catch (err) {
        console.error(`Error deleting Cloudinary file ${filePath}:`, err);
      }
    } else {
      // Legacy local file deletion
      const cleanPath = filePath.startsWith('/') ? filePath.slice(1) : filePath;
      const fullPath = path.join(__dirname, '..', cleanPath);
      if (fs.existsSync(fullPath)) {
        try {
          fs.unlinkSync(fullPath);
          console.log(`Deleted file: ${fullPath}`);
        } catch (err) {
          console.error(`Error deleting file ${fullPath}:`, err);
        }
      }
    }
  }
};

// Get all packages (public)
router.get('/', async (req, res) => {
  try {
    const query = {};
    if (req.query.category) {
      query.categories = req.query.category;
    }
    const packages = await Package.find(query).sort({ createdAt: -1 }).populate('categories', 'name');
    res.json(packages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single package (public)
router.get('/:id', async (req, res) => {
  try {
    const package = await Package.findById(req.params.id);
    if (!package) {
      return res.status(404).json({ message: 'Package not found' });
    }
    res.json(package);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create package (admin only)
router.post('/', auth, upload.fields([
  { name: 'images', maxCount: 30 },
  { name: 'videos', maxCount: 10 }
]), async (req, res) => {
  try {
    const { title, description, price, featured, duration } = req.body;
    const days = req.body.days ? JSON.parse(req.body.days) : [];
    const stops = req.body.stops ? JSON.parse(req.body.stops) : [];
    const categories = req.body.categories ? JSON.parse(req.body.categories) : [];

    const imageFiles = req.files?.images || [];
    const videoFiles = req.files?.videos || [];

    if (imageFiles.length === 0 && videoFiles.length === 0) {
      return res.status(400).json({ message: 'At least one image or video is required' });
    }

    // Use file.path for Cloudinary URLs
    const images = imageFiles.map(file => file.path);
    const videos = videoFiles.map(file => file.path);

    const package = new Package({
      title,
      description,
      duration,
      price: parseFloat(price),
      images,
      videos,
      featured: featured === 'true',
      featured: featured === 'true',
      days,
      stops,
      categories
    });

    await package.save();
    res.status(201).json(package);
  } catch (error) {
    // Attempt cleanup if save fails (best effort)
    const allFiles = [...(req.files?.images || []), ...(req.files?.videos || [])];
    const filePaths = allFiles.map(f => f.path);
    if (filePaths.length > 0) deleteFiles(filePaths);

    res.status(400).json({ message: error.message });
  }
});

// Update package (admin only)
router.put('/:id', auth, upload.fields([
  { name: 'images', maxCount: 30 },
  { name: 'videos', maxCount: 10 }
]), async (req, res) => {
  try {
    const { title, description, price, featured, existingImages, existingVideos, duration } = req.body;
    const days = req.body.days ? JSON.parse(req.body.days) : [];
    const stops = req.body.stops ? JSON.parse(req.body.stops) : [];
    const categories = req.body.categories ? JSON.parse(req.body.categories) : [];
    const package = await Package.findById(req.params.id);

    if (!package) {
      return res.status(404).json({ message: 'Package not found' });
    }

    // Parse existing media arrays
    const existingImagesArray = existingImages ? JSON.parse(existingImages) : [];
    const existingVideosArray = existingVideos ? JSON.parse(existingVideos) : [];

    // Get new files
    const newImageFiles = req.files?.images || [];
    const newVideoFiles = req.files?.videos || [];

    // Combine existing and new media
    const images = [
      ...existingImagesArray,
      ...newImageFiles.map(file => file.path)
    ];
    const videos = [
      ...existingVideosArray,
      ...newVideoFiles.map(file => file.path)
    ];

    // Find files to delete (files that were removed)
    const imagesToDelete = package.images.filter(img => !existingImagesArray.includes(img));
    const videosToDelete = package.videos.filter(vid => !existingVideosArray.includes(vid));

    // Delete removed files
    await deleteFiles([...imagesToDelete, ...videosToDelete]);

    package.title = title || package.title;
    package.duration = duration || package.duration;
    package.description = description || package.description;
    package.price = price ? parseFloat(price) : package.price;
    package.featured = featured !== undefined ? featured === 'true' : package.featured;
    package.days = days || package.days;
    package.stops = stops || package.stops;
    package.categories = categories || package.categories;
    package.images = images;
    package.videos = videos;

    await package.save();
    res.json(package);
  } catch (error) {
    // Cleanup new uploads if update fails
    const allFiles = [...(req.files?.images || []), ...(req.files?.videos || [])];
    const filePaths = allFiles.map(f => f.path);
    if (filePaths.length > 0) deleteFiles(filePaths);

    res.status(400).json({ message: error.message });
  }
});

// Delete package (admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const package = await Package.findById(req.params.id);
    if (!package) {
      return res.status(404).json({ message: 'Package not found' });
    }

    // Delete all associated files (handle both new and old format)
    const allFiles = [
      ...(package.images || []),
      ...(package.videos || []),
      ...(package.image ? [package.image] : []) // Backward compatibility
    ];
    await deleteFiles(allFiles);

    // Delete the package
    await Package.findByIdAndDelete(req.params.id);
    res.json({ message: 'Package deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

