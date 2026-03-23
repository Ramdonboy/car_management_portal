import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Bookingpage.css";

function BookingPage() {

  const location = useLocation();
  const navigate = useNavigate();

  const car = location.state?.car;

  const [pickup, setPickup] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [message, setMessage] = useState("");

  if (!car) {
    return <h2>No car selected</h2>;
  }

  /* Calculate total price */
 const calculateTotal = () => {

  if (!pickup || !returnDate) return 0;

  const start = new Date(pickup);
  const end = new Date(returnDate);

  const timeDiff = end - start;

  const days = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

  if (days <= 0) return 0;

  return days * car.price_per_day; // 
};

  /* Booking Confirmation */
 const handleBooking = async () => {

  if (!pickup || !returnDate) {
    alert("Select dates");
    return;
  }

  const token = localStorage.getItem("token");

  const res = await fetch("http://localhost:5000/api/book-car", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      car_id: car.car_id,
      owner_id: car.owner_id,
      pickup: pickup,
      returnDate: returnDate,
      total: calculateTotal()
    })
  });

  const data = await res.json();

  setMessage(data.message);
};
  return (
    <div className="container">
    
      {/* Back Button */}
      <button className="back-btn" onClick={() => navigate("/Userdashboard")}>
        ← Back to Cars
      </button>

      <div className="booking-section">

        <h2>Booking Details</h2>

        <img
  src={`http://localhost:5000/uploads/car_image/${car.image}`}
  alt={car.name}
/>

        <h3>{car.name}</h3>
        <p>₹{car.price_per_day} / day</p>

        <label>Pickup Date</label>
        <input
           type="date"
           value={pickup}
           min={new Date().toISOString().split("T")[0]}
           onChange={(e) => setPickup(e.target.value)}
/>

        <label>Return Date</label>
        <input
          type="date"
          value={returnDate}
          onChange={(e) => setReturnDate(e.target.value)}
        />

        <div className="summary">
          <h3>Booking Summary</h3>
          <p>Car : {car.name}</p>
          <p>Pickup : {pickup}</p>
          <p>Return : {returnDate}</p>
          <p><b>Total Price : {calculateTotal()}</b></p>
        </div>

        <button
          className="confirm-btn"
          onClick={handleBooking}
          disabled={!pickup || !returnDate}
        >
          Confirm Booking
        </button>

        {message && <p className="success-msg">{message}</p>}

      </div>

    </div>
  );
}

export default BookingPage;