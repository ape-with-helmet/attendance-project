import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const location = useLocation();
  const history = useNavigate();

  // Extract token from URL
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");

  useEffect(() => {
    // Check if the token exists in the URL
    if (!token) {
      setError("Invalid or expired link.");
    }
  }, [token]);

  const handlePasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send the reset request to backend
      const response = await axios.post("http://localhost:5000/auth/reset-password", {
        token,
        newPassword,
      });
      console.log(response)
      setSuccess("Your password has been reset successfully!");
      history("/login"); // Redirect user to login page after success
    } catch (err) {
      alert(err.response.data.message)
      setError("Failed to reset password. Please try again.");
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <h1>Reset Your Password</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "10px" }}>
          <label>
            New Password:
            <input
              type="password"
              value={newPassword}
              onChange={handlePasswordChange}
              required
            />
          </label>
        </div>
        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
};

export default ResetPassword;
