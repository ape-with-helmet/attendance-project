import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import {toast} from 'react-toastify'
import Introduction from "../components/Introduction";
import '../StyleSheets/main.css'

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const location = useLocation();
  const history = useNavigate();

  // Extract token from URL
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");

  useEffect(() => {
    // Check if the token exists in the URL
    if (!token) {
      toast.error("Invalid or expired link.");
      window.location.href = '/'
    }
  }, [token]);

  const handlePasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword) {
      return toast.warn('Enter the new password')
    }
    try {
      // Send the reset request to backend
      const response = await axios.post("http://localhost:5000/auth/reset-password", {
        token,
        newPassword,
      });
      console.log(response)
      toast.success("Password Reset successfully!");
      history("/login"); // Redirect user to login page after success
    } catch (err) {
      toast.error(err.response.data.message);
    }
  };

  return (
    <>
      <div className="reset_container">
        <Introduction/>
        <div className="reset_content">
          <h1>Reset Your Password</h1>
          <form onSubmit={handleSubmit} className="reset_form">
            <input
              type="password"
              value={newPassword}
              onChange={handlePasswordChange}
              required
              placeholder="New Password"
              className="reset_input"
            />
            <button type="submit" className="reset_button">Reset Password</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
