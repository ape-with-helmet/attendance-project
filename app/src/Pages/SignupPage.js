import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
    console.log("HELLOOOOO")
    try {
      const response = await axios.post('http://localhost:5000/auth/signup', {
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
        
        // Redirect to home page or dashboard
        history('/home');
      } else {
        console.log('Signup failed:', response.data.message);
      }
    } catch (error) {
      console.error('Signup failed:', error);
    }
  };

  return (
    <div>
      <h2>Signup</h2>
      <form onSubmit={handleSignup}>
        <input 
          type="text" 
          placeholder="Name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
        />
        <input 
          type="text" 
          placeholder="USN" 
          value={usn} 
          onChange={(e) => setUsn(e.target.value)} 
        />
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
        />
        <input 
          type="text" 
          placeholder="Phone Number" 
          value={phone_number} 
          onChange={(e) => setPhoneNumber(e.target.value)} 
        />
        <input 
          type="text" 
          placeholder="CGPA" 
          value={cgpa} 
          onChange={(e) => setCgpa(e.target.value)} 
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
        />
        <button type="submit">Signup</button>
      </form>
      <div>
        <p>Already have an account? <button onClick={() => history('/login')}>Login</button></p>
      </div>
    </div>
  );
};

export default SignupPage;
