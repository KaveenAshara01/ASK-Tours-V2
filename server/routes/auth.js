const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');

// Register admin (only for initial setup)
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    const admin = new Admin({ username, password });
    await admin.save();

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET || 'your-secret-key', {
      expiresIn: '7d'
    });

    res.status(201).json({ token, admin: { id: admin._id, username: admin.username } });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Login admin
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET || 'your-secret-key', {
      expiresIn: '7d'
    });

    res.json({ token, admin: { id: admin._id, username: admin.username } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

