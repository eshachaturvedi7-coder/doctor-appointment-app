const Appointment = require('../models/Appointment');

const bookAppointment = async (req, res) => {
  const { doctorId, date, timeSlot, reason } = req.body;
  
  const appointment = await Appointment.create({
    patient: req.user.id,
    doctor: doctorId,
    date,
    timeSlot,
    reason
  });

  res.status(201).json({
    message: 'Appointment booked successfully',
    appointment
  });
};

const getMyAppointments = async (req, res) => {
  const appointments = await Appointment.find({ 
    patient: req.user.id 
  }).populate('doctor', 'name email');

  res.json(appointments);
};

const getDoctorAppointments = async (req, res) => {
  const appointments = await Appointment.find({ 
    doctor: req.user.id 
  }).populate('patient', 'name email');

  res.json(appointments);
};

const updateAppointmentStatus = async (req, res) => {
  const { status } = req.body;
  
  const appointment = await Appointment.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );

  res.json({ message: 'Status updated', appointment });
};

module.exports = { 
  bookAppointment, 
  getMyAppointments, 
  getDoctorAppointments,
  updateAppointmentStatus 
};