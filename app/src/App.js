import React from 'react';
import QRCodeScanner from './Pages/QrCode'; // Import QRCodeScanner from Pages
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar'; // Import Navbar
import HomePage from './Pages/HomePage'; // Import your HomePage component
import LoginPage from './Pages/LoginPage'; // Import your LoginPage component
import SignupPage from './Pages/SignupPage'; // Import your SignupPage component
import AdminPage from './Pages/AdminPage'; // Import AdminPage component

const App = () => {
  return (
    <BrowserRouter>
      <Navbar /> {/* Place Navbar at the top of all pages */}
      <Routes>
        {/* Define the route for Home page */}
        <Route path='/home' element={<HomePage />} />
        
        {/* Define the route for Login page */}
        <Route path='/login' element={<LoginPage />} />
        
        {/* Define the route for Signup page */}
        <Route path='/signup' element={<SignupPage />} />
        
        {/* Define the route for Admin page */}
        <Route path='/admin' element={<AdminPage />} />
        
        {/* Define the route for QR Code Scanner page */}
        <Route path='/Scanner' element={<QRCodeScanner />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
