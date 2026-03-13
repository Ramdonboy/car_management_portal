import { NavLink } from "react-router-dom";
import "./Navbar.css";

function Ownernav() {
  return (
    <nav className="navbar">
      <div className="logo">🚗 CarRent </div>

      <ul className="nav-links">
        <li>
          <NavLink to="/addcar">addcar</NavLink>
        </li>
        <li>
          <NavLink to="/ownercars">My cars</NavLink>
        </li>
          <li>
          <NavLink to="/acceptingrequest">Booking request</NavLink>
        </li>
          <li>
            <NavLink to="/">Logout</NavLink>
          </li>
        
      </ul>
    </nav>
  );
}

export default Ownernav;
