import React, { useState, useEffect } from "react";
import axios from "axios";

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch the user profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/profile/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data.data)
        setProfile(response.data.data);
      } catch (err) {
        setError("Failed to load profile. Please try again.");
      } finally {
        setLoading(false);
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
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      await axios.put(
        "http://localhost:5000/auth/change-password",
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
      setSuccessMessage("Password updated successfully!");
      setIsChangingPassword(false);
    } catch (err) {
      setError("Failed to update password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle profile update
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      await axios.put(
        "http://localhost:5000/profile/profile",
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
      alert("Profile updated successfully!");
    } catch (err) {
      setError("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <h1>{profile.name}</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {isEditing ? (
            <form onSubmit={handleUpdate}>
              <div style={{ marginBottom: "10px" }}>
                <label>
                  Name:
                  <input
                    type="text"
                    name="name"
                    value={profile.name}
                    onChange={handleChange}
                    required
                  />
                </label>
              </div>
              <div style={{ marginBottom: "10px" }}>
                <label>
                  Phone Number:
                  <input
                    type="text"
                    name="phone_number"
                    value={profile.phone_number}
                    onChange={handleChange}
                    required
                  />
                </label>
              </div>
              <div style={{ marginBottom: "10px" }}>
                <label>
                  CGPA:
                  <input
                    type="number"
                    name="cgpa"
                    value={profile.cgpa}
                    step="0.01"
                    onChange={handleChange}
                    required
                  />
                </label>
              </div>
              <button type="submit">Save</button>
              <button type="button" onClick={() => setIsEditing(false)}>
                Cancel
              </button>
            </form>
          ) : (
            <div>
              <p>
                <strong>USN:</strong> {profile.usn}
              </p>
              <p>
                <strong>Phone Number:</strong> {profile.phone_number}
              </p>
              <p>
                <strong>Email ID:</strong> {profile.email}
              </p>
              <p>
                <strong>CGPA:</strong> {profile.cgpa}
              </p>
              <button onClick={() => setIsEditing(true)}>Edit Profile</button>
            </div>
          )}

          {isChangingPassword ? (
            <form onSubmit={handlePasswordChange}>
              <div style={{ marginBottom: "10px" }}>
                <label>
                  Current Password:
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                </label>
              </div>
              <div style={{ marginBottom: "10px" }}>
                <label>
                  New Password:
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </label>
              </div>
              <button type="submit">Change Password</button>
              <button type="button" onClick={() => setIsChangingPassword(false)}>
                Cancel
              </button>
            </form>
          ) : (
            <button onClick={() => setIsChangingPassword(true)}>Change Password</button>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;
