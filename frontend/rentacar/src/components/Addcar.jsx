import React, { useState } from "react";
import "./addcar.css";

function AddCar(){

const [car,setCar] = useState({
name:"",
model:"",
fuel:"",
transmission:"",
seats:"",
price_per_day:"",
status:"available",
reg_number: ""
});

const [image,setImage] = useState(null);
const [RcBook,setRcBook] = useState(null);
/* handle text inputs */

const handleChange = (e)=>{
setCar({...car,[e.target.name]:e.target.value});
};

/* handle image */

const handleImageChange = (e)=>{
setImage(e.target.files[0]);
};
const handleRcBookChange = (e)=>{
setRcBook(e.target.files[0]);
};
/* submit form */

const handleSubmit = async(e)=>{
e.preventDefault();

try{

const token = localStorage.getItem("token");

const formData = new FormData();

formData.append("name",car.name);
formData.append("type", car.type);
formData.append("fuel",car.fuel);
formData.append("transmission",car.transmission);
formData.append("seats",car.seats);
formData.append("price_per_day",car.price_per_day);
formData.append("reg_number",car.reg_number);
formData.append("car_image",image);
formData.append("rc_book",RcBook);
const response = await fetch("http://localhost:5000/api/add/car",{

method:"POST",
headers:{
Authorization:`Bearer ${token}`
},
body:formData

});

const data = await response.json();

alert(data.message);

}catch(err){

console.error(err);
alert("Error adding car");

}

};

return(

<div className="addcar-container">

<h2>Add Car</h2>

<form onSubmit={handleSubmit}>

<input
name="name"
placeholder="Car Name"
onChange={handleChange}
/>

<input
name="model"
placeholder="Model"
onChange={handleChange}
/>

<input
name="reg_number"
placeholder="register number"
onChange={handleChange}
/>

<input
name="fuel"
placeholder="Fuel"
onChange={handleChange}
/>

<input
name="transmission"
placeholder="Transmission"
onChange={handleChange}
/>

<input
name="seats"
placeholder="Seats"
onChange={handleChange}
/>

<input
name="price_per_day"
placeholder="Price per day"
onChange={handleChange}
/>
<input
name="status"
placeholder="status"
onChange={handleChange}
/>


<label>Upload Image</label>
<input

type="file"
name="car_image"
onChange={handleImageChange}
/>
<label >Upload Rc Book</label>
<input 
placeholder="Upload Rc Book"
type="file"
name="rc_book"
onChange={handleRcBookChange}
/>

<button type="submit">Add Car</button>

</form>

</div>

);
}

export default AddCar;