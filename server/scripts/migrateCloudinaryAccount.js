const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });

const Package = require('../models/Package');
const Category = require('../models/Category');
const Gallery = require('../models/Gallery');
const Activity = require('../models/Activity');
const Event = require('../models/Event');

// Configure global Cloudinary to NEW account
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const oldCloudinaryConfig = {
    cloud_name: process.env.OLD_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.OLD_CLOUDINARY_API_KEY,
    api_secret: process.env.OLD_CLOUDINARY_API_SECRET
};

const extractPublicId = (url) => {
    // URL format: https://res.cloudinary.com/<cloud_name>/<resource_type>/upload/v<version>/<folder>/<filename>.<ext>
    try {
        const parts = url.split('/');
        const uploadIndex = parts.indexOf('upload');
        if (uploadIndex === -1) return null;
        const publicIdWithExt = parts.slice(uploadIndex + 2).join('/');
        return publicIdWithExt.substring(0, publicIdWithExt.lastIndexOf('.'));
    } catch (error) {
        console.error('Error extracting public ID from URL:', url);
        return null;
    }
};

const migrateAsset = async (oldUrl, folder, resourceType) => {
    if (!oldUrl || !oldUrl.includes('cloudinary.com')) return oldUrl;
    if (oldUrl.includes(process.env.CLOUDINARY_CLOUD_NAME)) return oldUrl; // Already in new account

    console.log(`Migrating: ${oldUrl}`);
    try {
        // Upload to new account
        const uploadOptions = {
            folder: folder,
            resource_type: resourceType
        };
        
        // Convert to webp if it's an image
        if (resourceType === 'image') {
            uploadOptions.format = 'webp';
        }

        const result = await cloudinary.uploader.upload(oldUrl, uploadOptions);
        const newUrl = result.secure_url;
        console.log(`✅ Uploaded to: ${newUrl}`);

        // Delete from old account
        const publicId = extractPublicId(oldUrl);
        if (publicId) {
            console.log(`🗑️ Deleting from old account: ${publicId}`);
            await cloudinary.uploader.destroy(publicId, {
                ...oldCloudinaryConfig,
                resource_type: resourceType
            });
        }

        return newUrl;
    } catch (error) {
        console.error(`❌ Migration failed for ${oldUrl}:`, error);
        return oldUrl; // Return old URL on failure so we don't break the DB
    }
};

const migrateArrays = async (doc, fields) => {
    let modified = false;
    for (const field of fields) {
        if (doc[field] && doc[field].length > 0) {
            const newArray = [];
            for (const url of doc[field]) {
                const resourceType = field === 'videos' ? 'video' : 'image';
                const newUrl = await migrateAsset(url, `ask-tours/${doc.constructor.modelName.toLowerCase()}`, resourceType);
                if (newUrl !== url) modified = true;
                newArray.push(newUrl);
            }
            doc[field] = newArray;
        }
    }
    return modified;
};

const migrate = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Migrate Categories
        const categories = await Category.find();
        for (const cat of categories) {
            let modified = false;
            if (cat.coverImage && cat.coverImage.includes('cloudinary.com') && !cat.coverImage.includes(process.env.CLOUDINARY_CLOUD_NAME)) {
                cat.coverImage = await migrateAsset(cat.coverImage, 'ask-tours/categories', 'image');
                modified = true;
            }
            if (cat.contentImage && cat.contentImage.includes('cloudinary.com') && !cat.contentImage.includes(process.env.CLOUDINARY_CLOUD_NAME)) {
                cat.contentImage = await migrateAsset(cat.contentImage, 'ask-tours/categories', 'image');
                modified = true;
            }
            if (modified) await cat.save();
        }

        // Migrate Packages
        const packages = await Package.find();
        for (const pkg of packages) {
            if (await migrateArrays(pkg, ['images', 'videos'])) await pkg.save();
        }

        // Migrate Gallery
        const galleryItems = await Gallery.find();
        for (const item of galleryItems) {
            if (item.url && item.url.includes('cloudinary.com') && !item.url.includes(process.env.CLOUDINARY_CLOUD_NAME)) {
                item.url = await migrateAsset(item.url, 'ask-tours/gallery', 'image');
                await item.save();
            }
        }

        // Migrate Activities
        const activities = await Activity.find();
        for (const activity of activities) {
            if (await migrateArrays(activity, ['images', 'videos'])) await activity.save();
        }

        // Migrate Events
        const events = await Event.find();
        for (const event of events) {
            if (await migrateArrays(event, ['images', 'videos'])) await event.save();
        }

        console.log('🎉 Migration completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
};

migrate();
