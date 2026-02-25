import "./Bookings.css";

const Bookings = () => {
  return (
    <div className="bookings-page">
      {/* Top Navbar */}
      <nav className="top-nav">
        


        
      </nav>

      {/* Page Content */}
      <div className="content">
        <h2>Booking Management</h2>
        <p className="subtitle">Monitor and manage all rental bookings</p>

        {/* Stats Cards */}
        <div className="stats">
          <div className="stat-card">
            <h3>0</h3>
            <p>Total Bookings</p>
          </div>
          <div className="stat-card">
            <h3>0</h3>
            <p>Active</p>
          </div>
          <div className="stat-card">
            <h3>0</h3>
            <p>Completed</p>
          </div>
          <div className="stat-card">
            <h3>0</h3>
            <p>Pending</p>
          </div>
        </div>

        {/* Search + Filter */}
        <div className="filters">
          <input
            type="text"
            placeholder="Search by booking ID or car name..."
          />
          <select>
            <option>All Statuses</option>
            <option>Active</option>
            <option>Completed</option>
            <option>Pending</option>
          </select>
        </div>

        {/* Table */}
        <div className="table-wrapper">
          <h4>All Bookings (0)</h4>

          <table>
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Car</th>
                <th>Dates</th>
                <th>Amount</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="7" className="empty">
                  No bookings found
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Bookings;
