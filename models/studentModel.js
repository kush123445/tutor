const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
    },
    mobileNo: {
      type: String,
      required: true,
      match: /^[0-9]{10}$/, // Validates 10-digit mobile numbers
    },
    classEnrolled: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Validates email format
    },
    isVerified: {
      type: Boolean,
      default: false, // Becomes true when the email is verified
    },
    verificationCode: {
      type: String,
      required: true, // Stores the unique code sent to the user's email
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt`
  }
);

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
