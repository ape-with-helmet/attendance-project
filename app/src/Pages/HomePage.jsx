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
  const [onlyInfoBool, setOnlyInfoBool] = useState(null)
  const [isRegistering,setIsRegistering] = useState(false)
  const [selectedDrive, setSelectedDrive] = useState(null); // Track selected drive for the modal
  const [showModal, setShowModal] = useState(false); // Track modal visibility

  const openModal = (drive,val) => {
    setOnlyInfoBool(val)
    setSelectedDrive(drive);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedDrive(null);
    setOnlyInfoBool(null);
    setShowModal(false);
  };

  const fetchCompanies = async () => {
    const loadingToast = toast.loading('Loading companies and upcoming drives...'); // Show loading toast

    try {
      const response = await axios.get('https://attendance-project-eibp.onrender.com/home/companies');
      const today = new Date();
      // Filter out past drives and sort by upcoming dates
      const filteredCompanies = response.data;
      console.log(filteredCompanies)

      filteredCompanies.sort((a, b) => new Date(a.driveDate) - new Date(b.driveDate)); // Sort by date
      // console.log('Companies', companies);

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
        const response = await axios.get('https://attendance-project-eibp.onrender.com/home/registered-drives', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const filteredDrives = response.data
        filteredDrives.sort((a, b) => new Date(a.driveDate) - new Date(b.driveDate)); // Sort by date
        setRegisteredDrives(filteredDrives);
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
    // console.log(driveId)
    const token = localStorage.getItem('token');
    if (!token) {
      toast.info('You must be logged in to register for a drive');
      return;
    }
    setIsRegistering(true)
    const loadingRegisterToast = toast.loading("Registration in Process...")
    try {
      const response = await axios.post(
        'https://attendance-project-eibp.onrender.com/qr/register',
        { driveId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.update(loadingRegisterToast, {
        render: response.data.message,
        type: 'success',
        isLoading: false,
        autoClose: 3000,
      });
      setIsRegistering(false)
      // Optionally fetch updated registered drives
      fetchRegisteredDrives();
    } catch (err) {
      console.log(err.response.data.message)
      toast.update(loadingRegisterToast, {
        render: err.response.data.message,
        type: 'error',
        isLoading: false,
        autoClose: 3000,
      });
      setIsRegistering(false)
    }
  };

  return (
    <div className="homepage">
      <div className="company-list">
        <h2>Upcoming Drives</h2>
        {/* Row 1: Upcoming Drives */}
        <div className="drive-section">
          <div className="company-cards horizontal-scroll">
            {companies.length > 0 ? (
              companies.map((company) => (
                <div key={company.id} className="company-card" onClick={() => openModal(company,false)}>
                  <h4>{company.company_name}</h4>
                  <p>Role: {company.job_role}</p>
                  <p>Drive Date: {new Date(company.drive_date).toLocaleDateString()}</p>
                </div>
              ))
            ) : (
              <p>No upcoming drives found.</p>
            )}
          </div>
        </div>

        {/* Row 2: Registered Drives */}
        <h2>My Registered Drives</h2>
        <div className="drive-section">
          <div className="company-cards">
            {registeredDrives.length > 0 ? (
              registeredDrives.map((drive) => (
                <div key={drive.id} className="company-card" onClick={() => openModal(drive,true)}>
                  <h4>{drive.company_name}</h4>
                  <p>{drive.job_role}</p>
                  <p>Drive Date: {new Date(drive.drive_date).toLocaleDateString()}</p>
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
            <div className="close-animation" onClick={closeModal}>×</div>
            <h3>{selectedDrive.company_name}</h3>
            <p>Drive Date: {new Date(selectedDrive.drive_date).toLocaleDateString()}</p>
            <p>Job Role: {selectedDrive.job_role}</p>
            <p>CTC: {selectedDrive.ctc}LPA</p>
            <p
              dangerouslySetInnerHTML={{
                __html: selectedDrive.requirements.replace(/\. /g, '.<br />'),
              }}
              className="Job_desc_paragraph"></p>
            <p>Cut off: {selectedDrive.cutoff}</p>
            <button 
            onClick={() => handleRegister(selectedDrive.id)}
            disabled={isRegistering}
            hidden={onlyInfoBool}
            >
              Register for this Drive
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Homepage;