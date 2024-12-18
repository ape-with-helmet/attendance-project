const express = require('express');
const router = express.Router();
const pool = require('../models/db');  // Assuming your database connection is set up
const authenticate = require('../middlewares/authenticate'); // JWT middleware
const authorize = require('../middlewares/authorize'); // Role-based access control middleware

// Admin add company and create a drive (only if company doesn't exist)
router.post('/add-company-drive', authenticate, authorize(['Admin']), async (req, res) => {
  const { companyName, ctc, jobRole, cutoff, driveDate, requirements } = req.body;

  try {
    // Trim any leading or trailing white spaces from input values
    const trimmedCompanyName = companyName.trim();
    const trimmedCtc = ctc.trim();
    const trimmedJobRole = jobRole.trim();
    const trimmedCutoff = cutoff.trim();
    const trimmedDriveDate = driveDate.trim();
    const trimmedRequirements = requirements.trim();

    // Start a transaction to ensure atomicity
    await pool.query('START TRANSACTION');

    // Check if the company already exists
    const [companyRows] = await pool.query('SELECT * FROM companies WHERE name = ?', [trimmedCompanyName]);

    let companyId;

    if (companyRows.length > 0) {
      // Company exists, use the existing company's ID
      companyId = companyRows[0].id;
    } else {
      // Company does not exist, create a new company
      const [companyResult] = await pool.query('INSERT INTO companies (name) VALUES (?)', [trimmedCompanyName]);
      companyId = companyResult.insertId; // Get the inserted company's ID
    }

    // Insert the drive associated with the company
    await pool.query(
      'INSERT INTO drives (company_id, job_role, ctc, cutoff, drive_date, requirements) VALUES (?, ?, ?, ?, ?, ?)',
      [companyId, trimmedJobRole, trimmedCtc, trimmedCutoff, trimmedDriveDate, trimmedRequirements]
    );

    // Commit the transaction
    await pool.query('COMMIT');

    res.json({ status: 'success', message: 'Company and drive added successfully' });
  } catch (err) {
    // Rollback transaction in case of error
    await pool.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
});


module.exports = router;
