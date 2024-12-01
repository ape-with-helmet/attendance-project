import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../StyleSheets/homepage.css'
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const Homepage = () => {
  const [companies, setCompanies] = useState([]);
  const [registeredDrives, setRegisteredDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDrive, setSelectedDrive] = useState(null); // Track selected drive for the modal
  const [showModal, setShowModal] = useState(false); // Track modal visibility

  const openModal = (drive) => {
    setSelectedDrive(drive);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedDrive(null);
    setShowModal(false);
  };

  console.log('Entered the Home page section');

  const fetchCompanies = async () => {
    const loadingToast = toast.loading('Loading companies and upcoming drives...'); // Show loading toast

    try {
      const response = await axios.get('http://localhost:5000/home/companies');
      const today = new Date();
      // Filter out past drives and sort by upcoming dates
      const filteredCompanies = response.data;

      filteredCompanies.sort((a, b) => new Date(a.driveDate) - new Date(b.driveDate)); // Sort by date
      console.log('Companies', companies);

      setCompanies(filteredCompanies);
      toast.update(loadingToast, {
        render: 'Companies loaded successfully!',
        type: 'success',
        isLoading: false,
        autoClose: 3000,
      }); // Update toast with success message
    } catch (err) {
      toast.update(loadingToast, {
        render: 'Failed to load companies',
        type: 'error',
        isLoading: false,
        autoClose: 3000,
      }); // Update toast with error message
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
        toast.error('User not authenticated');
      }
    } catch (err) {
      toast.error('Failed to fetch registered drives');
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
      toast.info('You must be logged in to register for a drive');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:5000/qr/register',
        { driveId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success(response.data.message)
      // Optionally fetch updated registered drives
      fetchRegisteredDrives();
    } catch (err) {
      toast.error('Failed to register for the drive');
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
                  <button onClick={() => openModal(company)}>Know More</button>
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

      {/* Modal */}
      {showModal && selectedDrive && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{selectedDrive.company_name}</h3>
            <p>Drive Date: {new Date(selectedDrive.drive_date).toLocaleDateString()}</p>
            <p>Job Role: {selectedDrive.job_role}</p>
            <p>CTC: {selectedDrive.ctc}LPA</p>
            <p>Requirements: {selectedDrive.requirements}</p>
            <p>Cut off: {selectedDrive.cutoff}</p>
            <button onClick={() => handleRegister(selectedDrive.company_id)}>
              Register for this Drive
            </button>
            <button onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Homepage;