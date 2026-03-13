import React, { useState } from "react";
import "./ownercars.css";

function MyCars() {

const [cars,setCars] = useState([
{
car_id:1,
name:"Swift",
price:1500,
fuel:"Petrol",
year:"2000",
seats:5,
image:"https://via.placeholder.com/200"
},
{
car_id:2,
name:"Innova",
price:2500,
fuel:"Diesel",
seats:7,
image:"https://via.placeholder.com/200"
}
]);

const [editingId,setEditingId] = useState(null);

/* Delete car */
const deleteCar = (id) =>{
const updatedCars = cars.filter(car => car.car_id !== id);
setCars(updatedCars);
};

/* Start edit */
const startEdit = (id)=>{
setEditingId(id);
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
const saveEdit = ()=>{
setEditingId(null);
};

return(

<div className="mycars">

<h2>My Cars</h2>

<div className="car-list">

{cars.map((car)=>(
<div className="car-card" key={car.car_id}>

<img src={car.image} alt="car"/>

{editingId === car.car_id ? (

<>
<input
name="name"
value={car.name}
onChange={(e)=>handleChange(e,car.car_id)}
/>

<input
name="fuel"
value={car.fuel}
onChange={(e)=>handleChange(e,car.car_id)}
/>

<input
name="seats"
value={car.seats}
onChange={(e)=>handleChange(e,car.car_id)}
/>

<input
name="price"
value={car.price}
onChange={(e)=>handleChange(e,car.car_id)}
/>
<input
name="year"
value={car.year}
onChange={(e)=>handleChange(e,car.car_id)}
/>
<input
type="file"
onChange={(e)=>handleImageChange(e,car.car_id)}
/>

<button onClick={saveEdit}>Save</button>

</>

):(

<>
<h3>{car.name}</h3>
<p>Fuel: {car.fuel}</p>
<p>Seats: {car.seats}</p>
<p>Price: ₹{car.price}/day</p>
<p>year: {car.year}</p>
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