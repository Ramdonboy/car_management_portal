import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./User.css";

function CarsBooking() {

  const username = localStorage.getItem("username");
  const navigate = useNavigate();
  const cars = [
    {
      id: 1,
      name: "Toyota Camry",
      price: 4500,
      image: "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=400"
    },
    {
      id: 2,
      name: "BMW X5",
      price: 120,
      image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=600"
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
      image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=600"
    },
    {
      id: 5,
      name: "Range Rover Evoque",
      price: 150,
      image: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=600"
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

      {/* Cars Section */}
     

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

            <button onClick={() => navigate("/booking", { state: { car } })}>
            Book Now
       </button>
          </div>
        ))}
      </div>

     

    </div>
  );
}

export default CarsBooking;