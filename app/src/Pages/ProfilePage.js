import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import '../StyleSheets/main.css'

const Profile = () => {
  const [profile, setProfile] = useState({
    id: null,
    name: "",
    phone_number: "",
    cgpa: "",
    email: "",
    usn: "",
    role: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [reEnterPassword, setReEnterPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isPasswordValid, setIsPasswordValid] = useState(false)
  const [regexOutput, setRegexOutput] = useState(false)
  
  const handlePasswordModification = (value, field) => {
    if (field === "new") {
      setNewPassword(value);
    } else if (field === "reEnter") {
      setReEnterPassword(value);
    }
    validatePasswords(value, field);
  };
  
  const validatePasswords = (value, field) => {
    const passwordToCheck = field === "new" ? value : newPassword;
    const confirmPasswordToCheck = field === "reEnter" ? value : reEnterPassword;
  
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  
    if (regex.test(passwordToCheck)) {
      setRegexOutput(true)
      if (passwordToCheck !== confirmPasswordToCheck){
        setErrorMessage("Passwords do not match.");
        setIsPasswordValid(false);
      }
      else{
        setErrorMessage("");
        setIsPasswordValid(true);
      }
      
      setIsPasswordValid(false);
    } else {
      setErrorMessage(
        "Password must be at least 8 characters long, include an uppercase letter, a number, and a special character."
      );
    }
  };
  // Fetch the user profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("https://attendance-project-eibp.onrender.com/profile/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProfile(response.data.data);
      } catch (err) {
        toast.error("Failed to load profile. Please try again.");
      } 
    };

    fetchProfile();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading('Processing the Changes')
    
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "https://attendance-project-eibp.onrender.com/auth/change-password",
        {
          data:{
            currentPassword,
            newPassword,
          },
          user: profile.id
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.update(loadingToast, {
        render: 'Password Changed successfully!',
        type: 'success',
        isLoading: false,
        autoClose: 3000,
      }); 
      setIsChangingPassword(false);
    } catch (err) {
      toast.update(loadingToast, {
        render: err.response.data.message,
        type: 'error',
        isLoading: false,
        autoClose: 3000,
      });
    } 
  };

  // Handle profile update
  const handleUpdate = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading('Processing the Changes')
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "https://attendance-project-eibp.onrender.com/profile/profile",
        {
          name: profile.name,
          phone_number: profile.phone_number,
          cgpa: profile.cgpa,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIsEditing(false);
      toast.update(loadingToast, {
        render: 'Profile Updated successfully!',
        type: '',
        isLoading: false,
        autoClose: 3000,
      }); 
    } catch (err) {
      toast.update(loadingToast, {
        render: err.response.data.message,
        type: 'error',
        isLoading: false,
        autoClose: 3000,
      });    } 
  };

  return (
    <div className="reset_container profile_container">
      <div className="reset_content">
        {isEditing ? <h1>Edit Profile</h1>:<h1>Profile</h1>}
        <div className="editing_profile">
          {isEditing ? (
            <form onSubmit={handleUpdate} className="reset_form">
              <div style={{ marginBottom: "10px" }}>
                  <input
                    type="text"
                    className="reset_input profile_input"
                    name="name"
                    value={profile.name}
                    placeholder="Full Name"
                    onChange={handleChange}
                    required
                  />
              </div>
              <div style={{ marginBottom: "10px" }}>
                  <input
                    type="text"
                    className="reset_input profile_input"
                    name="phone_number"
                    value={profile.phone_number}
                    onChange={handleChange}
                    placeholder="Phone Number"
                    required
                  />
              </div>
              <div style={{ marginBottom: "10px" }}>
                  <input
                    type="number"
                    name="cgpa"
                    className="reset_input profile_input"
                    value={profile.cgpa}
                    step="0.01"
                    placeholder="CGPA"
                    onChange={handleChange}
                    required
                  />
              </div>
              <div className="button_container">
                <button type="submit" className="reset_button profile_reset_button">Save</button>
                <button className="reset_button cancel" type="button" onClick={() => setIsEditing(false)}>
                  Cancel
                </button>
              </div>
            </form>
          ) : isChangingPassword ? (
            <form onSubmit={handlePasswordChange} className="reset_form">
              <div style={{ marginBottom: "10px" }}>
                  <input
                    type="password"
                    className="reset_input profile_input"
                    placeholder="Current Password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
              </div>
              <div style={{ marginBottom: "10px" }}>
                <input
                  type="password"
                  placeholder="New Password"
                  className="reset_input profile_input"
                  value={newPassword}
                  onChange={(e) => handlePasswordModification(e.target.value, "new")}
                  required
                />
              </div>
              <div style={{ marginBottom: "10px" }}>
                <input
                  type="password"
                  placeholder="Re-Enter Password"
                  className="reset_input profile_input"
                  value={reEnterPassword}
                  disabled={!regexOutput}
                  onChange={(e) => handlePasswordModification(e.target.value, "reEnter")}
                  required
                />
              </div>
              <div style={{ color: "red", marginBottom: "10px" }}>
                {errorMessage && <p>{errorMessage}</p>}
              </div>
              <div className="button_container">
                <button type="submit" className="reset_button"  disabled={isPasswordValid}>Change Password</button>
                <button className="reset_button cancel" type="button" onClick={() => {
                  setIsChangingPassword(false)
                  setCurrentPassword('')
                  setNewPassword('')
                  setReEnterPassword('')
                  }}>
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="profile_details">
              <p>
                <strong>Name - </strong> {profile.name}
              </p>
              <p>
                <strong>USN - </strong> {profile.usn}
              </p>
              <p>
                <strong>CGPA - </strong> {profile.cgpa}
              </p>
              <p>
                <strong>Phone Number - </strong> {profile.phone_number}
              </p>
              <p>
                <strong>Email ID - </strong> {profile.email}
              </p>
              <div className="button_container">
              <button onClick={() => setIsEditing(true)} className="reset_button profile_change_button">Edit Profile</button>
              <button className='reset_button cancel' onClick={() => setIsChangingPassword(true)}>Change Password</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
