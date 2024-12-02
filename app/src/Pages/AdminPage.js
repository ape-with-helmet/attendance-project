import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddDriveForm from './AddDriveForm.js';
import '../StyleSheets/adminControl.css';
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import int1 from '../resources/interview1.png';
import att1 from '../resources/attendance1.webp';
import role1 from '../resources/roles.png';

const AdminControlPage = () => {
  const [isPopupOpen, setIsPopupOpen] = useState({
    addDrive: false,
    changeRole: false,
    downloadAttendance: false,
  });
  const [students, setStudents] = useState([]);
  const [driveList, setDriveList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [role, setRole] = useState('');
  const [selectedDrive, setSelectedDrive] = useState({
    driveId: 0,
    driveName: '',
    driveDate: new Date(),
  });

  const token = localStorage.getItem('token');
  useEffect(() => {
    // Unselect the student whenever searchQuery changes
    setSelectedStudent(null);
  }, [searchQuery]);
  const fetchStudents = async () => {
    try {
      const studResponse = await axios.get('https://attendance-project-eibp.onrender.com/role/students', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudents(studResponse.data);
    } catch (error) {
      toast.error('Error fetching students.');
    }
  };

  const fetchDrives = async () => {
    try {
      const driveResponse = await axios.get('https://attendance-project-eibp.onrender.com/role/drives', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDriveList(driveResponse.data);
    } catch (error) {
      toast.error('Error fetching drives.');
    }
  };

  useEffect(() => {
    fetchStudents();
    fetchDrives();
  }, []);

  const handleRoleChange = async (userId) => {
    try {
      await axios.put(
        `https://attendance-project-eibp.onrender.com/role/assign-role/${userId}`,
        { role },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Role updated successfully');
    } catch (error) {
      toast.error('Failed to update role.');
    }
  };

  const handleDownloadAttendance = async () => {
    try {
      const response = await axios.post(
        'https://attendance-project-eibp.onrender.com/role/attendance/download',
        { driveId: selectedDrive.driveId, driveName: selectedDrive.driveName },
        { headers: { Authorization: `Bearer ${token}` }, responseType: 'blob' }
      );
  
      // If the response is a blob (Excel file), process it
      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
  
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${selectedDrive.driveName}_${new Date(selectedDrive.driveDate).toLocaleDateString('en-GB')}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  
      toast.success('Download successful');
    } catch (error) {
      console.log(error)
      // If the error is due to no data found (404), show the error message from the backend
      if (error.response && error.response.status === 404) {
        toast.error(error.response.data.message || 'No data found for the selected drive');
      } else {
        toast.error('An error occurred while downloading the attendance');
      }
    }
  };
  

  const togglePopup = (type) => {
    setIsPopupOpen((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  return (
    <div className='admin-control-container'>
      <h1>Admin Control Panel</h1>
      <div className="admin-control-page">
        <div className="section" onClick={() => togglePopup('addDrive')}>
          <img src={int1} alt="Add Drive" />
          <div className='rolling_part'>Add Drive</div>
        </div>

        <div className="section" onClick={() => togglePopup('changeRole')}>
          <img src={role1} alt="Change Roles" />
          <div className='rolling_part'>Change Roles</div>
        </div>

        <div className="section" onClick={() => togglePopup('downloadAttendance')}>
          <img src={att1} alt="Download Attendance" />
          <div className='rolling_part'>Download Attendance</div>
        </div>
      </div>

      {isPopupOpen.addDrive && (
        <div className="popup">
          <div className="popup-content">
          <div className="close-animation" onClick={() => togglePopup('addDrive')}>×</div>
            <AddDriveForm />
          </div>
        </div>
      )}

      {isPopupOpen.changeRole && (
        <div className="popup">
          <div className="popup-content">
          <div className="close-animation" onClick={() => togglePopup('changeRole')}>×</div>
            
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search Student by Name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="student-list">
              {searchQuery && students.filter(student => student.name.toLowerCase().includes(searchQuery.toLowerCase())).map((student, idx) => (
                <div key={idx} className="student-item" onClick={() => setSelectedStudent(student)}>
                  {student.name}
                </div>
              ))}
            </div>
            {selectedStudent && (
              <div className="dropdown">
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="" disabled>Select Role</option>
                  <option value="Admin">Admin</option>
                  <option value="Volunteer">Volunteer</option>
                  <option value="Student">Student</option>
                </select>
                <div className="reset_button" onClick={() => handleRoleChange(selectedStudent.id) }>Change Role</div>
              </div>
            )}
          </div>
        </div>
      )}

      {isPopupOpen.downloadAttendance && (
        <div className="popup">
          <div className="popup-content">
            <div className="close-animation" onClick={() => togglePopup('downloadAttendance')}>
              ×
            </div>
            <div className="dropdown">
              <select
                value={selectedDrive.driveId}
                onChange={(e) => {
                  const selectedOption = e.target.options[e.target.selectedIndex];
                  setSelectedDrive({
                    driveId: selectedOption.value,
                    driveName: selectedOption.dataset.name,
                    driveDate: selectedOption.dataset.date,
                  });
                }}
              >
                <option value="">Select Drive</option>
                {driveList.map((drive, idx) => (
                  <option
                    key={idx}
                    value={drive.id}
                    data-name={drive.name}
                    data-date={new Date(drive.drive_date).toLocaleDateString()}
                  >
                    {drive.name} - {new Date(drive.drive_date).toLocaleDateString()}
                  </option>
                ))}
              </select>
              <button onClick={handleDownloadAttendance} className='reset_button'>
                Download Attendance
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminControlPage;
