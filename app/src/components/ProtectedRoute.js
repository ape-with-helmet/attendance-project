import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);

  // While loading, render nothing or a loading spinner
  if (loading) return <div>Loading...</div>;

  // If no user is logged in, redirect to login
  if (!user) return <Navigate to="/login" />;

  // If the user's role is not allowed, redirect to home
  if (!allowedRoles.includes(user.role)) {
    alert('Unauthorized Actions!');
    return <Navigate to="/" />;
  }

  // Render protected component if user is valid and authorized
  return children;
};

export default ProtectedRoute;
