const express = require('express');
const router = express.Router();
const pool = require('../db'); // assuming your database connection is set up
const authenticate = require('../middleware/authenticate'); // JWT middleware
const authorize = require('../middleware/authorize'); // Role-based access control middleware

// Admin add company
router.post('/add-company', authenticate, authorize(['Admin']), async (req, res) => {
  const { companyName, ctc, jobRole, requirements } = req.body;

  try {
    await pool.query('INSERT INTO companies (companyName, ctc, jobRole, requirements) VALUES (?, ?, ?, ?)', [companyName, ctc, jobRole, requirements]);

    res.json({ status: 'success', message: 'Company added successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
});

module.exports = router;
