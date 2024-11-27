import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddDriveForm from './AddDriveForm.js'; // Import the AddDriveForm component
import '../StyleSheets/adminControl.css';

const AdminControlPage = () => {
  const [isAddDriveOpen, setIsAddDriveOpen] = useState(false);
  const [isChangeRoleOpen, setIsChangeRoleOpen] = useState(false);
  const [isDownloadAttendanceOpen, setIsDownloadAttendanceOpen] = useState(false);
  const [students, setStudents] = useState([]);
  const [driveList, setDriveList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [role, setRole] = useState('');
  const [selectedDrive, setSelectedDrive] = useState('');

  const token = localStorage.getItem('token');  // Get the JWT token from localStorage

  useEffect(() => {
    // Fetch student list and drive list on page load with JWT token in headers
    axios.get('http://localhost:5000/students', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(response => setStudents(response.data))
      .catch(error => console.error('Error fetching students:', error));

    axios.get('http://localhost:5000/drives', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(response => setDriveList(response.data))
      .catch(error => console.error('Error fetching drives:', error));
  }, [token]);

  const handleRoleChange = async (usn) => {
    try {
      await axios.post('http://localhost:5000/admin/change-role', {
        usn,
        newRole: role,
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      alert('Role updated successfully');
    } catch (error) {
      console.error('Error updating role:', error);
    }
  };

  const handleDownloadAttendance = async () => {
    try {
      const response = await axios.post('http://localhost:5000/attendance/download', {
        driveName: selectedDrive
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      // Assuming response contains the Excel file
      const blob = new Blob([response.data], { type: 'application/vnd.ms-excel' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${selectedDrive}_attendance.xlsx`;
      link.click();
    } catch (error) {
      console.error('Error downloading attendance:', error);
    }
  };

  return (
    <div className="admin-control-page">
      {/* Section 1: Add Drive */}
      <div className="section">
        <button onClick={() => setIsAddDriveOpen(true)}>Add Drive</button>
        {isAddDriveOpen && (
          <div className="popup">
            <button className="close-btn" onClick={() => setIsAddDriveOpen(false)}>Close</button>
            <AddDriveForm />
          </div>
        )}
      </div>

      {/* Section 2: Change Role */}
      <div className="section">
        <button onClick={() => setIsChangeRoleOpen(true)}>Change Roles</button>
        {isChangeRoleOpen && (
          <div className="popup">
            <button className="close-btn" onClick={() => setIsChangeRoleOpen(false)}>Close</button>
            <div className="search-bar">
              <input 
                type="text" 
                placeholder="Search by USN or Name"
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
              />
            </div>
            <div className="student-list">
              {students.filter(student => 
                student.usn.toLowerCase().includes(searchQuery.toLowerCase()) || 
                student.name.toLowerCase().includes(searchQuery.toLowerCase())
              ).map(student => (
                <div key={student.usn} className="student-item">
                  <div>{student.name} - {student.usn}</div>
                  <input 
                    type="text" 
                    placeholder="Enter new role" 
                    value={role}
                    onChange={(e) => setRole(e.target.value)} 
                  />
                  <button onClick={() => handleRoleChange(student.usn)}>Change Role</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Section 3: Download Attendance */}
      <div className="section">
        <button onClick={() => setIsDownloadAttendanceOpen(true)}>Download Attendance</button>
        {isDownloadAttendanceOpen && (
          <div className="popup">
            <button className="close-btn" onClick={() => setIsDownloadAttendanceOpen(false)}>Close</button>
            <div className="dropdown">
              <label>Select Drive:</label>
              <select value={selectedDrive} onChange={(e) => setSelectedDrive(e.target.value)}>
                <option value="">Select a Drive</option>
                {driveList.map(drive => (
                  <option key={drive.companyName} value={drive.companyName}>{drive.companyName}</option>
                ))}
              </select>
              <button onClick={handleDownloadAttendance}>Download Attendance</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminControlPage;
