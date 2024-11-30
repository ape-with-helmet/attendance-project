const express = require('express');
const pool = require('../models/db'); // Assuming you have a DB pool connection
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const authenticate = require('../middlewares/authenticate'); // JWT authentication middleware
const authorize = require('../middlewares/authorize'); // Role-based access control middleware
const QRCode = require('qrcode');

const router = express.Router();

// Secret key for encryption and decryption
const SECRET_KEY = process.env.SECRET_KEY || 'your-secret-key'; // Change this to your actual secret

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

  try {
    // Check if the user is already registered for this drive
    const [existingRegistration] = await pool.query(
      'SELECT * FROM applied_drives WHERE user_id = ? AND drive_id = ?',
      [userId, driveId]
    );

    if (existingRegistration.length > 0) {
      return res.json({ message: 'You are already registered for this drive' }).status(400);
    }

    // Register for the drive
    await pool.query(
      'INSERT INTO applied_drives (user_id, drive_id) VALUES (?, ?)',
      [userId, driveId]
    );

    // Prepare data to be encoded in the QR code
    const qrData = {
      userId,
      driveId,
      registrationDate: new Date().toISOString(),
    };

    // Encrypt the data
    const encryptedData = encrypt(qrData);

    // Generate QR code
    const qrCode = await QRCode.toDataURL(encryptedData); // Returns a data URL of the QR code image

    res.status(200).json({ 
      message: 'Successfully registered for the drive', 
      qrCode: qrCode // Send QR code image as base64 encoded string
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to register for the drive' });
  }
});

// Endpoint to mark attendance or process scanned QR code data
router.post('/mark-attendance', authenticate, authorize(['Volunteer','Admin']), async (req, res) => {
  const { data } = req.body; // Data received from scanned QR code
    console.log(data)
  try {
    // Decrypt the received QR code data
    const decryptedData = decrypt(data);

    // Process the decrypted data, for example, mark attendance
    // Here, we're just logging it
    console.log('Decrypted Data:', decryptedData);

    // Simulate attendance marking (you can replace this with your actual logic)
    await pool.query(
      'INSERT INTO attendance (user_id, drive_id, date) VALUES (?, ?, ?)',
      [decryptedData.userId, decryptedData.driveId, new Date()]
    );

    res.status(200).json({ message: 'Attendance marked successfully' });
  } catch (err) {
    console.error('Error processing QR data:', err);
    res.status(500).json({ message: 'Failed to mark attendance' });
  }
});

module.exports = router;
