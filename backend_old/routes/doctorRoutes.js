const express = require('express');
const router = express.Router();
const { createDoctorProfile, getAllDoctors } = require('../controllers/doctorController');
const { protect } = require('../middleware/auth');

router.post('/create-profile', protect, createDoctorProfile);
router.get('/all', getAllDoctors);

module.exports = router;