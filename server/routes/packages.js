const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Package = require('../models/Package');
const auth = require('../middleware/auth');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'server/uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'package-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter for images and videos
const fileFilter = (req, file, cb) => {
  const extname = path.extname(file.originalname).toLowerCase().replace('.', '');
  const mimetype = file.mimetype;

  const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
  const videoExts = ['mp4', 'webm', 'ogg', 'mov', 'avi'];

  if (imageExts.includes(extname)) {
    if (mimetype.startsWith('image/') || mimetype === 'application/octet-stream') {
      return cb(null, true);
    }
  }

  if (videoExts.includes(extname)) {
    if (mimetype.startsWith('video/') || mimetype === 'application/octet-stream' || mimetype === 'application/ogg') {
      return cb(null, true);
    }
  }

  cb(new Error('Only image and video files are allowed'));
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit for videos
  fileFilter: fileFilter
});

// Helper function to delete files
const deleteFiles = (filePaths) => {
  filePaths.forEach(filePath => {
    if (filePath) {
      // Remove leading slash if present and construct full path
      const cleanPath = filePath.startsWith('/') ? filePath.slice(1) : filePath;
      const fullPath = path.join(__dirname, '..', cleanPath);
      if (fs.existsSync(fullPath)) {
        try {
          fs.unlinkSync(fullPath);
          console.log(`Deleted file: ${fullPath}`);
        } catch (err) {
          console.error(`Error deleting file ${fullPath}:`, err);
        }
      } else {
        console.warn(`File not found: ${fullPath}`);
      }
    }
  });
};

// Get all packages (public)
router.get('/', async (req, res) => {
  try {
    const packages = await Package.find().sort({ createdAt: -1 });
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
  { name: 'images', maxCount: 20 },
  { name: 'videos', maxCount: 10 }
]), async (req, res) => {
  try {
    const { title, description, price, featured } = req.body;

    const imageFiles = req.files?.images || [];
    const videoFiles = req.files?.videos || [];

    if (imageFiles.length === 0 && videoFiles.length === 0) {
      return res.status(400).json({ message: 'At least one image or video is required' });
    }

    const images = imageFiles.map(file => `/uploads/${file.filename}`);
    const videos = videoFiles.map(file => `/uploads/${file.filename}`);

    const package = new Package({
      title,
      description,
      price: parseFloat(price),
      images,
      videos,
      featured: featured === 'true'
    });

    await package.save();
    res.status(201).json(package);
  } catch (error) {
    // Delete uploaded files if package creation fails
    const allFiles = [...(req.files?.images || []), ...(req.files?.videos || [])];
    allFiles.forEach(file => {
      const filePath = path.join(__dirname, '..', 'uploads', file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });
    res.status(400).json({ message: error.message });
  }
});

// Update package (admin only)
router.put('/:id', auth, upload.fields([
  { name: 'images', maxCount: 20 },
  { name: 'videos', maxCount: 10 }
]), async (req, res) => {
  try {
    const { title, description, price, featured, existingImages, existingVideos } = req.body;
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
      ...newImageFiles.map(file => `/uploads/${file.filename}`)
    ];
    const videos = [
      ...existingVideosArray,
      ...newVideoFiles.map(file => `/uploads/${file.filename}`)
    ];

    // Find files to delete (files that were removed)
    const imagesToDelete = package.images.filter(img => !existingImagesArray.includes(img));
    const videosToDelete = package.videos.filter(vid => !existingVideosArray.includes(vid));

    // Delete removed files
    deleteFiles([...imagesToDelete, ...videosToDelete]);

    package.title = title || package.title;
    package.description = description || package.description;
    package.price = price ? parseFloat(price) : package.price;
    package.featured = featured !== undefined ? featured === 'true' : package.featured;
    package.images = images;
    package.videos = videos;

    await package.save();
    res.json(package);
  } catch (error) {
    // Delete uploaded files if update fails
    const allFiles = [...(req.files?.images || []), ...(req.files?.videos || [])];
    allFiles.forEach(file => {
      const filePath = path.join(__dirname, '..', 'uploads', file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });
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
    deleteFiles(allFiles);

    // Delete the package
    await Package.findByIdAndDelete(req.params.id);
    res.json({ message: 'Package deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

