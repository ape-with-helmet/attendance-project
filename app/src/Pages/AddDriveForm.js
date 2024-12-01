import React, { useState } from 'react';
import axios from 'axios';
import '../StyleSheets/AddDriveForm.css';
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const AddDriveForm = () => {
  const [companyName, setCompanyName] = useState('');
  const [ctc, setCtc] = useState('');
  const [requirements, setRequirements] = useState('');
  const [jobRole, setJobRole] = useState('');
  const [cutoff, setCutoff] = useState(''); // Changed from cgpaCutoff to cutoff
  const [error, setError] = useState('');
  const [driveDate, setDriveDate] = useState(''); // Ensure this is formatted as YYYY-MM-DD

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!companyName || !ctc || !requirements || !jobRole || !cutoff || !driveDate) {
      setError('All fields are required!');
      return;
    }

    const newDrive = {
      companyName,
      ctc,
      requirements,
      jobRole,
      cutoff,
      driveDate
    };

    try {
      const response = await axios.post('http://localhost:5000/company/add-company-drive', newDrive, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }  // Assuming token is stored in localStorage
      });
      if (response.status === 200) { // Expecting status 200 from the backend
        toast.success('Drive added successfully!');
        // Clear form after successful submission
        setCompanyName('');
        setCtc('');
        setDriveDate('');
        setJobRole('');
        setCutoff('');
        setRequirements('');
        setError('');
      }
    } catch (err) {
      setError('Error adding drive. Please try again.');
      console.error('Error adding drive:', err);
    }
  };

  return (
    <div className="add-drive-form">
      <h2>Add New Drive</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit} className='reset_form'>
        <div className="form-group">
          <input
            type="text"
            value={companyName}
            placeholder='Company Name'
            onChange={(e) => setCompanyName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <input
            type="text"
            placeholder='Salary Details'
            value={ctc}
            onChange={(e) => setCtc(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <textarea
            value={requirements}
            placeholder='Job Description & Requirements'
            onChange={(e) => setRequirements(e.target.value)}
            required
          ></textarea>
        </div>

        <div className="form-group">
          <input
            type="text"
            value={jobRole}
            placeholder='Job Role'
            onChange={(e) => setJobRole(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <input
            type="number"
            value={cutoff}
            placeholder='CGPA Cutoff'
            onChange={(e) => setCutoff(e.target.value)}
            required
            min="0"
            max="10"
          />
        </div>

        <div className="form-group">
          <label>Drive Date:</label>
          <input
            type="date" // Changed to type="date" for proper date selection
            value={driveDate}
            onChange={(e) => setDriveDate(e.target.value)}
            required
          />
        </div>

        <button type="submit">Add Drive</button>
      </form>
    </div>
  );
};

export default AddDriveForm;