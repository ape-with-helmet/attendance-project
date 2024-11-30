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
import Profile from './Pages/ProfilePage';
import ForgotPasswordPage from './Pages/ForgotPassword';  // Import ForgotPasswordPage
import ResetPasswordPage from './Pages/ResetPassword';  // Import ResetPasswordPage
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AppContent = () => {
  const location = useLocation();
  const hideNavbar = location.pathname === '/login' || location.pathname === '/signup' || location.pathname === '/forgot-password' || location.pathname === '/reset-password';

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        {/* Home route accessible by all roles */}
        <Route path="/" element={<ProtectedRoute allowedRoles={['Student', 'Admin', 'Volunteer']}><HomePage /></ProtectedRoute>} />
        
        {/* Admin route accessible only by 'admin' */}
        <Route path="/admin" element={<ProtectedRoute allowedRoles={['Admin']}><AdminPage /></ProtectedRoute>} />
        
        {/* Scanner route accessible only by 'student' */}
        <Route path="/scanner" element={<ProtectedRoute allowedRoles={['Volunteer', 'Admin']}><QRCodeScanner /></ProtectedRoute>} />
        
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/profile" element={<ProtectedRoute allowedRoles={['Student', 'Admin', 'Volunteer']}><Profile /></ProtectedRoute>} />
        
        {/* Forgot Password Route */}
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        
        {/* Reset Password Route */}
        <Route path="/reset-password" element={<ResetPasswordPage />} />
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
      <ToastContainer/>
    </AuthProvider>
  );
};

export default App;
