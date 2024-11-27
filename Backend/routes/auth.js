const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const router = express.Router();
const pool = require('../db'); // Assuming db.js is set up correctly

// Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const [user] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (!user || !bcrypt.compareSync(password, user[0].password)) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user[0].id, role: user[0].role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    return res.json({ status: 'success', token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
});

// Signup Route (for students)
router.post('/signup', async (req, res) => {
  const { name, usn, email, phone_number, cgpa, password } = req.body;

  try {
    // Hash the password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Insert into the users table
    await pool.query(
      'INSERT INTO users (name, usn, email, phone_number, cgpa, password) VALUES (?, ?, ?, ?, ?, ?)',
      [name, usn, email, phone_number, cgpa, hashedPassword]
    );

    // Automatically assign as student
    const user = await pool.query('SELECT * FROM users WHERE usn = ?', [usn]);

    // Create JWT token
    const token = jwt.sign({ id: user[0].id, role: 'Student' }, process.env.JWT_SECRET, { expiresIn: '1h' });

    return res.json({ status: 'success', token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
});

module.exports = router;
