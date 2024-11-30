const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const router = express.Router();
const dotenv = require('dotenv');
dotenv.config(); // Load environment variables
const pool = require('../models/db'); // Assuming db.js is set up correctly

// Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log(email,password)
  try {
    const [user] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    console.log(user)
    if (user.length==0) {
      return res.status(401).json({ message: 'User not found!' })
    }
    if (!(await bcrypt.compare(password, user[0].password))){
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign(
      { id: user[0].id, role: user[0].role }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }
    );

    return res.json({ status: 'success', token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
});

// Signup Route (for students)
router.post('/signup', async (req, res) => {
  const { name, usn, email, phone_number, cgpa, password } = req.body;
  console.log(email,password)
  try {
    // Hash the password (async version of bcrypt.hash)
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword)
    // Insert into the users table
    await pool.query(
      'INSERT INTO users (name, usn, email, phone_number, cgpa, password) VALUES (?, ?, ?, ?, ?, ?)',
      [name, usn, email, phone_number, cgpa, hashedPassword]
    );
    console.log("Passed query")
    // Automatically assign as student
    const [user] = await pool.query('SELECT * FROM users WHERE usn = ?', [usn]);

    // Create JWT token
    const token = jwt.sign(
      { id: user[0].id, role: 'Student' }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }
    );

    return res.json({ status: 'success', token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
});
router.post("/refresh-token", (req, res) => {
  const { token } = req.body;

  try {
    const payload = jwt.verify(token, SECRET_KEY); // Verify token validity
    const newPayload = { ...payload, exp: Math.floor(Date.now() / 1000) + TOKEN_LIFETIME }; // Extend expiration
    const newToken = jwt.sign(newPayload, SECRET_KEY);
    res.json({ newToken });
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
});

// Password Change Route
router.put('/change-password', async (req, res) => {
  const { currentPassword, newPassword } = req.body.data;
  const userId = req.body.user; // Assuming the user ID is decoded from the JWT token
  console.log(req.body.data)
  console.log(req.body.user)

  try {
    // Fetch user from the database
    const [user] = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);
    console.log(user[0].password)
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the current password matches
    const isPasswordCorrect = await bcrypt.compare(currentPassword, user[0].password);
    
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Incorrect current password' });
    }

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update the password in the database
    await pool.query('UPDATE users SET password = ? WHERE id = ?', [hashedNewPassword, userId]);

    return res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

const crypto = require('crypto');
const nodemailer = require('nodemailer');

// Assuming you're using a pool for database queries

// /forgot-password route: Send the password reset link
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    // Check if user exists in the database
    const [user] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate a reset token using JWT (token will be stored in the database)
    const resetToken = jwt.sign(
      { email: user[0].email, id: user[0].id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Store the reset token and expiration in the database
    const resetTokenExpiration = Date.now() + 3600000; // 1 hour expiration time
    await pool.query('UPDATE users SET reset_token = ?, reset_token_expiration = ? WHERE email = ?',
      [resetToken, resetTokenExpiration, email]);

    // Send reset email
    const transporter = nodemailer.createTransport({
      service: 'gmail', // You can use other services like Mailgun, SendGrid, etc.
      auth: {
        user: 'sadhgunaithal@gmail.com', // Replace with your email
        pass: 'pmuadrxiovvjhaok', // Replace with your email password or app-specific password
      },
    });

    const resetUrl = `http://localhost:3000/reset-password?token=${resetToken}`;

    await transporter.sendMail({
      to: email,
      subject: 'Password Reset',
      text: `You requested a password reset. Click the following link to reset your password: ${resetUrl}`,
    });

    return res.json({ message: 'Password reset email sent' });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// /reset-password route: Reset the password
router.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    // Decode and verify the reset token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user based on the decoded token email
    const [user] = await pool.query('SELECT * FROM users WHERE id = ?', [decoded.id]);

    if (!user || user[0].reset_token !== token || Date.now() > user[0].reset_token_expiration) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password in the database and invalidate the token
    const result = await pool.query('UPDATE users SET password = ?, reset_token = NULL, reset_token_expiration = NULL WHERE id = ?',
      [hashedPassword, decoded.id]);

    if (result[0].affectedRows > 0) {
      return res.json({ message: 'Password updated successfully' });
    } else {
      return res.status(400).json({ message: 'Failed to update password' });
    }

  } catch (err) {
    console.error(err);
    return res.status(400).json({ message: 'Invalid or expired token' });
  }
});


module.exports = router;
