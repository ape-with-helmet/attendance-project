const express = require('express');
const router = express.Router();

// Logout route
router.post('/logout', (req, res) => {
  // Remove token from client-side (clear cookies or localStorage)
  res.json({ status: 'success', message: 'Logged out successfully' });
});

module.exports = router;
