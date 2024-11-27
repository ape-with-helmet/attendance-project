import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import QRCodeScanner from './Pages/QrCode';
import Navbar from './components/Navbar';
import HomePage from './Pages/HomePage';
import LoginPage from './Pages/LoginPage';
import SignupPage from './Pages/SignupPage';
import AdminPage from './Pages/AdminPage';
import { AuthProvider } from './context/AuthContext'; // Import AuthProvider
import ProtectedRoute from './components/ProtectedRoute'; // Import the refactored ProtectedRoute

const AppContent = () => {
  const location = useLocation();
  const hideNavbar = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        
        {/* Home route accessible by all roles */}
        <Route path="/home" element={<HomePage />} />
        
        {/* Admin route accessible only by 'admin' */}
        <Route path="/admin" element={<ProtectedRoute allowedRoles={['Admin']}><AdminPage /></ProtectedRoute>} />
        
        {/* Scanner route accessible only by 'student' */}
        <Route path="/scanner" element={<ProtectedRoute allowedRoles={['Student']}><QRCodeScanner /></ProtectedRoute>} />
        
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <AuthProvider> {/* Wrap the app with AuthProvider */}
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
