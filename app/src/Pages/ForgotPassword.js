import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "react-toastify/dist/ReactToastify.css";
import {toast} from 'react-toastify'
import '../StyleSheets/main.css'
import Introduction from '../components/Introduction';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email){
      return toast.warn("Enter email!")
    }
    try {

      const response = await axios.post('https://attendance-project-eibp.onrender.com/auth/forgot-password', { email });
      toast(response.data.message);
    } catch (err) {
      toast.error(err.response.data.message);
    }
  };

  return (
    <div className='reset_container'>
      <Introduction/>
      <div className='reset_content'>
        <h1>Forgot Password</h1>
        <form onSubmit={handleSubmit} className='reset_form'>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            // required
            placeholder='Email ID'
            className='reset_input'
          />
          <button type="submit" className='reset_button'>Send Reset Link</button>
        </form>
        <div>
          <button onClick={()=>navigate('/login')} className='redirect_link'>Login Instead?</button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
