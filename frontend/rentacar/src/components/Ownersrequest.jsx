import { useEffect, useState } from "react";
import "./ownersrequest.css";

function OwnerRequest() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/owner-requests");
      const data = await res.json();
      setRequests(data);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/admin/update-owner-status/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );

      const data = await res.json();
      console.log("API RESPONSE:", data);

      // ❌ If backend failed
      if (!res.ok) {
        alert(data.message || "Failed to update status");
        return;
      }

      // ✅ ALWAYS REFETCH FROM DATABASE (IMPORTANT FIX)
      await fetchRequests();

    } catch (error) {
      console.error("Update error:", error);
    }
  };

  return (
    <div className="request-container">
      <h2>Owner Registration Requests</h2>

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
          {requests.length > 0 ? (
            requests.map((req) => (
              <tr key={req.id}>
                <td>{req.id}</td>
                <td>{req.name}</td>
                <td>{req.email}</td>
                <td>{req.phone}</td>
                <td>{req.place}</td>

                {/*  STATUS */}
                <td className={req.status?.toLowerCase()}>
                  {req.status || "pending"}
                </td>

                <td>
                <button
                onClick={() => updateStatus(req.id, "approved")}
              >
                Accept
              </button>

                  <button
                    onClick={() => updateStatus(req.id, "rejected")}
                    disabled={req.status !== "pending"}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" style={{ textAlign: "center" }}>
                No requests found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default OwnerRequest;