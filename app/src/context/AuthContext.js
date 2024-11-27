import React, { createContext, useState, useEffect } from 'react';

// Create the authentication context
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if a token exists in localStorage on initial load
    const token = localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUser({ ...payload, token }); // Set user state with token and payload
    }
  }, []); // Run once when the component mounts

  const login = (token) => {
    const payload = JSON.parse(atob(token.split('.')[1])); // Decode the token
    setUser({ ...payload, token }); // Set user state with decoded payload and token
    localStorage.setItem('token', token); // Store token in localStorage
  };

  const logout = () => {
    setUser(null); // Clear user state
    localStorage.removeItem('token'); // Remove token from localStorage
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
