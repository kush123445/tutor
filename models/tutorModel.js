const mongoose = require('mongoose');

const tutorSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  address: { type: String, required: true },
  mobileNo: { type: String, required: true },
  subjectExpertise: { type: String, required: true },
  teachUpToClass: { type: String, required: true },
  email: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  verificationCode: { type: String },
});

module.exports = mongoose.model('Tutor', tutorSchema);
