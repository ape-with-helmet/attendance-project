import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext'; // Assuming you are using the AuthContext for user state
import '../StyleSheets/Navbar.css'; // Styling file
import "react-toastify/dist/ReactToastify.css";
import { toast } from 'react-toastify';

const Navbar = () => {
  const { user } = useContext(AuthContext); // Get the current user from context
  const navigate = useNavigate();

  // State for toggling the navbar visibility on mobile
  const [isNavbarVisible, setNavbarVisible] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove the token from localStorage
    toast("Logged Out");
    navigate('/login'); // Redirect to login page
  };

  // Role-based navigation links
  const renderLinks = () => {
    if (user) {
      if (user.role === 'Student') {
        return (
          <div className="navbar-links">
            <Link to="/profile">Profile</Link>
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        );
      } else if (user.role === 'Volunteer') {
        return (
          <div className="navbar-links">
            <Link to="/profile">Profile</Link>
            <Link to="/scanner">QR Scanner</Link>
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        );
      } else if (user.role === 'Admin') {
        return (
          <div className="navbar-links">
            <Link to="/profile">Profile</Link>
            <Link to="/scanner">QR Scanner</Link>
            <Link to="/admin">Admin</Link>
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        );
      }
    } else {
      return (
        <div className="navbar-links">
          <Link to="/login">Login</Link>
        </div>
      );
    }
  };

  // Toggle the navbar visibility
  const toggleNavbar = () => {
    setNavbarVisible(!isNavbarVisible);
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to={user ? "/" : "/login"}>Sahyadri Placements</Link>
      </div>

      {/* Hamburger icon for mobile */}
      <button className="navbar-toggle-button" onClick={toggleNavbar}>
        &#9776; {/* Hamburger icon */}
      </button>

      {/* Navbar links that toggle visibility on mobile */}
      <div className={`navbar-dos ${isNavbarVisible ? '' : 'hide'}`}>
        {renderLinks()} {/* Render links based on the user role */}
      </div>
    </nav>
  );
};

export default Navbar;
