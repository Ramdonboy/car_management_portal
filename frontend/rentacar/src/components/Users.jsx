import React, { useEffect, useState } from "react";
import "./users.css";

function UsersPage() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  // ✅ FETCH USERS
  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/users");
      const data = await res.json();

      console.log("FRONTEND DATA:", data);

      setUsers(data);
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ UPDATE STATUS (ADMIN CONTROL)
  const updateStatus = async (id, status) => {
    try {
      await fetch(`http://localhost:5000/api/admin/user-status/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      // 🔄 Refresh list after update
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ SAFE SEARCH FILTER
  const filteredUsers = users.filter((u) =>
    (u.name || "").toLowerCase().includes(search.toLowerCase()) ||
    (u.email || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="users-container">
      <h1 className="page-title">User Management</h1>
      <p className="page-subtitle">View and manage registered users</p>

      {/* ✅ STATS */}
      <div className="stats-wrapper">
        <div className="stat-box">
          <h2>{users.length}</h2>
          <p>Total Users</p>
        </div>

        <div className="stat-box">
          <h2>
            {users.filter((u) => u.status === "approved").length}
          </h2>
          <p>Active Customers</p>
        </div>

        <div className="stat-box">
          <h2>
            {users.filter((u) => Number(u.bookings) > 0).length}
          </h2>
          <p>With Bookings</p>
        </div>
      </div>

      {/* ✅ SEARCH */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search users by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* ✅ TABLE */}
      <div className="table-wrapper">
        <h3>All Users ({filteredUsers.length})</h3>

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Contact</th>
              <th>User ID</th>
              <th>Bookings</th>
              <th>Total Spent</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((u) => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>{u.phone}</td>
                  <td>{u.id}</td>
                  <td>{u.bookings}</td>

                  {/* 💰 FORMAT MONEY */}
                  <td>₹{Number(u.total_spent).toLocaleString()}</td>

                  {/* 🎨 STATUS COLOR */}
                  <td className={u.status}>{u.status}</td>

                  {/* 🔥 ADMIN ACTION */}
                  <td>
                    <button
                      onClick={() => updateStatus(u.id, "approved")}
                      disabled={u.status === "approved"}
                    >
                      Activate
                    </button>

                    <button
                      onClick={() => updateStatus(u.id, "rejected")}
                      disabled={u.status === "rejected"}
                    >
                      Block
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="empty-row">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UsersPage;