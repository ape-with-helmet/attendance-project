import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddDriveForm from './AddDriveForm.js'; // Import the AddDriveForm component
import '../StyleSheets/adminControl.css';
import "react-toastify/dist/ReactToastify.css";
import {toast} from 'react-toastify'
import int1 from '../resources/interview1.png'
import att1 from '../resources/attendance1.webp'
import role1 from '../resources/roles.png'

const AdminControlPage = () => {
  const [isAddDriveOpen, setIsAddDriveOpen] = useState(false);
  const [isChangeRoleOpen, setIsChangeRoleOpen] = useState(false);
  const [isDownloadAttendanceOpen, setIsDownloadAttendanceOpen] = useState(false);
  const [students, setStudents] = useState([]);
  const [driveList, setDriveList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null); // For popup
  const [role, setRole] = useState('');
  const [selectedDrive, setSelectedDrive] = useState({
    driveId:0,
    driveName:'',
    driveDate:new Date(),
  });

  const token = localStorage.getItem('token');  // Get the JWT token from localStorage

  const fetchStudents = async () => {
    const studResponse = await axios.get('http://localhost:5000/role/students', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    console.log("StudData",studResponse.data)
    setStudents(studResponse.data)
  }
  const fetchDrives = async () => {
    const driveResponse = await axios.get('http://localhost:5000/role/drives', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    console.log("DriveFata",driveResponse.data)
    setDriveList(driveResponse.data)
  }
  useEffect(() => {
    // Fetch student list and drive list on page load with JWT token in headers
    fetchStudents()
    fetchDrives()
  }, [token]);

  const handleRoleChange = async (userId) => {
    try {
      await axios.put(
        `http://localhost:5000/role/assign-role/${userId}`,
        { role }, // Send role in the payload
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.info('Role updated successfully');
    } catch (error) {
      console.error('Error updating role:', error);
      toast.error('Failed to update role. Please try again.');
    }
  };
  

  const handleDownloadAttendance = async () => {
    try {
      console.log(selectedDrive);
      const response = await axios.post(
        'http://localhost:5000/role/attendance/download',
        { driveId: selectedDrive.driveId, driveName:selectedDrive.driveName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: 'blob',
        }
      );
  
      // Log the response headers object to see how the headers are being structured
      console.log('Response headers:', response.headers);
      // Create blob and download file
      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
  
      // Create a link and trigger the download
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${selectedDrive.driveName} ${new Date(selectedDrive.driveDate).toLocaleDateString('en-GB')} Attendance`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  
      console.log('Download initiated successfully!',selectedDrive.driveName);
    } catch (error) {
      toast.error('Error downloading attendance');
      console.error(error);
    }
  };
  

  return (
    <>
    <div className='admin-control-container'>
      <h1>Admin Control Panel</h1>
      <div className="admin-control-page">
        {/* Section 1: Add Drive */}
        <div className="section">
          <img src={int1}/>
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
          <img src={role1}/>
          <button onClick={() => setIsChangeRoleOpen(true)}>Change Roles</button>
          {isChangeRoleOpen && (
            <div className="popup">
              <div className="search-bar">
                <input
                  type="text"
                  placeholder="Search by USN or Name"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="student-list">
                {searchQuery &&
                  students
                    .filter(
                      (student) =>
                        student.usn.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        student.name.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((student) => (
                      <div
                        key={student.usn}
                        className="student-item"
                        onClick={() => setSelectedStudent(student)}
                      >
                        {student.name} - {student.usn} ({student.role || "No Role"})
                      </div>
                    ))}
              </div>

              {/* Popup for role change */}
              {selectedStudent && (
                <div className="popup">
                  <div className="popup-content">
                    <h3>Change Role for {selectedStudent.name}</h3>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                    >
                      <option value="">Select Role</option>
                      <option value="Admin">Admin</option>
                      <option value="Student">Student</option>
                      <option value="Volunteer">Volunteer</option>
                    </select>
                    <button onClick={handleRoleChange}>Change Role</button>
                    <button onClick={() => setSelectedStudent(null)}>Cancel</button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>


      {/* Section 3: Download Attendance */}
        <div className="section">
          <img src={att1}/>
          <button onClick={() => setIsDownloadAttendanceOpen(true)}>Download Attendance</button>
          {isDownloadAttendanceOpen && (
            <div className="popup">
              <button className="close-btn" onClick={() => setIsDownloadAttendanceOpen(false)}>Close</button>
              <div className="dropdown">
                <label>Select Drive:</label>
                <select 
                  value={selectedDrive.driveId ? `${selectedDrive.driveId}-${selectedDrive.driveName}-${selectedDrive.driveDate}` : ''}
                  onChange={(e) => {
                    const [driveId, driveName, driveDate] = e.target.value.split('-');
                    setSelectedDrive({ 
                      driveId: parseInt(driveId), 
                      driveName, 
                      driveDate: new Date(driveDate),  // Ensure it's a Date object
                    });
                  }}
                >
                  <option value="">Select a Drive</option>
                  {driveList.map(drive => (
                    <option key={drive.id} value={`${drive.id}-${drive.name}-${new Date(drive.drive_date)}`}>
                      {drive.name} {new Date(drive.drive_date).toLocaleDateString('en-GB')}
                    </option>
                  ))}
                </select>
                {console.log(selectedDrive)}
                <button onClick={handleDownloadAttendance}>Download Attendance</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
};

export default AdminControlPage;
