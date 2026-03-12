import { NavLink } from "react-router-dom";
import "./Navbar.css";

function Booknav() {
  return (
    <nav className="navbar">
      <div className="logo">🚗 CarRent </div>

      <ul className="nav-links">
        <li>
          <NavLink to="/UserDashboard">Browse cars</NavLink>
        </li>
        <li>
          <NavLink to="/Myprofile">My Profile</NavLink>
        </li>
        
        
      </ul>
    </nav>
  );
}