import { useEffect, useState } from "react";import { API_BASE_URL, UPLOADS_BASE_URL } from "../apiConfig";import "./Userbookhistory.css";

function Userbookinghistory() {

  const [bookings, setBookings] = useState([]);

  /*  MOVE THIS OUTSIDE useEffect */
  async function fetchBookings() {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_BASE_URL}/api/user/bookings`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();
    setBookings(data);
  }

  useEffect(() => {
    fetchBookings();
  }, []);

  /*  CANCEL FUNCTION */
  const handleCancel = async (id) => {
    const token = localStorage.getItem("token");

    if (!window.confirm("Are you sure to cancel booking?")) return;

    const res = await fetch(
      `${API_BASE_URL}/api/booking/cancel/${id}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();
    alert(data.message);

    fetchBookings(); // refresh
  };

  return (
    <div className="container">

      

      {bookings.length === 0 ? (
        <p>No bookings found</p>
      ) : (
        <div className="booking-grid">
          {bookings.map((b) => (
            
            <div className="booking-card" key={b.booking_id}>

              <img
                src={`${UPLOADS_BASE_URL}/car_image/${b.image}`}
                alt={b.car_name}
              />

              <h3>{b.car_name}</h3>

              <p>Pickup: {b.pickup_date}</p>
              <p>Return: {b.return_date}</p>

              <p>Total: ₹{b.total_price}</p>

              {/*  STATUS */}
              <p className={(b.status || "pending").toLowerCase()}>
                Status: {b.status || "pending"}
              </p>

              {/* ADD BUTTON HERE */}
              {b.status === "pending" && (
                <button
                  className="cancel-btn"
                  onClick={() => handleCancel(b.booking_id)}
                >
                  Cancel Booking
                </button>
              )}

            </div>
          ))}
        </div>
      )}

    </div>
  );
}

export default Userbookinghistory;