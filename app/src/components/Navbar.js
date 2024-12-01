import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext'; // Assuming you are using the AuthContext for user state
import '../StyleSheets/Navbar.css'; // Styling file
import "react-toastify/dist/ReactToastify.css";
import {toast} from 'react-toastify'

const Navbar = () => {
  const { user } = useContext(AuthContext); // Get the current user from context
  // console.log(user.role)
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove the token from localStorage
    toast("Logged Out");
    navigate('/login'); // Redirect to login page
  };

  // Role-based navigation links
  const renderLinks = () => {
    if (user) {
      // console.log(user)
      if (user.role === 'Student') {
        // Student can only see the logout link
        return (
          <div className="navbar-links">
            <Link to="/profile">Profile</Link>
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        );
      } else if (user.role === 'Volunteer') {
        // Volunteer sees QR Scanner and logout
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
        // Admin sees all the links
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
      // If no user is logged in (i.e., no token), just show the login link
      return (
        <div className="navbar-links">
          <Link to="/login">Login</Link>
        </div>
      );
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to={user ? "/" : "/login"}>Sahyadri Placements</Link>
      </div>
      {renderLinks()} {/* Render links based on the user role */}
    </nav>
  );
};

export default Navbar;
