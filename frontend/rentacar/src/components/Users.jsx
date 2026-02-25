import React from "react";
import "./users.css";

function UsersPage() {
  return (
    <div className="users-container">

      <h1 className="page-title">User Management</h1>
      <p className="page-subtitle">
        View and manage registered users
      </p>

      {/* Stats Cards */}
      <div className="stats-wrapper">
        <div className="stat-box">
          <h2>0</h2>
          <p>Total Users</p>
        </div>

        <div className="stat-box">
          <h2>0</h2>
          <p>Active Customers</p>
        </div>

        <div className="stat-box">
          <h2>0</h2>
          <p>With Bookings</p>
        </div>
      </div>

      {/* Search */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search users by name or email..."
        />
      </div>

      {/* Table Section */}
      <div className="table-wrapper">
        <h3>All Users (0)</h3>

        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Contact</th>
              <th>User ID</th>
              <th>Bookings</th>
              <th>Total Spent</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td colSpan="6" className="empty-row">
                No users found
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default UsersPage;