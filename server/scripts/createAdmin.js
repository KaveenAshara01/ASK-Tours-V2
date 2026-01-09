const mongoose = require('mongoose');
const Admin = require('../models/Admin');
require('dotenv').config();

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tourism-packages');
    console.log('Connected to MongoDB');

    // Check if admin exists
    const existingAdmin = await Admin.findOne({ username: 'admin' });
    if (existingAdmin) {
      console.log('Admin user already exists!');
      process.exit(0);
    }

    // Create default admin
    const admin = new Admin({
      username: 'admin',
      password: 'admin123'
    });

    await admin.save();
    console.log('✅ Default admin created successfully!');
    console.log('Username: admin');
    console.log('Password: admin123');
    console.log('⚠️  Please change the password after first login!');
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
}

createAdmin();

// http://localhost:3000/admin/login
//for admin login