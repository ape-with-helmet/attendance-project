import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css'; // Styling file

const Navbar = () => {
  const token = localStorage.getItem('token'); // Check for token in localStorage
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove the token from localStorage
    navigate('/login'); // Redirect to login page
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to={token ? "/home" : "/login"}>Sahyadri Placements</Link>
      </div>
      <div className="navbar-links">
        <Link to="/home">Home</Link>
        <Link to="/scanner">QR Scanner</Link>
        <Link to="/admin">Admin</Link>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
