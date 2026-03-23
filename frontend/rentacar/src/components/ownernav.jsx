import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Navbar.css";

function Ownernav() {
  const [showSnackbar, setShowSnackbar] = useState(false);
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    setShowSnackbar(true);
  };

  const handleConfirm = () => {
    setShowSnackbar(false);
    navigate("/"); // go to home
  };

  const handleCancel = () => {
    setShowSnackbar(false);
  };

  return (
    <>
      <nav className="navbar">
        <div className="logo">🚗 CarRent</div>

        <ul className="nav-links">
          <li>
            <NavLink to="/addcar">Add Car</NavLink>
          </li>
          <li>
            <NavLink to="/ownercars">My Cars</NavLink>
          </li>
          <li>
            <NavLink to="/acceptingrequest">Booking Request</NavLink>
          </li>
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

export default Ownernav;