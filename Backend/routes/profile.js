const express = require('express');
const router = express.Router();
const pool = require('../models/db'); // assuming your database connection is set up
const authenticate = require('../middlewares/authenticate'); // JWT middleware

// Get User Profile
router.get('/profile', authenticate, async (req, res) => {
  try {
    const [user] = await pool.query('SELECT * FROM users WHERE id = ?', [req.user.id]);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ status: 'success', data: user[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
});

// Update User Profile
router.put('/profile', authenticate, async (req, res) => {
  const { name, phone_number, cgpa } = req.body;

  try {
    await pool.query('UPDATE users SET name = ?, phone_number = ?, cgpa = ? WHERE id = ?', [name, phone_number, cgpa, req.user.id]);

    res.json({ status: 'success', message: 'Profile updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
});

module.exports = router;
