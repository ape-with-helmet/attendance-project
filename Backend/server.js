const express = require('express');
const app = express();
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const adminRoutes = require('./routes/adminRoutes');
const companyRoutes = require('./routes/company-registration');
const logoutRoutes = require('./routes/logout');

dotenv.config();

app.use(express.json()); // Parse JSON request bodies
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);
app.use('/role', adminRoutes);
app.use('/company', companyRoutes);
app.use('/logout', logoutRoutes);

// Set the server to listen on a given port
app.listen(process.env.PORT || 5000, () => {
  console.log('Server running on port 5000');
});
