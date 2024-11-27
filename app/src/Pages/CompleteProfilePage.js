import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const CompleteProfilePage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    usn: '',
    cgpa: '',
  });
  const [error, setError] = useState('');
  const history = useHistory();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/auth/complete-profile', formData);
      if (res.data.status === 'success') {
        history.push('/home');
      }
    } catch (err) {
      setError('Error completing profile');
    }
  };

  return (
    <div>
      <h2>Complete Your Profile</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleInputChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="usn"
          placeholder="USN"
          value={formData.usn}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="cgpa"
          placeholder="CGPA"
          value={formData.cgpa}
          onChange={handleInputChange}
        />
        <button type="submit">Submit</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default CompleteProfilePage;
