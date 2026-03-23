import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Navbar.css";

function Navbar() {
  const [showSnackbar, setShowSnackbar] = useState(false);
  const navigate = useNavigate();

 
  const handleLogoutClick = (e) => {
  e.preventDefault();
  console.log("Logout clicked"); // 👈 check this
  setShowSnackbar(true);
};

  const handleConfirm = () => {
    setShowSnackbar(false);
    navigate("/"); // go to home page
  };

  const handleCancel = () => {
    setShowSnackbar(false);
  };

  return (
    <>
      <nav className="navbar">
        <div className="logo">🚗 CarRent Admin</div>

        <ul className="nav-links">
          <li><NavLink to="/cars">Cars</NavLink></li>
          <li><NavLink to="/users">Users</NavLink></li>
          <li><NavLink to="/bookings">Bookings</NavLink></li>
          <li><NavLink to="/reports">Reports</NavLink></li>

          <li>
  <button className="logout-btn" onClick={handleLogoutClick}>
    Logout
  </button>
</li>
        </ul>
      </nav>

      {/* Snackbar */}
      {showSnackbar && (
        <div className="snackbar">
          <p>Are you sure you want to logout?</p>
          <div className="snackbar-actions">
            <button onClick={handleConfirm}>OK</button>
            <button onClick={handleCancel}>Cancel</button>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;