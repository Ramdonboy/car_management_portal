import { useEffect, useState } from "react";
import "./Bookings.css";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/bookings");
      const data = await res.json();

      

      setBookings(data);
    } catch (err) {
      console.error(err);
    }
  };

  //  FILTER + SEARCH
  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.booking_id.toString().includes(search) ||
      (b.car_name || "").toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === "all" ||
      (b.status && b.status.toLowerCase() === filter);

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="bookings-page">
      <div className="content">
        <h2>Booking Management</h2>
        <p className="subtitle">Monitor and manage all rental bookings</p>

        {/*  STATS */}
        <div className="stats">
          <div className="stat-card">
            <h3>{bookings.length}</h3>
            <p>Total Bookings</p>
          </div>

          <div className="stat-card">
            <h3>
              {bookings.filter((b) => b.status === "approved").length}
            </h3>
            <p>Active</p>
          </div>

          <div className="stat-card">
            <h3>
              {bookings.filter((b) => b.status === "completed").length}
            </h3>
            <p>Completed</p>
          </div>

          <div className="stat-card">
            <h3>
              {bookings.filter((b) => b.status === "pending").length}
            </h3>
            <p>Pending</p>
          </div>
        </div>

        {/*  SEARCH + FILTER */}
        <div className="filters">
          <input
            type="text"
            placeholder="Search by booking ID or car name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Statuses</option>
            <option value="approved">Active</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        {/*  TABLE */}
        <div className="table-wrapper">
          <h4>All Bookings ({filteredBookings.length})</h4>

          <table>
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>User</th>
                <th>Car</th>
                <th>Owner</th>
                <th>Dates</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {filteredBookings.length > 0 ? (
                filteredBookings.map((b) => (
                  <tr key={b.booking_id}>
                    <td>{b.booking_id}</td>
                    <td>{b.user_name}</td>
                    <td>{b.car_name}</td>
                    <td>{b.owner_name}</td>

                    <td>
                      {new Date(b.pickup_date).toLocaleDateString()} →{" "}
                      {new Date(b.return_date).toLocaleDateString()}
                    </td>

                    <td>₹{Number(b.total_price).toLocaleString()}</td>

                    <td className={b.status}>
                      {b.status}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="empty">
                    No bookings found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Bookings;