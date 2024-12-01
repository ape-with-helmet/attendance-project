const express = require('express');
const router = express.Router();
const pool = require('../models/db');  // Assuming you have a database connection set up
const authenticate = require('../middlewares/authenticate'); // JWT authentication middleware
const authorize = require('../middlewares/authorize'); // Role-based access control middleware
const ExcelJS = require('exceljs');

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
    const [students] = await pool.query('SELECT * FROM users ');
    res.json(students);
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', message: 'Error fetching students' });
  }
});

// Get the list of drives (only accessible by admins)
router.get('/drives', authenticate, authorize(['Admin']), async (req, res) => {
  try {
    const [drives] = await pool.query('SELECT d.id, c.name, d.drive_date FROM drives d, companies c where d.company_id = c.id'); // Assuming you have a 'drives' table
    res.json(drives);
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', message: 'Error fetching drives' });
  }
});

router.post('/attendance/download', authenticate, authorize(['Admin']), async (req, res) => {
  const { driveId, driveName } = req.body;
  if (!driveId) {
    return res.status(400).json({ status: 'error', message: 'Drive id is required' });
  }
  try {
    // Fetch student data for the drive
    const [attendanceData] = await pool.query(
      `SELECT 
        u.name, u.email, u.phone_number, u.usn, u.cgpa, 
        ad.attendance
      FROM applied_drives ad
      INNER JOIN users u ON ad.user_id = u.id
      WHERE ad.drive_id = ?`,
      [driveId]
    );

    if (attendanceData.length === 0) {
      return res.status(404).json({ status: 'error', message: 'No data found for the selected drive' });
    }

    // Create an Excel workbook and sheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Attendance');

    // Add headers
    worksheet.columns = [
      { header: 'Name', key: 'name', width: 20 },
      { header: 'Email', key: 'email', width: 25 },
      { header: 'Phone', key: 'phone_number', width: 15 },
      { header: 'USN', key: 'usn', width: 15 },
      { header: 'CGPA', key: 'cgpa', width: 10 },
      { header: 'Attendance', key: 'attendance', width: 15 }
    ];

    // Add data to the sheet
    attendanceData.forEach((record) => {
      worksheet.addRow(record);
    });
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );

    // Write the workbook to the response
    await workbook.xlsx.write(res);
    res.end(); // Allow the file to finish sending before ending the response
  } catch (err) {
    console.error('Error generating Excel:', err);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
});


module.exports = router;
