const express = require('express');
const pool = require('../models/db'); // Assuming you have a DB pool connection
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const authenticate = require('../middlewares/authenticate'); // JWT authentication middleware
const authorize = require('../middlewares/authorize'); // Role-based access control middleware
const QRCode = require('qrcode');
const nodemailer = require('nodemailer');
const router = express.Router();

// Secret key for encryption and decryption
const SECRET_KEY = process.env.SECRET_KEY; // Change this to your actual secret

// Encrypt function
const encrypt = (data) => {
  const cipher = crypto.createCipher('aes-256-cbc', SECRET_KEY);
  let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
};

// Decrypt function
const decrypt = (encryptedData) => {
  const decipher = crypto.createDecipher('aes-256-cbc', SECRET_KEY);
  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  console.log(decrypted)
  return JSON.parse(decrypted);
};

// Registration API to generate QR code
router.post('/register', authenticate, async (req, res) => {
  const { driveId } = req.body;
  const userId = req.user.id;
  console.log(SECRET_KEY)
  try {
    // Check if the user is already registered for this drive
    const [existingRegistration] = await pool.query(
      'SELECT * FROM applied_drives WHERE user_id = ? AND drive_id = ?',
      [userId, driveId]
    );
    console.log("Query Exec: ",existingRegistration)
    if (existingRegistration.length > 0) {
      return res.status(400).json({ message: 'You are already registered for this drive' });
    };
    var [[userData]] = await pool.query(
      `SELECT u.email AS email, u.name AS user_name, c.name AS company_name, d.drive_date AS drive_date
       FROM users u
       JOIN drives d ON u.id = ? 
       JOIN companies c ON d.company_id = c.id
       WHERE d.id = ?`,
      [userId, driveId]
    );
    userData.drive_date = new Date(userData.drive_date).toLocaleDateString('en-GB'); // Uses UK format (dd/mm/yyyy)
    // userData = userData[0][0]
    console.log("QUER##",userData.drive_date)
    // Register for the drive
    await pool.query(
      'INSERT INTO applied_drives (user_id, drive_id) VALUES (?, ?)',
      [userId, driveId]
    );

    // Prepare data to be encoded in the QR code
    const qrData = {
      userId: userId,
      driveId: driveId,
      timestamp: new Date().toISOString(),
    };
    console.log("QR Data: ",qrData)
    // Encrypt the data
    const encryptedData = encrypt(qrData);

    // Generate QR code as a buffer
    const qrCodeBuffer = await QRCode.toBuffer(encryptedData);

    // Configure email transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Use a valid email service (e.g., Gmail, Outlook, etc.)
      auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASSWORD, // Your email password or app-specific password
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userData.email, // Send to the authenticated user's email
      subject: 'Confirmation of Your Drive Registration',
      html: `
        <html>
          <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
              <h2 style="color: #333333; text-align: center;">Drive Registration Confirmation</h2>
              <p style="color: #555555; font-size: 16px;">Dear <strong>${userData.user_name}</strong>,</p>
              
              <p style="color: #555555; font-size: 16px;">We are delighted to confirm your successful registration for the upcoming recruitment drive hosted by <strong>${userData.company_name}</strong>.</p>
              
              <h3 style="color: #333333; margin-bottom: 10px;">Drive Details</h3>
              <ul style="color: #555555; font-size: 16px; line-height: 1.5;">
                <li><strong>Company Name:</strong> ${userData.company_name}</li>
                <li><strong>Drive Date:</strong> ${userData.drive_date}</li>
              </ul>
              
              <p style="color: #555555; font-size: 16px;">Below is your unique QR code. Please keep it accessible during the event for attendance marking.</p>
              <div style="text-align: center; margin: 20px 0;">
                <img src="cid:qrCodeImage" alt="QR Code" style="max-width: 200px; height: auto;"/>
              </div>
              
              <p style="color: #555555; font-size: 16px;">If you have any questions or require assistance, feel free to contact us at <a href="mailto:support@sahyadri.com" style="color: #007bff;">support@sahyadri.com</a>.</p>
              
              <p style="color: #555555; font-size: 16px;">We look forward to seeing you at the drive!</p>
              
              <p style="color: #555555; font-size: 16px;">Best regards,</p>
              <p style="color: #555555; font-size: 16px; margin-top: 5px;">Placement Team<br>Sahyadri College of Engineering and Management</p>
            </div>
          </body>
        </html>
      `,
      attachments: [
        {
          filename: 'qr-code.png', // Name of the file
          content: qrCodeBuffer,   // QR code image buffer
          cid: 'qrCodeImage'       // Content ID to embed the image
        },
      ],
    };
    
    
    
    // Send the email
    await transporter.sendMail(mailOptions);
    

    res.status(200).json({ message: 'Successfully registered and QR code sent via email' });
  } catch (err) {
    console.error('Error during registration:', err);
    res.status(500).json({ message: 'Failed to register for the drive and send email' });
  }
});

// Endpoint to mark attendance or process scanned QR code data
router.post('/mark-attendance', authenticate, authorize(['Volunteer', 'Admin']), async (req, res) => {
  const { data } = req.body; // Data received from scanned QR code
  console.log(data);

  try {
    // Decrypt the received QR code data
    const decryptedData = decrypt(data);

    // Process the decrypted data
    console.log('Decrypted Data:', decryptedData);

    // Validate if the decrypted data has the correct structure
    if (!decryptedData.userId || !decryptedData.driveId || !decryptedData.timestamp) {
      return res.status(400).json({ message: 'Invalid QR code format. Missing required fields.' });
    }

    // Check if the timestamp is a valid ISO string (optional, based on your validation needs)
    if (isNaN(new Date(decryptedData.timestamp).getTime())) {
      return res.status(400).json({ message: 'Invalid timestamp format.' });
    }
    const [check] = await pool.query(
      'SELECT attendance FROM applied_drives WHERE user_id = ? AND drive_id = ? AND attendance = 1',
      [decryptedData.userId, decryptedData.driveId]
    );
    if (check.length>0){
      return res.status(200).json({message: 'User has already been marked!'})
    }
    // Update the attendance field in the applied_drives table
    const [result] = await pool.query(
      'UPDATE applied_drives SET attendance = TRUE WHERE user_id = ? AND drive_id = ?',
      [decryptedData.userId, decryptedData.driveId]
    );

    // Check if any rows were updated
    if (result.affectedRows > 0) {
      res.status(200).json({ message: 'Attendance marked successfully' });
    } else {
      res.status(404).json({ message: 'No matching record found to update attendance' });
    }
  } catch (err) {
    console.error('Error processing QR data:', err);
    res.status(500).json({ message: 'Failed to mark attendance' });
  }
});


module.exports = router;
