import React, {useState} from "react";
import "./addcar.css";

function AddCar(){

const [car,setCar]=useState({
name:"",
type:"",
fuel:"",
transmission:"",
seats:"",
price_per_day:"",
status:"available"
});

const handleChange=(e)=>{
setCar({...car,[e.target.name]:e.target.value});
};

const handleSubmit=(e)=>{
e.preventDefault();
console.log(car);
alert("Car Added");
};

return(
<div className="addcar-container">

<h2>Add Car</h2>

<form onSubmit={handleSubmit}>

<input name="name" placeholder="Car Name" onChange={handleChange}/>
<input name="type" placeholder="Type" onChange={handleChange}/>
<input name="fuel" placeholder="Fuel" onChange={handleChange}/>
<input name="transmission" placeholder="Transmission" onChange={handleChange}/>
<input name="seats" placeholder="Seats" onChange={handleChange}/>
<input name="price_per_day" placeholder="Price per day" onChange={handleChange}/>

<select name="status" onChange={handleChange}>
<option value="available">Available</option>
<option value="maintenance">Maintenance</option>
</select>

<input type="file"/>

<button>Add Car</button>

</form>

</div>
);
}

export default AddCar;