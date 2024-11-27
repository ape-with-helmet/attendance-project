import React, { useState } from 'react';
import axios from 'axios';
import '../StyleSheets/AddDriveForm.css';

const AddDriveForm = () => {
  const [companyName, setCompanyName] = useState('');
  const [ctc, setCtc] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [jobRole, setJobRole] = useState('');
  const [cgpaCutoff, setCgpaCutoff] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!companyName || !ctc || !jobDescription || !jobRole || !cgpaCutoff) {
      setError('All fields are required!');
      return;
    }

    const newDrive = {
      companyName,
      ctc,
      jobDescription,
      jobRole,
      cgpaCutoff
    };

    try {
      const response = await axios.post('http://localhost:5000/drives', newDrive);
      if (response.status === 201) {
        alert('Drive added successfully!');
        // Clear form after successful submission
        setCompanyName('');
        setCtc('');
        setJobDescription('');
        setJobRole('');
        setCgpaCutoff('');
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
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Company Name:</label>
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>CTC:</label>
          <input
            type="text"
            value={ctc}
            onChange={(e) => setCtc(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Job Description:</label>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            required
          ></textarea>
        </div>

        <div className="form-group">
          <label>Job Role:</label>
          <input
            type="text"
            value={jobRole}
            onChange={(e) => setJobRole(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>CGPA Cutoff:</label>
          <input
            type="number"
            value={cgpaCutoff}
            onChange={(e) => setCgpaCutoff(e.target.value)}
            required
            min="0"
            max="10"
          />
        </div>

        <button type="submit">Add Drive</button>
      </form>
    </div>
  );
};

export default AddDriveForm;
