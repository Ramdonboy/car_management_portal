import { useState } from "react";
import "./Cars.css";

function Cars() {
  const [cars, setCars] = useState([
   {
  id: 1,
  name: "Toyota Camry",
  year: 2024,
  image: "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=400",
  type: "Sedan",
  fuel: "Petrol",
  transmission: "Automatic",
  seats: 5,
  price: 45,
  status: "Available",
},
{
  id: 2,
  name: "BMW X5",
  year: 2024,
  image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=600",
  type: "Luxury",
  fuel: "Diesel",
  transmission: "Automatic",
  seats: 5,
  price: 120,
  status: "Rented",
},


    {
      id: 3,
      name: "Mercedes GLC",
      year: 2024,
      image: "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=600",
      type: "Luxury",
      fuel: "Petrol",
      transmission: "Automatic",
      seats: 5,
      price: 130,
      status: "Available",
    },
      {
      id: 4,
      name: "Audi A6",
      year: 2024,
      image: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=600",
      type: "Sedan",
      fuel: "Petrol",
      transmission: "Automatic",
      seats: 5,
      price: 110,
      status: "Available",
    },
   {
      id: 5,
      name: "Porsche Cayenne",
      year: 2024,
      image: "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=600",
      type: "Luxury",
      fuel: "Petrol",
      transmission: "Automatic",
      seats: 5,
      price: 200,
      status: "Available",
    },
   {
  id: 6,
  name: "Range Rover Evoque",
  year: 2024,
  image: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=600",
  type: "SUV",
  fuel: "Diesel",
  transmission: "Automatic",
  seats: 5,
  price: 150,
  status: "Available",
},
  ]);

  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [newCar, setNewCar] = useState({
    name: "",
    type: "",
    fuel: "",
    transmission: "",
    seats: "",
    price: "",
    status: "Available",
  });

  const handleChange = (e) => {
    setNewCar({ ...newCar, [e.target.name]: e.target.value });
  };

  const addCar = () => {
    if (!newCar.name) return;

    const car = {
      id: cars.length + 1,
      year: 2024,
      image: "https://source.unsplash.com/100x100/?car",
      ...newCar,
    };

    setCars([...cars, car]);
    setShowForm(false);
    setNewCar({
      name: "",
      type: "",
      fuel: "",
      transmission: "",
      seats: "",
      price: "",
      status: "Available",
    });
  };

  const deleteCar = (id) => {
    setCars(cars.filter((car) => car.id !== id));
  };

  const filteredCars = cars.filter((car) =>
    car.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="cars-container">
      <div>
        <h1>Car Management</h1>
        <div className="top-row">
  
  <p>Manage your fleet of rental cars</p>
  <button className="add-btn" onClick={() => setShowForm(!showForm)}> + Add Car</button>
</div>

      
      </div>

      <div className="search-add">
        <input
          className="search-bar"
          type="text"
          placeholder="Search cars by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        
      </div>

      {showForm && (
        <div className="form">
          <input name="name" placeholder="Car Name" onChange={handleChange} />
          <input name="type" placeholder="Type" onChange={handleChange} />
          <input name="fuel" placeholder="Fuel" onChange={handleChange} />
          <input name="transmission" placeholder="Transmission" onChange={handleChange} />
          <input name="seats" placeholder="Seats" onChange={handleChange} />
          <input name="price" placeholder="Price/Day" onChange={handleChange} />
          <select name="status" onChange={handleChange}>
            <option>Available</option>
            <option>Rented</option>
          </select>
          <button className="save-btn" onClick={addCar}>Save</button>
          <button
  className="cancel-btn"
  onClick={() => {
    setShowForm(false);
    setNewCar({
      name: "",
      type: "",
      fuel: "",
      transmission: "",
      seats: "",
      price: "",
      status: "Available",
    });
  }}
>
  Cancel
</button>

        </div>
      )}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Car</th>
              <th>Type</th>
              <th>Fuel</th>
              <th>Transmission</th>
              <th>Seats</th>
              <th>Price/Day</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredCars.map((car) => (
              <tr key={car.id}>
                <td className="car-cell">
                  <div className="car-image">
                    <img src={car.image} alt={car.name} />
                  </div>
                  <div>
                    <strong>{car.name}</strong>
                    <div className="year">{car.year}</div>
                  </div>
                </td>
                <td>{car.type}</td>
                <td>{car.fuel}</td>
                <td>{car.transmission}</td>
                <td>{car.seats}</td>
                <td>${car.price}</td>
                <td>
                  <span className={car.status === "Available" ? "status available" : "status rented"}>
                    {car.status}
                  </span>
                </td>
                <td>
                  <button
                    className="delete-btn"
                    onClick={() => deleteCar(car.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Cars;
