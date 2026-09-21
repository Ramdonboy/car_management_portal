import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL, UPLOADS_BASE_URL } from "../apiConfig";
import "./User.css";

function CarsBooking() {
  const navigate = useNavigate();

  const [cars, setCars] = useState([]);

useEffect(() => {
  const fetchCars = () => {
    fetch(`${API_BASE_URL}/api/view/car`)
      .then((res) => res.json())
      .then((data) => setCars(data));
  };

  fetchCars();

  const interval = setInterval(fetchCars, 3000); // auto refresh

  return () => clearInterval(interval);
}, []);

  return (
    <div className="container">

      <h2>Available Cars</h2>

      <div className="cars-grid">
        {cars.map((car) => (
          <div className="car-card" key={car.car_id}>

            <img
              src={`${UPLOADS_BASE_URL}/car_image/${car.image}`}
              alt={car.name}
            />

            <h3>{car.name}</h3>
            <p>{car.address}</p>
            <p>₹{car.price_per_day}/day</p>

            {/* UPDATED BUTTON LOGIC */}
       {car.status === "booked" ? (
          <button
            disabled
            style={{
              backgroundColor: "gray",
              cursor: "not-allowed",
              opacity: 0.6
            }}
          >
            Already Booked
          </button>
        ) : (
          <button
            onClick={() =>
              navigate("/booking", { state: { car: car } })
            }
          >
            Book Now
          </button>
        )}

          </div>
        ))}
      </div>

    </div>
  );
}

export default CarsBooking;