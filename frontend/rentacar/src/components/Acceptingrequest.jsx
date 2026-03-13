import React, { useState } from "react";
import "./acceptingrequest.css";

function AcceptedBookings() {

const [bookings,setBookings] = useState([
{car:"Swift",user:"Rahul",pickup:"10 June",returnDate:"12 June",status:"pending"}
]);

const handleAccept = (index) => {
  const updated = [...bookings];
  updated[index].status = "accepted";
  setBookings(updated);
};

const handleReject = (index) => {
  const updated = [...bookings];
  updated[index].status = "rejected";
  setBookings(updated);
};

return(

<div className="accepted-container">

<h2>Booking Requests</h2>

{bookings.map((b,i)=>(
<div className="accepted-card" key={i}>

<p>Car: {b.car}</p>
<p>User: {b.user}</p>
<p>Pickup: {b.pickup}</p>
<p>Return: {b.returnDate}</p>

{b.status === "pending" && (
<div className="btns">
<button onClick={()=>handleAccept(i)} className="accept-btn">Accept</button>
<button onClick={()=>handleReject(i)} className="reject-btn">Reject</button>
</div>
)}

{b.status === "accepted" && (
<p className="success">Booked Successfully</p>
)}

{b.status === "rejected" && (
<p className="rejected">Permission Rejected</p>
)}

</div>
))}

</div>

);
}

export default AcceptedBookings;