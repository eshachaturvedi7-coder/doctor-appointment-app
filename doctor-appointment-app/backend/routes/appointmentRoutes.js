const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const appointmentController = require('../controllers/appointmentController');

router.post('/book', protect, appointmentController.bookAppointment);
router.get('/my-appointments', protect, appointmentController.getMyAppointments);
router.get('/doctor-appointments', protect, appointmentController.getDoctorAppointments);
router.put('/update-status/:id', protect, appointmentController.updateAppointmentStatus);

module.exports = router;