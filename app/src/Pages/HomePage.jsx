import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Homepage = () => {
  const [companies, setCompanies] = useState([]);
  const [companyData, setCompanyData] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axios.get('http://localhost:5000/companies');
        setCompanies(response.data);
      } catch (err) {
        setError('Failed to load companies');
      }
    };
    fetchCompanies();
  }, []);

  return (
    <div className="homepage">
      <nav>
        <Link to="/admin">Admin Panel</Link>
        <Link to="/qrcode">QR Code Scanner</Link>
      </nav>

      <h2>Registered Companies</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div className="company-list">
        {companies.map((company) => (
          <div key={company.id} className="company-card">
            <h3>{company.name}</h3>
            <p>{company.details}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Homepage;
