import React, { useState, useEffect } from "react";
import "./MyProfile.css";

const MyProfile = () => {

  const [isEditing, setIsEditing] = useState(false);

  const [user, setUser] = useState({
    fullName: "",
    email: "",
    phone: "",
    userId: ""
  });

  const [formData, setFormData] = useState(user);

  // Load user data (example from localStorage / registration)
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (storedUser) {
      setUser(storedUser);
      setFormData(storedUser);
    }
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = () => {
    setUser(formData);
    localStorage.setItem("user", JSON.stringify(formData));
    setIsEditing(false);
  };

  return (
    <div className="profile-container">

      <h2>My Profile</h2>

      <div className="profile-card">

        <div className="profile-header">
          {!isEditing ? (
            <button className="edit-btn" onClick={handleEdit}>
              Edit Profile
            </button>
          ) : (
            <button className="save-btn" onClick={handleSave}>
              Save
            </button>
          )}
        </div>

        <h3>Personal Information</h3>

        <div className="profile-grid">

          <div className="profile-item">
            <label>Full Name</label>

            {isEditing ? (
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
              />
            ) : (
              <p>{user.fullName}</p>
            )}
          </div>

          <div className="profile-item">
            <label>Email Address</label>
            <p>{user.email}</p>
            <small>Email cannot be changed</small>
          </div>

          <div className="profile-item">
            <label>Phone Number</label>

            {isEditing ? (
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            ) : (
              <p>{user.phone}</p>
            )}
          </div>

          <div className="profile-item">
            <label>User ID</label>
            <p>{user.userId}</p>
          </div>

        </div>

        <div className="stats">

          <div className="stat-box">
            <h3>0</h3>
            <p>Total Bookings</p>
          </div>

          <div className="stat-box">
            <h3>0</h3>
            <p>Completed Trips</p>
          </div>

          <div className="stat-box">
            <h3>$0</h3>
            <p>Total Spent</p>
          </div>

        </div>

      </div>

    </div>
  );
};

export default MyProfile;