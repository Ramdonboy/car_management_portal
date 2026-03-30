import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Navbar.css";

function Usernav() {
  const [showSnackbar, setShowSnackbar] = useState(false);
  const navigate = useNavigate();

  // Logout click → show snackbar
  const handleLogoutClick = (e) => {
    e.preventDefault();
    setShowSnackbar(true);
  };

  // Confirm logout
  const handleConfirm = () => {
    setShowSnackbar(false);
    navigate("/"); // go to home page
  };

  // Cancel logout
  const handleCancel = () => {
    setShowSnackbar(false);
  };

  return (
    <>
      <nav className="navbar">
        <div className="logo">🚗 CarRent</div>

        <ul className="nav-links">
          <li>
            <NavLink to="/UserDashboard">Browse Cars</NavLink>
          </li>

          <li>
            <NavLink to="/mybookings">My Bookings</NavLink>
          </li>

          <li>
            <NavLink to="/Myprofile">My Profile</NavLink>
          </li>

          <li>
            <a href="/" className="logout-btn" onClick={handleLogoutClick}>
              ⏻ Logout
            </a>
          </li>
        </ul>
      </nav>

      {/* 🔥 SNACKBAR */}
      {showSnackbar && (
        <div className="snackbar">
          <p>Are you sure you want to logout?</p>
          <div className="snackbar-actions">
            <button className="cancel-btn" onClick={handleCancel}>
              Cancel
            </button>
            <button className="ok-btn" onClick={handleConfirm}>
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Usernav;