import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useContext(AuthContext);
  // console.log(allowedRoles,user.role)
  // If the user is not logged in, redirect to login page
  if (!user) return <Navigate to="/login" />;

  // If the user's role is not allowed, redirect to home page
  if (!allowedRoles.includes(user.role)) return <Navigate to="/" />;

  // If the user is allowed, render the children (protected component)
  return children;
};

export default ProtectedRoute;
