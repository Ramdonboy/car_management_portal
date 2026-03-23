import { useEffect } from "react";
import "./ownersrequest.css";

function OwnerRequest() {

useEffect(() => {
  const fetchRequests = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:5000/api/owner/bookings", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();
    setRequests(data);
  };

  fetchRequests();
}, []);

  const handleAccept = (id) => {
    const updated = requests.map((req) =>
      req.id === id ? { ...req, status: "Accepted" } : req
    );
    setRequests(updated);
  };

  const handleReject = (id) => {
    const updated = requests.map((req) =>
      req.id === id ? { ...req, status: "Rejected" } : req
    );
    setRequests(updated);
  };

  return (
    <div className="request-container">
      <h2>Owner Registration Requests</h2>

      <div className="request-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Place</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {requests.map((req) => (
              <tr key={req.id}>
                <td>{req.id}</td>
                <td>{req.name}</td>
                <td>{req.email}</td>
                <td>{req.phone}</td>
                <td>{req.place}</td>

                <td className={req.status.toLowerCase()}>
                  {req.status}
                </td>

                <td>
                  <div className="action-buttons">
                    <button
                      className="accept-btn"
                      onClick={() => handleAccept(req.id)}
                    >
                      Accept
                    </button>

                    <button
                      className="reject-btn"
                      onClick={() => handleReject(req.id)}
                    >
                      Reject
                    </button>
                  </div>
                </td>

              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
}

export default OwnerRequest;