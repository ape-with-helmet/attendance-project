const express = require('express');
const router = express.Router();
const pool = require('../models/db');  // Assuming you have a database connection set up
const authenticate = require('../middlewares/authenticate'); // JWT authentication middleware
const authorize = require('../middlewares/authorize'); // Role-based access control middleware
const moment = require('moment'); // For handling dates and times

// Get the list of companies with upcoming drives (only accessible by authenticated users)
router.get('/companies', async (req, res) => {
    try {
      // SQL query to fetch companies with drives after the current date, including company name, ordered by driveDate
      const [drives] = await pool.query(
        `SELECT companies.name AS company_name, drives.*
         FROM drives
         JOIN companies ON drives.company_id = companies.id
         WHERE drive_date >= ?
         ORDER BY drive_date ASC`,
        [moment().format('YYYY-MM-DD')]
      );
      // console.log(drives)
      res.json(drives);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to load companies' });
    }
  });
  

// Fetch registered drives for the authenticated user
router.get('/registered-drives', authenticate, async (req, res) => {
  try {
    // SQL query to fetch registered drives with company name and job role for the authenticated user
    const [registeredDrives] = await pool.query(
      `SELECT ad.*, d.*, c.name AS company_name, d.job_role
       FROM applied_drives ad
       INNER JOIN drives d ON ad.drive_id = d.id
       INNER JOIN companies c ON d.company_id = c.id
       WHERE ad.user_id = ? AND d.drive_date >= ?
       ORDER BY d.drive_date ASC`,
      [req.user.id, moment().format('YYYY-MM-DD')]
    );

    res.json(registeredDrives);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch registered drives' });
  }
});


module.exports = router;
