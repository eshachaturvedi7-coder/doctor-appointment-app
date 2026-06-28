const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  specialization: {
    type: String,
    required: true
  },
  experience: {
    type: Number,
    default: 0
  },
  fees: {
    type: Number,
    required: true
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  address: {
    type: String,
    default: ''
  },
  timings: {
    start: { type: String, default: '09:00' },
    end: { type: String, default: '17:00' }
  }
}, { timestamps: true });

module.exports = mongoose.model('Doctor', doctorSchema);