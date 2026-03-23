import React, { useState, useEffect } from "react";
import "./ownercars.css";

function MyCars() {

const [cars, setCars] = useState([]);

useEffect(() => {

  const fetchCars = async () => {

    try {

      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/view/owner/cars", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();
      setCars(data);

    } catch (err) {
      console.error("Error fetching cars:", err);
    }

  };

  fetchCars();

}, []);



const [editingId,setEditingId] = useState(null);

/* Delete car */
const deleteCar = async (id) => {
  const token = localStorage.getItem("token");

  console.log("TOKEN:", token);
  console.log("Deleting car:", id);

  try {
    const res = await fetch(`http://localhost:5000/delete-car/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();
    console.log("Response:", data);

    if (data.message === "Car deleted successfully") {
      setCars(prev => prev.filter(car => car.car_id !== id));
    } else {
      alert(data.message); // 🔥 VERY IMPORTANT
    }

  } catch (err) {
    console.error(err);
  }
};

/* Start edit */
const saveEdit = async (car) => {
  const token = localStorage.getItem("token");

  try {
    const res = await fetch(`http://localhost:5000/update-car/${car.car_id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        name: car.name,
        fuel: car.fuel,
        seats: car.seats,
        price_per_day: car.price_per_day
      })
    });

    const data = await res.json();
    console.log(data);

    setEditingId(null);

  } catch (err) {
    console.error(err);
  }
};

/* Handle input change */
const handleChange = (e,id)=>{
const {name,value} = e.target;

setCars(cars.map(car =>
car.car_id === id ? {...car,[name]:value} : car
));
};

/* Handle image upload */
const handleImageChange = (e,id)=>{
const file = e.target.files[0];
const imageURL = URL.createObjectURL(file);

setCars(cars.map(car =>
car.car_id === id ? {...car,image:imageURL} : car
));
};

/* Save edit */
const startEdit = (id) => {
  setEditingId(id);
};

return(

<div className="mycars">

<h2>My Cars</h2>

<div className="car-list">

{cars.map((car)=>(
<div className="car-card" key={car.car_id}>

<img
src={`http://localhost:5000/uploads/car_image/${car.image}`}
alt="car"
/>

{editingId === car.car_id ? (

<>
<input
name="name"
placeholder="name"
value={car.name}
onChange={(e)=>handleChange(e,car.car_id)}
/>

<input
name="fuel"
placeholder="fuel"
value={car.fuel}
onChange={(e)=>handleChange(e,car.car_id)}
/>

<input
name="seats"
placeholder="seats"
value={car.seats}
onChange={(e)=>handleChange(e,car.car_id)}
/>

<input
  name="price_per_day"
  placeholder="price"
  value={car.price_per_day || ""}
  onChange={(e)=>handleChange(e,car.car_id)}
/>

<input
type="file"
onChange={(e)=>handleImageChange(e,car.car_id)}
/>

<button onClick={()=>saveEdit(car)}>Save</button>

</>

):(

<>
<h3>{car.name}</h3>
<p>Fuel: {car.fuel}</p>
<p>Seats: {car.seats}</p>
<p>Price: ₹{car.price_per_day}/day</p>
<button onClick={()=>startEdit(car.car_id)}>Edit</button>
<button onClick={()=>deleteCar(car.car_id)}>Delete</button>
</>

)}

</div>
))}

</div>

</div>

);
}

export default MyCars;