import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';  // You can create this file for styling the navbar

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/home">Company Drives</Link>
      </div>
      <div className="navbar-links">
        <Link to="/home">Home</Link>
        <Link to="/login">Login</Link>
        <Link to="/signup">Signup</Link>
        <Link to="/qr-scanner">QR Scanner</Link> {/* Link to QR Code Scanner */}
        <Link to="/admin">Admin</Link>
      </div>
    </nav>
  );
};

export default Navbar;
