const express = require('express');
const { submitForm, verifyEmail } = require('../controllers/tutorController');
const { submitStudentForm } = require('../controllers/tutorController');
const { verifyStudentEmail } = require('../controllers/tutorController');
const router = express.Router();

router.post('/submit-form', submitForm);
router.get('/verify-email-tutor', verifyEmail);

router.post('/register', submitStudentForm);

// Route to verify a student's email
router.get('/verify-email-student', verifyStudentEmail);

module.exports = router;
