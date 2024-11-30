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
      res.json(drives);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to load companies' });
    }
  });
  

// Fetch registered drives for the authenticated user
router.get('/registered-drives', authenticate, async (req, res) => {
    try {
      // SQL query to fetch registered drives with company name for the authenticated user
      const [registeredDrives] = await pool.query(
        `SELECT ad.*, d.*, c.name AS company_name
         FROM applied_drives ad
         INNER JOIN drives d ON ad.drive_id = d.id
         INNER JOIN companies c ON d.company_id = c.id
         WHERE ad.user_id = ?`,
        [req.user.id]
      );
  
      res.json(registeredDrives);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to fetch registered drives' });
    }
  });
  

// Register for a drive
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
  
      res.status(200).json({ message: 'Successfully registered for the drive' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to register for the drive' });
    }
  });
  

module.exports = router;
