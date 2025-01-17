const Student = require('../models/studentModel');
const Tutor = require('../models/tutorModel');
const sendEmail = require('../utlis/emailService');
const { v4: uuidv4 } = require('uuid');

const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Verification</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f7fc;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 8px;
      padding: 40px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
    .header {
      text-align: center;
      margin-bottom: 20px;
    }
    .header h1 {
      font-size: 24px;
      color: #333;
    }
    .content {
      font-size: 16px;
      color: #555;
      line-height: 1.5;
      margin-bottom: 20px;
    }
    .footer {
      text-align: center;
      font-size: 14px;
      color: #777;
    }
    .footer a {
      color: #007BFF;
      text-decoration: none;
    }
    .footer a:hover {
      text-decoration: underline;
    }
    .button {
      display: inline-block;
      background-color: #007BFF;
      color: #ffffff;
      padding: 12px 20px;
      font-size: 16px;
      border-radius: 5px;
      text-align: center;
      text-decoration: none;
      margin-top: 20px;
    }
    .button:hover {
      background-color: #0056b3;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Thank You for Your Submission!</h1>
    </div>
    <div class="content">
      <p>Dear Customer,</p>
      <p>We would like to inform you that your email has been successfully verified, and your form submission is now complete. Our team will contact you shortly regarding the next steps.</p>
      <p>If you have any immediate questions or concerns, feel free to reach out to us.</p>
      <p>Thank you for your patience and trust!</p>
      <a href="https://agra-tutorials.netlify.app/" class="button">Visit Our Website</a>
    </div>
    <div class="footer">
      <p>If you didn't request this action, please ignore this email or contact us for assistance.</p>
      <p>© 2025 Your Company Name</p>
    </div>
  </div>
</body>
</html>
`;

const generateVerificationEmailContent = (verificationLink) => {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verification</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f7fc;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            padding: 40px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 20px;
          }
          .header h1 {
            font-size: 24px;
            color: #333;
          }
          .content {
            font-size: 16px;
            color: #555;
            line-height: 1.5;
            margin-bottom: 20px;
          }
          .footer {
            text-align: center;
            font-size: 14px;
            color: #777;
          }
          .footer a {
            color: #007BFF;
            text-decoration: none;
          }
          .footer a:hover {
            text-decoration: underline;
          }
          .button {
            display: inline-block;
            background-color: #007BFF;
            color: #ffffff;
            padding: 12px 20px;
            font-size: 16px;
            border-radius: 5px;
            text-align: center;
            text-decoration: none;
            margin-top: 20px;
          }
          .button:hover {
            background-color: #0056b3;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Email Verification</h1>
          </div>
          <div class="content">
            <p>Dear User,</p>
            <p>Thank you for registering with us! To complete your registration, we kindly ask you to verify your email address.</p>
            <p>Please click the button below to verify your email address:</p>
            <a href="${verificationLink}" class="button">Verify Your Email</a>
            <p>If you didn't request this, please ignore this email, and your account will remain unverified.</p>
            <p>We look forward to having you on board!</p>
          </div>
          <div class="footer">
            <p>If you have any questions, feel free to <a href="mailto:support@yourcompany.com">contact us</a>.</p>
            <p>© 2025 Your Company Name</p>
          </div>
        </div>
      </body>
      </html>
    `;
  };
  



// Step 1: Submit form and send verification code
const submitForm = async (req, res) => {
  const { firstName, lastName, address, mobileNo, subjectExpertise, teachUpToClass, email } = req.body;

  try {
    // Check if email already exists
    const existingTutor = await Tutor.findOne({ email });
    if (existingTutor && existingTutor.isVerified) {
      return res.status(400).json({ message: 'Email is already registered and verified.' });
    }

    // Generate a unique verification code
    const verificationCode = uuidv4();

    // Save tutor data with verification code
    const tutorData = {
      firstName,
      lastName,
      address,
      mobileNo,
      subjectExpertise,
      teachUpToClass,
      email,
      verificationCode,
    };

    const tutor = await Tutor.findOneAndUpdate(
      { email },
      tutorData,
      { new: true, upsert: true } // Update if exists, else create
    );

    // Send verification email
    const verificationLink = `http://localhost:5000/api/verify-email-tutor?email=${email}&code=${verificationCode}`;
    const htmlContentV = generateVerificationEmailContent(verificationLink);
    await sendEmail(email, 'Verify your email', htmlContentV);


    const adminEmailContent = `
    <h1>New Tutor Registered</h1>
    <table border="1" cellpadding="10" cellspacing="0" style="border-collapse: collapse; width: 100%; text-align: left;">
      <thead>
        <tr style="background-color: #f2f2f2;">
          <th style="border: 1px solid #ddd; padding: 8px;">Field</th>
          <th style="border: 1px solid #ddd; padding: 8px;">Details</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px;"><strong>Name</strong></td>
          <td style="border: 1px solid #ddd; padding: 8px;">${tutor.firstName} ${tutor.lastName}</td>
        </tr>
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px;"><strong>Email</strong></td>
          <td style="border: 1px solid #ddd; padding: 8px;">${tutor.email}</td>
        </tr>
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px;"><strong>Mobile Number</strong></td>
          <td style="border: 1px solid #ddd; padding: 8px;">${tutor.mobileNo}</td>
        </tr>
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px;"><strong>Address</strong></td>
          <td style="border: 1px solid #ddd; padding: 8px;">${tutor.address}</td>
        </tr>
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px;"><strong>Subject Expertise</strong></td>
          <td style="border: 1px solid #ddd; padding: 8px;">${tutor.subjectExpertise}</td>
        </tr>
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px;"><strong>Teach Up To Class</strong></td>
          <td style="border: 1px solid #ddd; padding: 8px;">${tutor.teachUpToClass}</td>
        </tr>
      </tbody>
    </table>
    
  `;
  
  const adminEmailSubject = 'New Tutor Registered';
  
  await sendEmail('agraluvagarwal@gmail.com', adminEmailSubject, adminEmailContent);

    res.status(200).json({ message: 'Verification email sent. Please check your email to verify.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const submitStudentForm = async (req, res) => {
    const { firstName, lastName, address, mobileNo, classEnrolled, email } = req.body;
  
    try {
      // Step 1: Check if email already exists
      const existingStudent = await Student.findOne({ email });
      if (existingStudent && existingStudent.isVerified) {
        return res.status(400).json({ message: 'Email is already registered and verified.' });
      }
  
      // Step 2: Generate a unique verification code
      const verificationCode = uuidv4();
  
      // Step 3: Save student data with verification code
      const studentData = {
        firstName,
        lastName,
        address,
        mobileNo,
        classEnrolled,
        email,
        verificationCode,
      };
  
      const student = await Student.findOneAndUpdate(
        { email },
        studentData,
        { new: true, upsert: true } // Update if exists, else create
      );
  
      // Step 4: Send verification email
      const verificationLink = `http://localhost:5000/api/students/verify-email?email=${email}&code=${verificationCode}`;
      const htmlContentV = generateVerificationEmailContent(verificationLink);
      await sendEmail(email, 'Verify your email', htmlContentV);


      const adminEmailContent = `
      <h1>New Tutor Verified</h1>
      <table border="1" cellpadding="10" cellspacing="0" style="border-collapse: collapse; width: 100%; text-align: left;">
        <thead>
          <tr style="background-color: #f2f2f2;">
            <th style="border: 1px solid #ddd; padding: 8px;">Field</th>
            <th style="border: 1px solid #ddd; padding: 8px;">Details</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;"><strong>Name</strong></td>
            <td style="border: 1px solid #ddd; padding: 8px;">${student.firstName} ${student.lastName}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;"><strong>Email</strong></td>
            <td style="border: 1px solid #ddd; padding: 8px;">${student.email}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;"><strong>Mobile Number</strong></td>
            <td style="border: 1px solid #ddd; padding: 8px;">${student.mobileNo}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;"><strong>Address</strong></td>
            <td style="border: 1px solid #ddd; padding: 8px;">${student.address}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;"><strong>Subject Expertise</strong></td>
            <td style="border: 1px solid #ddd; padding: 8px;">${student.subjectExpertise}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;"><strong>Teach Up To Class</strong></td>
            <td style="border: 1px solid #ddd; padding: 8px;">${student.teachUpToClass}</td>
          </tr>
        </tbody>
      </table>
      
    `;
    



      const adminEmailSubject = 'New Student Registered';

await sendEmail('agraluvagarwal@gmail.com', adminEmailSubject, adminEmailContent);
  
      // Step 5: Respond with success message
      res.status(200).json({ message: 'Verification email sent. Please check your email to verify.' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };

// Step 2: Verify email
const verifyEmail = async (req, res) => {
  const { email, code } = req.query;

  try {
    const tutor = await Tutor.findOne({ email, verificationCode: code });

    if (!tutor) {
      return res.status(400).json({ message: 'Invalid verification code or email.' });
    }


    
    // Mark as verified
    console.log(tutor)
    tutor.isVerified = true;
    tutor.verificationCode = null; // Clear the code after verification
    await tutor.save();

    // Send confirmation email
    await sendEmail(email, 'Congratulations !! Email Verified ', htmlContent);

    const adminEmailContent = `
  <h1>New Tutor Verified</h1>
  <table border="1" cellpadding="10" cellspacing="0" style="border-collapse: collapse; width: 100%; text-align: left;">
    <thead>
      <tr style="background-color: #f2f2f2;">
        <th style="border: 1px solid #ddd; padding: 8px;">Field</th>
        <th style="border: 1px solid #ddd; padding: 8px;">Details</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px;"><strong>Name</strong></td>
        <td style="border: 1px solid #ddd; padding: 8px;">${tutor.firstName} ${tutor.lastName}</td>
      </tr>
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px;"><strong>Email</strong></td>
        <td style="border: 1px solid #ddd; padding: 8px;">${tutor.email}</td>
      </tr>
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px;"><strong>Mobile Number</strong></td>
        <td style="border: 1px solid #ddd; padding: 8px;">${tutor.mobileNo}</td>
      </tr>
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px;"><strong>Address</strong></td>
        <td style="border: 1px solid #ddd; padding: 8px;">${tutor.address}</td>
      </tr>
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px;"><strong>Subject Expertise</strong></td>
        <td style="border: 1px solid #ddd; padding: 8px;">${tutor.subjectExpertise}</td>
      </tr>
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px;"><strong>Teach Up To Class</strong></td>
        <td style="border: 1px solid #ddd; padding: 8px;">${tutor.teachUpToClass}</td>
      </tr>
    </tbody>
  </table>
  
`;

const adminEmailSubject = 'New Tutor Verified';

await sendEmail('kushalhts00@gmail.com', adminEmailSubject, adminEmailContent);

    res.status(200).json({ message: 'Email verified successfully. Your form is submitted.' });
  } catch (error) {

    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const verifyStudentEmail = async (req, res) => {
    const { email, code } = req.query;
  
    try {
      // Step 1: Find the student by email and verification code
      const student = await Student.findOne({ email, verificationCode: code });
  
      if (!student) {
        return res.status(400).json({ message: 'Invalid or expired verification link.' });
      }
  
      // Step 2: Mark the student as verified
      student.isVerified = true;
      student.verificationCode = null; // Clear the verification code
      await Student.save();
      // HTML content to be sent in the email


      await sendEmail(email, 'Congratulations !! Email Verified ', htmlContent);

      const adminEmailContent = `
      <h1>New Tutor Verified</h1>
      <table border="1" cellpadding="10" cellspacing="0" style="border-collapse: collapse; width: 100%; text-align: left;">
        <thead>
          <tr style="background-color: #f2f2f2;">
            <th style="border: 1px solid #ddd; padding: 8px;">Field</th>
            <th style="border: 1px solid #ddd; padding: 8px;">Details</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;"><strong>Name</strong></td>
            <td style="border: 1px solid #ddd; padding: 8px;">${Student.firstName} ${Student.lastName}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;"><strong>Email</strong></td>
            <td style="border: 1px solid #ddd; padding: 8px;">${Student.email}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;"><strong>Mobile Number</strong></td>
            <td style="border: 1px solid #ddd; padding: 8px;">${Student.mobileNo}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;"><strong>Address</strong></td>
            <td style="border: 1px solid #ddd; padding: 8px;">${Student.address}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;"><strong>Subject Expertise</strong></td>
            <td style="border: 1px solid #ddd; padding: 8px;">${Student.subjectExpertise}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;"><strong>Teach Up To Class</strong></td>
            <td style="border: 1px solid #ddd; padding: 8px;">${Student.teachUpToClass}</td>
          </tr>
        </tbody>
      </table>
      
    `;
    



      const adminEmailSubject = 'New Student Verified';

await sendEmail('kushalhts00@gmail.com', adminEmailSubject, adminEmailContent);
  
      // Step 3: Respond with a success message
      res.status(200).json({ message: 'Email verified successfully. You can now  in.' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
  

module.exports = { submitForm,submitStudentForm, verifyEmail,verifyStudentEmail };
