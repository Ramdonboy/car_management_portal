import { useEffect, useState } from "react";
import "./Bookingpage.css";

function MyBookings() {

  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const savedBookings =
      JSON.parse(localStorage.getItem("bookings")) || [];

    setBookings(savedBookings);
  }, []);

 
  return (
  <div className="container">

    {/* Top Right Button */}
    <div className="top-bar">
      <button
        className="mybooking-btn"
        onClick={() => navigate("/mybookings")}
      >
        My Bookings
      </button>
    </div>

    {/* Cars Section */}
    <h2 className="title">Available Cars</h2>

    <div className="cars-grid">
      {cars.map((car) => (
        <div className="car-card" key={car.id}>

          <img
            src={car.image}
            alt={car.name}
          />
           {/* Navbar */}
      <div className="navbar">

        <div className="logo">
          Rent A Car
        </div>

        <div className="nav-right">
          <span className="welcome">Welcome {username}</span>

          <button onClick={() => navigate("/mybookings")}>
            My Bookings
          </button>

          <button onClick={handleLogout}>
            Logout
          </button>
        </div>

      </div>

          <h3>{car.name}</h3>
          <p>${car.price}/day</p>

          <button onClick={() => navigate("/booking", { state: { car } })}>
            Book Now
          </button>

        </div>
      ))}
    </div>

  </div>
);
}

export default MyBookings;