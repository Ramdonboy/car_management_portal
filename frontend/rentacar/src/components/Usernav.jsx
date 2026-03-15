import { NavLink } from "react-router-dom";
import "./Navbar.css";

function Usernav() {
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
        <li>
            <NavLink to="/">Logout</NavLink>
          </li>
        
      </ul>
    </nav>
  );
}

export default Usernav;
