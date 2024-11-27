const express = require('express');
const router = express.Router();
const pool = require('../db'); // assuming your database connection is set up
const authenticate = require('../middleware/authenticate'); // JWT middleware
const authorize = require('../middleware/authorize'); // Role-based access control middleware

// Admin role assignment
router.put('/assign-role/:userId', authenticate, authorize(['Admin']), async (req, res) => {
  const { userId } = req.params;
  const { role } = req.body; // Role can be 'Admin', 'Student', 'Volunteer', etc.

  if (!['Admin', 'Student', 'Volunteer'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role' });
  }

  try {
    await pool.query('UPDATE users SET role = ? WHERE id = ?', [role, userId]);

    res.json({ status: 'success', message: 'Role updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
});

module.exports = router;
