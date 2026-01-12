const mongoose = require('mongoose');
const Category = require('../models/Category');
const Package = require('../models/Package');
require('dotenv').config({ path: '../.env' }); // Adjust path if needed

const seedCategories = async () => {
    try {
        const uri = 'mongodb://127.0.0.1:27017/tourism-packages';
        console.log('Connecting to:', uri);
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB Connected');

        const categories = [
            {
                name: 'Cultural',
                description: 'Immerse yourself in the rich heritage and ancient tea traditions of Sri Lanka.',
                coverImage: '/images/category_cultural.png'
            },
            {
                name: 'Beach',
                description: 'Relax on the pristine golden sands and crystal clear waters of the island.',
                coverImage: '/images/category_beach.png'
            }
        ];

        let createdCategories = [];

        for (const cat of categories) {
            let category = await Category.findOne({ name: cat.name });
            if (!category) {
                category = new Category(cat);
                await category.save();
                console.log(`Category created: ${cat.name}`);
            } else {
                console.log(`Category exists: ${cat.name}`);
                // Update image just in case
                category.coverImage = cat.coverImage;
                await category.save();
            }
            createdCategories.push(category);
        }

        // Assign all existing packages to 'Cultural' for now as requested
        const culturalCat = createdCategories.find(c => c.name === 'Cultural');
        if (culturalCat) {
            const packages = await Package.find();
            for (const pkg of packages) {
                if (!pkg.categories.includes(culturalCat._id)) {
                    pkg.categories.push(culturalCat._id);
                    await pkg.save();
                    console.log(`Assigned package '${pkg.title}' to Cultural`);
                }
            }
        }

        console.log('Seeding completed');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding categories:', error);
        process.exit(1);
    }
};

seedCategories();
