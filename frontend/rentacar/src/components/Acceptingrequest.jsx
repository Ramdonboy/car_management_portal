import { useEffect, useState } from "react";
import "./acceptingrequest.css";

function Acceptingrequest() {

  const [requests, setRequests] = useState([]);

  /*  Fetch booking requests from backend */
  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://localhost:5000/api/owner/bookings", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();
      setRequests(data);

    } catch (err) {
      console.error("Error fetching requests", err);
    }
  };

  /*  Accept booking */
  const handleAccept = async (id) => {
    const token = localStorage.getItem("token");

    await fetch(`http://localhost:5000/api/booking/status/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ status: "accepted" })
    });

    fetchRequests(); // refresh data
  };

  /*  Reject booking */
  const handleReject = async (id) => {
    const token = localStorage.getItem("token");

    await fetch(`http://localhost:5000/api/booking/status/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ status: "rejected" })
    });

    fetchRequests(); // refresh data
  };

  return (
    <div className="request-container">
      <h2>Booking Requests</h2>

      <div className="request-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Car</th>
              <th>Phone_no</th>
              <th>Pickup</th>
              <th>Return</th>
              <th>Total</th>
              <th>Status</th>
              <th>Action</th>
              
            </tr>
          </thead>

          <tbody>
            {requests.length === 0 ? (
              <tr>
                <td colSpan="8">No requests found</td>
              </tr>
            ) : (
              requests.map((req) => (
                <tr key={req.booking_id}>
                  <td>{req.booking_id}</td>
                  <td>{req.user_name}</td>
                  <td>{req.car_name}</td>
                  <td>{req.phone_no}</td>
                  <td>{req.pickup_date}</td>
                  <td>{req.return_date}</td>
                  <td>₹{req.total_price}</td>


                  <td className={req.status}>
                    {req.status}
                  </td>

                  <td>
                    {req.status === "pending" && (
                      <div className="action-buttons">

                        <button
                          className="accept-btn"
                          onClick={() => handleAccept(req.booking_id)}
                        >
                          Accept
                        </button>

                        <button
                          className="reject-btn"
                          onClick={() => handleReject(req.booking_id)}
                        >
                          Reject
                        </button>

                      </div>
                    )}
                  </td>

                </tr>
              ))
            )}
          </tbody>

        </table>
      </div>
    </div>
  );
}

export default Acceptingrequest;