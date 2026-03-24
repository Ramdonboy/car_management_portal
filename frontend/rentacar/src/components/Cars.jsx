import { useState, useEffect } from "react";
import axios from "axios";
import "./Cars.css";

function Cars() {
  const [cars, setCars] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/cars", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setCars(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteCar = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/delete-car/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchCars();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredCars = cars.filter((car) =>
    car.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="cars-container">
      <h1>Car Management</h1>

      <input
        className="search-bar"
        type="text"
        placeholder="Search cars..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Car</th>
              <th>Owner</th>
              <th>Type</th>
              <th>Fuel</th>
              <th>Seats</th>
              <th>Price</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredCars.map((car) => (
              <tr key={car.car_id}>
                <td className="car-cell">
                  <img
                    src={`http://localhost:5000/uploads/car_image/${car.image}`}
                    alt={car.name}
                  />
                  <div>
                    <strong>{car.name}</strong>
                  </div>
                </td>

                <td>{car.owner_name}</td>
                <td>{car.type || "N/A"}</td>
                <td>{car.fuel}</td>
                <td>{car.seats}</td>
                <td>₹{car.price_per_day}</td>

                <td>
                  <span
                    className={
                      (car.status || "available") === "available"
                        ? "status available"
                        : "status booked"
                    }
                  >
                    {car.status || "available"}
                  </span>
                </td>

                <td>
                 <button
                  className="delete-btn"
                  onClick={() => deleteCar(car.car_id)}
                  disabled={car.status === "booked"}
                >
                  {car.status === "booked" ? "Booked" : "Delete"}
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