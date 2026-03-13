import React from "react";
import { Link } from "react-router-dom";
import "./Ownerdashboard.css";

function OwnerDashboard() {
  return (
    <div className="owner-dashboard">
      <h1>Owner Dashboard</h1>

      <div className="owner-menu">
        <Link to="/addcar">Add Car</Link>
        <Link to="/ownercars">My Cars</Link>
        <Link to="/acceptingrequest"> Bookings requests</Link>
      </div>
    </div>
  );
}

export default OwnerDashboard;