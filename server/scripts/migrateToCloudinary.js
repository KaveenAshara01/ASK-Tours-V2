const mongoose = require('mongoose');
const { cloudinary } = require('../config/cloudinary');
const Package = require('../models/Package');
const Category = require('../models/Category');
const Gallery = require('../models/Gallery');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });

const uploadToCloudinary = async (filePath, folder, resourceType = 'auto') => {
    // 1. Resolve Path
    // Remove leading slash if present to make it relative for path.join
    const relativePath = filePath.startsWith('/') || filePath.startsWith('\\') ? filePath.slice(1) : filePath;
    const localPath = path.join(__dirname, '..', relativePath);

    // 2. Check Existence
    if (!fs.existsSync(localPath)) {
        console.warn(`⚠️ SKIPPING: File not found at ${localPath}`);
        return null;
    }

    // 3. Upload
    try {
        console.log(`📤 Uploading: ${localPath} -> Folder: ${folder}`);
        const result = await cloudinary.uploader.upload(localPath, {
            folder: folder,
            resource_type: resourceType
        });
        return result.secure_url;
    } catch (err) {
        console.error(`❌ UPLOAD FAILED for ${localPath}`);
        // Log the full error to see why (e.g. invalid signature, missing cloud name, etc.)
        console.error(JSON.stringify(err, null, 2));
        return null;
    }
};

const migrate = async () => {
    try {
        console.log("🔹 Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // RE-CONFIGURE Cloudinary to ensure keys are loaded
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET
        });

        // Debug Checks
        if (!process.env.CLOUDINARY_CLOUD_NAME) console.error("❌ ERROR: CLOUDINARY_CLOUD_NAME is missing from .env");
        if (!process.env.CLOUDINARY_API_KEY) console.error("❌ ERROR: CLOUDINARY_API_KEY is missing from .env");
        if (!process.env.CLOUDINARY_API_SECRET) console.error("❌ ERROR: CLOUDINARY_API_SECRET is missing from .env");

        console.log(`🔹 Cloudinary Config: Cloud Name = ${process.env.CLOUDINARY_CLOUD_NAME}`);


        // 1. Migrate Categories
        const categories = await Category.find();
        console.log(`\n🔍 Checking ${categories.length} categories...`);

        for (const cat of categories) {
            let modified = false;

            if (cat.coverImage && !cat.coverImage.includes('cloudinary') && !cat.coverImage.startsWith('http')) {
                const newUrl = await uploadToCloudinary(cat.coverImage, 'ask-tours/categories');
                if (newUrl) {
                    cat.coverImage = newUrl;
                    modified = true;
                }
            }

            if (cat.contentImage && !cat.contentImage.includes('cloudinary') && !cat.contentImage.startsWith('http')) {
                const newUrl = await uploadToCloudinary(cat.contentImage, 'ask-tours/categories');
                if (newUrl) {
                    cat.contentImage = newUrl;
                    modified = true;
                }
            }

            if (modified) await cat.save();
        }

        // 2. Migrate Packages
        const packages = await Package.find();
        console.log(`\n🔍 Checking ${packages.length} packages...`);

        for (const pkg of packages) {
            let modified = false;

            // Migrate images array
            if (pkg.images && pkg.images.length > 0) {
                const newImages = [];
                for (const img of pkg.images) {
                    if (!img.includes('cloudinary') && !img.startsWith('http')) {
                        const newUrl = await uploadToCloudinary(img, 'ask-tours/packages');
                        newImages.push(newUrl || img); // Keep original if fail
                        if (newUrl) modified = true;
                    } else {
                        newImages.push(img);
                    }
                }
                pkg.images = newImages;
            }

            // Migrate videos array
            if (pkg.videos && pkg.videos.length > 0) {
                const newVideos = [];
                for (const vid of pkg.videos) {
                    if (!vid.includes('cloudinary') && !vid.startsWith('http')) {
                        const newUrl = await uploadToCloudinary(vid, 'ask-tours/packages', 'video');
                        newVideos.push(newUrl || vid);
                        if (newUrl) modified = true;
                    } else {
                        newVideos.push(vid);
                    }
                }
                pkg.videos = newVideos;
            }

            if (modified) await pkg.save();
        }

        // 3. Migrate Gallery
        const galleryItems = await Gallery.find();
        console.log(`\n🔍 Checking ${galleryItems.length} gallery items...`);

        for (const item of galleryItems) {
            if (item.url && !item.url.includes('cloudinary') && !item.url.startsWith('http')) {
                const newUrl = await uploadToCloudinary(item.url, 'ask-tours/gallery');
                if (newUrl) {
                    item.url = newUrl;
                    await item.save();
                }
            }
        }

        console.log('\n✅ Migration completed!');
        process.exit();
    } catch (error) {
        console.error('❌ Migration Critical Failure:', error);
        process.exit(1);
    }
};

migrate();
