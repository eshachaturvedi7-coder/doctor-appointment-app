const Doctor = require('../models/Doctor');
const User = require('../models/User');

// Doctor profile create karo (jab koi user role="doctor" se register kare)
const createDoctorProfile = async (req, res) => {
  try {
    const { specialization, experience, fees, address } = req.body;
    const userId = req.user.id; // auth middleware se aayega

    // Check karo ki user exist karta hai aur role doctor hai
    const user = await User.findById(userId);
    if (!user || user.role !== 'doctor') {
      return res.status(403).json({ message: 'Only doctors can create a profile' });
    }

    // Check karo agar already profile bani hai
    const existingDoctor = await Doctor.findOne({ user: userId });
    if (existingDoctor) {
      return res.status(400).json({ message: 'Doctor profile already exists' });
    }

    const doctor = await Doctor.create({
      user: userId,
      specialization,
      experience,
      fees,
      address
    });

    res.status(201).json({ message: 'Doctor profile created', doctor });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Saare approved doctors ki list (patients ke liye)
const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({ isApproved: true }).populate('user', 'name email phone');
    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { createDoctorProfile, getAllDoctors };