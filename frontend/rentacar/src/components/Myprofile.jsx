// MyProfile.jsx
import React, { useState, useEffect } from "react";
import "./MyProfile.css";

const MyProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState({
    fullName: "",
    email: "",
    phone: "",
    role: "user",
    userId: "",
  });
  const [formData, setFormData] = useState(user);

  // Load user data from api
  useEffect(() => {

  console.log("profile");

  const token = localStorage.getItem("token");

  if (!token) {
    alert("Please login first");
    return;
  }

  fetch("http://localhost:5000/api/profile", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(res => res.json())
    .then(data => {

      const formattedUser = {
        fullName: data.name,
        email: data.email,
        phone: data.phone,
        role: "user",
        userId: data.id
      };

      setUser(formattedUser);
      setFormData(formattedUser);

    })
    .catch(err => console.log(err));

}, []);

  const handleEdit = () => setIsEditing(true);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSave = async () => {
    if (!formData.fullName || !formData.phone) {
    alert("Name and phone cannot be empty");
    return;
  }

  if (!/^[0-9]{10}$/.test(formData.phone)) {
  alert("Phone number must be 10 digits");
  return;
}

  const token = localStorage.getItem("token");

  try {

    const response = await fetch("http://localhost:5000/api/updateprofile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        fullName: formData.fullName,
        phone: formData.phone
      })
    });

    const data = await response.json();

    if (response.ok) {

      setUser(formData);
      setIsEditing(false);

      alert("Profile updated successfully!");

    } else {
      alert(data.message);
    }

  } catch (err) {
    console.log(err);
    alert("Server error");
  }
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
            <label>Email</label>
            <p>{user.email}</p>
            <small>Email cannot be changed</small>
          </div>

          <div className="profile-item">
            <label>Phone</label>
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
            <h3>0</h3>
            <p>Total Spent</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;