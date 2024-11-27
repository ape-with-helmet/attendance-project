const express = require('express');
const router = express.Router();
const pool = require('../db'); // Assuming you have a database connection set up
const authenticate = require('../middlewares/authenticate'); // JWT authentication middleware
const authorize = require('../middlewares/authorize'); // Role-based access control middleware

// Admin role assignment (only accessible by Admin)
router.put('/assign-role/:userId', authenticate, authorize(['Admin']), async (req, res) => {
  const { userId } = req.params;
  const { role } = req.body; // Role can be 'Admin', 'Student', 'Volunteer', etc.

  if (!['Admin', 'Student', 'Volunteer'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role' });
  }

  try {
    // Update the user's role in the database
    await pool.query('UPDATE users SET role = ? WHERE id = ?', [role, userId]);

    res.json({ status: 'success', message: 'Role updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
});

// Get the list of students (only accessible by admins)
router.get('/students', authenticate, authorize(['Admin']), async (req, res) => {
  try {
    const [students] = await pool.query('SELECT * FROM users WHERE role = "Student"');
    res.json(students);
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', message: 'Error fetching students' });
  }
});

// Get the list of drives (only accessible by admins)
router.get('/drives', authenticate, authorize(['Admin']), async (req, res) => {
  try {
    const [drives] = await pool.query('SELECT * FROM drives'); // Assuming you have a 'drives' table
    res.json(drives);
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', message: 'Error fetching drives' });
  }
});

module.exports = router;
