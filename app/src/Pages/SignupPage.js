import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "react-toastify/dist/ReactToastify.css";
import {toast} from 'react-toastify'
import Introduction from '../components/Introduction';

const SignupPage = () => {
  const [name, setName] = useState('');
  const [usn, setUsn] = useState('');
  const [email, setEmail] = useState('');
  const [phone_number, setPhoneNumber] = useState('');
  const [cgpa, setCgpa] = useState('');
  const [password, setPassword] = useState('');
  const history = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!name||!usn||!email||!phone_number||!cgpa||!password) {
      toast.warn("Please enter all fields")
      return
    }
    try {
      const response = await axios.post('https://attendance-project-eibp.onrender.com/auth/signup', {
        name,
        usn,
        email,
        phone_number,
        cgpa,
        password,
      });

      if (response.data.status === 'success' && response.data.token) {
        // Store JWT in localStorage
        localStorage.setItem('token', response.data.token);
        toast.success("Successfully Signed in!")
        // Redirect to home page or dashboard
        history('/home');
      } else {
        toast.error("Sign up failed!")
      }
    } catch (error) {
      toast.error("Sign up failed!")
    }
  };

  return (
    <div className='reset_container'>
      <Introduction/>
      <div className='reset_content'>
        <h1>Signup</h1>
        <form onSubmit={handleSignup} className='reset_form'>
          <input 
            type="text" 
            placeholder="Name" 
            value={name} 
            required
            className='reset_input'
            onChange={(e) => setName(e.target.value)} 
          />
          <input 
            type="text" 
            className='reset_input'
            placeholder="USN" 
            required
            value={usn} 
            onChange={(e) => setUsn(e.target.value)} 
          />
          <input 
            type="email" 
            className='reset_input'
            required
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
          />
          <input 
            type="text" 
            placeholder="Phone Number" 
            required
            className='reset_input'
            value={phone_number} 
            onChange={(e) => setPhoneNumber(e.target.value)} 
          />
          <input 
            required
            type="text" 
            placeholder="CGPA" 
            className='reset_input'
            value={cgpa} 
            onChange={(e) => setCgpa(e.target.value)} 
          />
          <input 
            type="password" 
            placeholder="Password" 
            required
            className='reset_input'
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
          />
          <button type="submit" className='reset_button'>Signup</button>
        </form>
        <div>
          <button onClick={() => history('/login')} className='redirect_link'>Already have an account?</button>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
