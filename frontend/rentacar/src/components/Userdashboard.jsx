import { useState } from "react";
import "./User.css";

function CarsBooking() {

  const username = localStorage.getItem("username");

  const cars = [
    {
      id: 1,
      name: "Toyota Camry",
      price: 45,
      image: "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=400"
    },
    {
      id: 2,
      name: "BMW X5",
      price: 120,
      image: "https://images.unsplash.com/photo-1555215695-3004980ad54b?w=400"
    },
    {
      id: 3,
      name: "Mercedes GLC",
      price: 130,
      image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400"
    },
    {
      id: 4,
      name: "Audi A6",
      price: 110,
      image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400"
    },
    {
      id: 5,
      name: "Range Rover",
      price: 150,
      image: "https://images.unsplash.com/photo-1549399542-7e82138e2c63?w=400"
    },
    {
      id: 6,
      name: "Porsche Cayenne",
      price: 200,
      image: "https://images.unsplash.com/photo-1611821064430-0d40291d0f0b?w=400"
    }
  ];

  const [selectedCar, setSelectedCar] = useState(null);
  const [pickup, setPickup] = useState("");
  const [returnDate, setReturnDate] = useState("");

  return (
    <div className="container">

      {/* Navbar */}
      <div className="navbar">
        <h2>🚗 Car Rental</h2>
        <div>Welcome {username}</div>
      </div>

      {/* Cars Section */}
      <h2 className="title">Available Cars</h2>

      <div className="cars-grid">
        {cars.map((car) => (
          <div className="car-card" key={car.id}>

            <img
              src={car.image}
              alt={car.name}
              onClick={() => setSelectedCar(car)}
            />

            <h3>{car.name}</h3>
            <p>${car.price}/day</p>

            <button onClick={() => setSelectedCar(car)}>
              Book Now
            </button>

          </div>
        ))}
      </div>

      {/* Booking Section */}
      {selectedCar && (
        <div className="booking-section">

          <h2>Booking Details</h2>

          <img src={selectedCar.image} alt={selectedCar.name} />

          <h3>{selectedCar.name}</h3>
          <p>${selectedCar.price}/day</p>

          <label>Pickup Date</label>
          <input
            type="date"
            onChange={(e) => setPickup(e.target.value)}
          />

          <label>Return Date</label>
          <input
            type="date"
            onChange={(e) => setReturnDate(e.target.value)}
          />

          <div className="summary">
            <h3>Booking Summary</h3>
            <p>Car : {selectedCar.name}</p>
            <p>Pickup : {pickup}</p>
            <p>Return : {returnDate}</p>
          </div>

          <button className="confirm-btn">
            Confirm Booking
          </button>

        </div>
      )}

    </div>
  );
}

export default CarsBooking;