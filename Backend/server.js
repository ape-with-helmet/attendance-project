const express = require('express');
const app = express();
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const googleAuthRoutes = require('./routes/google-auth');
const profileRoutes = require('./routes/profile');
const roleRoutes = require('./routes/role-assignment');
const companyRoutes = require('./routes/company-registration');
const logoutRoutes = require('./routes/logout');

dotenv.config();

app.use(express.json()); // Parse JSON request bodies
app.use('/auth', authRoutes);
app.use('/google-auth', googleAuthRoutes);
app.use('/profile', profileRoutes);
app.use('/role', roleRoutes);
app.use('/company', companyRoutes);
app.use('/logout', logoutRoutes);

// Set the server to listen on a given port
app.listen(process.env.PORT || 5000, () => {
  console.log('Server running on port 5000');
});
