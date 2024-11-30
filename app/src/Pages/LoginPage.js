import React, { useState,useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const history = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/auth/login', { email, password });
      if (response.data.status === 'success' && response.data.token) {
        // Save JWT token to localStorage
        localStorage.setItem('token', response.data.token);
        if (response.data.status === 'success' && response.data.token) {
          // Save JWT token to localStorage
          localStorage.setItem('token', response.data.token);
        
          // Notify AuthContext about the new login
          window.dispatchEvent(new Event('storage'));
          alert("Logged in successfully")
          console.log(response.data, localStorage.getItem('token'));
          console.log('Navigating to Home...');
          window.location.href = '/';
        }
      } else {
        console.log('Login failed:', response.data.message);
      }
    } catch (error) {
      alert(error.response.data.message)
      console.error('Login failed:', error);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
        />
        <button type="submit">Login</button>
      </form>
      <div>
        <p>Don't have an account? <button onClick={() => history('/signup')}>Sign Up</button></p>
      </div>
      <div>
        <p>Forgot Password? <button onClick={() => history('/forgot-password')}>Reset</button></p>
      </div>
    </div>
  );
};

export default LoginPage;
