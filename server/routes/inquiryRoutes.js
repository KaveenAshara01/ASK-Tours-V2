const express = require('express');
const router = express.Router();
const inquiryController = require('../controllers/inquiryController');

// POST /api/inquiries - Submit a new inquiry
router.post('/', inquiryController.createInquiry);

module.exports = router;
