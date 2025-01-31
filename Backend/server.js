const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const adminRoutes = require('./routes/adminRoutes');
const companyRoutes = require('./routes/company-registration');
const homepageRoutes = require('./routes/homepageRoutes');
const qrRoutes = require('./routes/qrRoute')

dotenv.config();

const app = express();

// Enable CORS for your frontend
app.use(cors({
  origin: ['https://attendance-project-one.vercel.app','http://localhost:3000'], // Allow requests from your frontend origin
  methods: 'GET, POST, PUT, DELETE', // Allow these HTTP methods
  allowedHeaders: 'Content-Type, Authorization', // Allow these headers in requests
}));

app.use(express.json()); // Parse JSON request bodies

// Use routes
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);
app.use('/role', adminRoutes);
app.use('/company', companyRoutes);
app.use('/home', homepageRoutes);
app.use('/qr', qrRoutes);

// Set the server to listen on a given port
app.listen(process.env.PORT || 5000, () => {
  console.log('Server running on port 5000');
});
