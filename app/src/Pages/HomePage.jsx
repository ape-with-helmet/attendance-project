import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Homepage = () => {
  const [companies, setCompanies] = useState([]);
  const [registeredDrives, setRegisteredDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const fetchCompanies = async () => {
    try {
      const response = await axios.get('http://localhost:5000/home/companies');
      const today = new Date();
      // Filter out past drives and sort by upcoming dates
      const filteredCompanies = response.data;
      
      filteredCompanies.sort((a, b) => new Date(a.driveDate) - new Date(b.driveDate)); // Sort by date
      console.log(companies)

      setCompanies(filteredCompanies);
    } catch (err) {
      console.log('Failed to load companies');
    } finally {
      setLoading(false);
    }
  };

  const fetchRegisteredDrives = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await axios.get('http://localhost:5000/home/registered-drives', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRegisteredDrives(response.data);
      } else {
        console.log('User not authenticated');
      }
    } catch (err) {
      console.log('Failed to fetch registered drives');
    }
  };
  useEffect(() => {
    fetchCompanies();
    fetchRegisteredDrives();
  }, []);

  // Handle registration for a drive
  const handleRegister = async (driveId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('You must be logged in to register for a drive');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:5000/home/register',
        { driveId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert(response.data.message)
      // Optionally fetch updated registered drives
      fetchRegisteredDrives();
    } catch (err) {
      console.log('Failed to register for the drive');
    }
  };

  if (loading) return <p>Loading drives...</p>;

  return (
    <div className="homepage">
      <h2>Upcoming Drives</h2>
      <div className="company-list">
        {/* Row 1: Upcoming Drives */}
        <div className="drive-section">
          <h3>Upcoming Drives</h3>
          <div className="company-cards">
            {companies.length > 0 ? (
              companies.map((company) => (
                <div key={company.company_id} className="company-card">
                  <h4>{company.company_name}</h4>
                  <p>Drive Date: {new Date(company.drive_date).toLocaleDateString()}</p>
                  <p>Job Role: {company.job_role}</p>
                  <p>CTC: {company.ctc}LPA</p>
                  <p>Requirements: {company.requirements}</p>
                  <p>Cut off: {company.cutoff}</p>
                  <button onClick={() => handleRegister(company.id)}>Register for this Drive</button>
                </div>
              ))
            ) : (
              <p>No upcoming drives found.</p>
            )}
          </div>
        </div>

        {/* Row 2: Registered Drives */}
        <div className="drive-section">
          <h3>My Registered Drives</h3>
          <div className="company-cards">
            {registeredDrives.length > 0 ? (
              registeredDrives.map((drive) => (
                <div key={drive.id} className="company-card">
                  <h4>{drive.company_name}</h4>
                  <p>Drive Date: {new Date(drive.drive_date).toLocaleDateString()}</p>
                  <p>{drive.details}</p>
                </div>
              ))
            ) : (
              <p>No registered drives found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
