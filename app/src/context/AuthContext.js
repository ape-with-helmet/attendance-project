import React, { createContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastActivity, setLastActivity] = useState(Date.now()); // Track user activity
  const TOKEN_REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes
  const TOKEN_EXPIRATION_THRESHOLD = 2 * 60 * 1000; // Refresh token 2 minutes before expiry

  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          const timeUntilExpiry = payload.exp * 1000 - Date.now();

          if (timeUntilExpiry > 0) {
            setUser({ ...payload, token });
            if (timeUntilExpiry <= TOKEN_EXPIRATION_THRESHOLD) {
              refreshAuthToken(token); // Refresh the token if close to expiration
            }
          } else {
            logout(); // Log out if expired
          }
        } catch (err) {
          console.error("Failed to decode token:", err);
          logout();
        }
      } else {
        logout(); // No token found
      }
      setLoading(false);
    };

    const refreshAuthToken = async (token) => {
      try {
        const response = await fetch("/auth/refresh-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });
        if (response.ok) {
          const { newToken } = await response.json();
          login(newToken); // Update the token
        } else {
          console.error("Token refresh failed");
          logout(); // Log out if refresh fails
        }
      } catch (error) {
        console.error("Error refreshing token:", error);
        logout();
      }
    };

    const handleActivity = () => {
      setLastActivity(Date.now());
    };

    // Check token on load
    checkToken();

    // Listen for user activity
    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("keydown", handleActivity);

    // Refresh token periodically if user is active
    const refreshInterval = setInterval(() => {
      const token = localStorage.getItem("token");
      if (token && Date.now() - lastActivity < TOKEN_REFRESH_INTERVAL) {
        refreshAuthToken(token); // Refresh token
      }
    }, TOKEN_REFRESH_INTERVAL);

    // Cleanup event listeners and interval
    return () => {
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      clearInterval(refreshInterval);
    };
  }, [lastActivity]);

  const login = (token) => {
    const payload = JSON.parse(atob(token.split(".")[1]));
    setUser({ ...payload, token });
    localStorage.setItem("token", token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
