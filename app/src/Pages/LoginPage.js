import React, { useState,useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "react-toastify/dist/ReactToastify.css";
import {toast} from 'react-toastify'
import '../StyleSheets/main.css'
import Introduction from '../components/Introduction';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const history = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email||!password) {
      toast.warn("Please enter all fields")
      return
    }
    const loadingToast = toast.loading('Logging you in... This can take some time');
    try {
      const response = await axios.post('https://attendance-project-eibp.onrender.com/auth/login', { email, password });
      if (response.data.status === 'success' && response.data.token) {
        // Save JWT token to localStorage
        localStorage.setItem('token', response.data.token);
        if (response.data.status === 'success' && response.data.token) {
          // Save JWT token to localStorage
          localStorage.setItem('token', response.data.token);
        
          // Notify AuthContext about the new login
          window.dispatchEvent(new Event('storage'));
          toast.update(loadingToast, {
            render: 'Logged in successfully!',
            type: 'success',
            isLoading: false,
            autoClose: 3000,
          });
          window.location.href = '/';
        }
      } else {
        console.log('Login failed:', response.data.message);
      }
    } catch (error) {
      toast.update(loadingToast, {
        render: 'Login Failed!',
        type: 'error',
        isLoading: false,
        autoClose: 3000,
      });
      console.error('Login failed:', error);
    }
  };

  return (
    <div className='reset_container'>
      <Introduction/>
      <div className='reset_content'>
        <h1>Login</h1>
        <form onSubmit={handleLogin} className='reset_form'>
          <input 
            type="email" 
            placeholder="Email" 
            required
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            className='reset_input'
          />
          <input 
            type="password" 
            className='reset_input'
            required
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
          />
          <button type="submit" className='reset_button'>Login</button>
        </form>
        <div>
          <button onClick={() => history('/signup')} className='redirect_link'>Don't have an account?</button>
        </div>
        <div>
          <button onClick={() => history('/forgot-password')}className='redirect_link'>Forgot Password?</button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
