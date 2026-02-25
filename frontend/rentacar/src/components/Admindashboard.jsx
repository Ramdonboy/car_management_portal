import "./Admindashboard.css";

function Dashboard() {
  return (
    <div className="dashboard">
     


      {/* Content */}
      <div className="content">
        <h1>Admin Dashboard</h1>
        <p className="subtitle">
          Welcome back, Admin User! Here's what's happening today.
        </p>

        {/* Stats Cards */}
        <div className="cards">
          <div className="card">
            <h4>Total Cars</h4>
            <h2>8</h2>
            <p>6 available</p>
          </div>

          <div className="card">
            <h4>Active Bookings</h4>
            <h2>0</h2>
            <p>0 total bookings</p>
          </div>

          <div className="card">
            <h4>Total Users</h4>
            <h2>0</h2>
            <p>Registered customers</p>
          </div>

          <div className="card">
            <h4>Total Revenue</h4>
            <h2>0</h2>
            <p>From 0 paid bookings</p>
          </div>
        </div>

        {/* Fleet Overview */}
        <div className="fleet">
          <h3>Fleet Overview</h3>

          <div className="fleet-item available">
            <span>✔ Available Cars</span>
            <strong>6</strong>
          </div>

          <div className="fleet-item rented">
            <span>📅 Rented Cars</span>
            <strong>2</strong>
          </div>

          <h4>Car Types Distribution</h4>

          <div className="progress-group">
            <label>Sedan</label>
            <div className="progress">
              <div className="bar" style={{ width: "70%" }}></div>
            </div>
          </div>

          <div className="progress-group">
            <label>SUV</label>
            <div className="progress">
              <div className="bar" style={{ width: "60%" }}></div>
            </div>
          </div>

          <div className="progress-group">
            <label>Luxury</label>
            <div className="progress">
              <div className="bar" style={{ width: "50%" }}></div>
            </div>
          </div>

          <div className="progress-group">
            <label>Sports</label>
            <div className="progress">
              <div className="bar" style={{ width: "30%" }}></div>
            </div>
          </div>

          <div className="progress-group">
            <label>Hatchback</label>
            <div className="progress">
              <div className="bar" style={{ width: "40%" }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;


