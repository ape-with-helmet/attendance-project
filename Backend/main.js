const express = require('express');
const mysql = require('mysql2/promise');  // Use the promise version of mysql2
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());

// MySQL Connection Pool
const pool = mysql.createPool({
  host: 'mysql-3cbd064c-dbms-min-proj.h.aivencloud.com',
  user: 'avnadmin',
  password: 'AVNS_r5D5rKWPICdlwpEKXRN',
  port: 28723,
  database: 'placements'
});

// Mark Attendance Endpoint
app.post('/mark-attendance', async (req, res) => {
  const data = req.body.data;
  // console.log(data);

  const [c_name, usn] = data.split('|').map((str) => str.trim());
  if (!c_name || !usn) {
    return res.status(400).json({ status: 'error', message: 'Missing c_name or usn' });
  }

  try {
    // Get a connection from the pool
    const conn = await pool.getConnection();
    // console.log(usn);

    // Check if student exists
    const rows = await conn.query('SELECT * FROM students WHERE usn = ?', [usn]);
    if (!rows) {
      conn.release();  // Always release the connection after use
      return res.status(404).json({ status: 'error', message: 'Student not found' });
    }
    // console.log("Waiting2",usn,c_name);

    // Insert attendance
    await conn.query(
      'INSERT INTO attendance (c_name, usn, date) VALUES (?, ?, NOW())',
      [c_name, usn]
    );
    // console.log("Waiting3");

    conn.release();  // Release connection back to pool\
    // console.log("wAITING4")
    return res.json({ status: 'success', message: 'Attendance marked successfully', data: rows });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: 'error', message: 'Database error' });
  }
});

app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
