import React from "react";
import { Link } from "react-router-dom";
import "./Admindashboard.css";

function OwnerDashboard() {
  return (
    <div className="Admin-dashboard">
      <h1>Admin Dashboard</h1>

      <div className="owner-menu">
    
        <Link to="/cars">Cars</Link>
        <Link to="/users"> Users</Link>
         <Link to="/bookings">Bookings</Link>
        <Link to="/reports">Reports</Link>
        <Link to="/ownersrequest">Owners Request</Link>
      </div>
    </div>
  );
}

export default OwnerDashboard;