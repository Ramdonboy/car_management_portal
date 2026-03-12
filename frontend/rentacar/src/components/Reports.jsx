import React from "react";
import "./reports.css";

function AdminReport() {
  // Sample Data (You can replace with backend data later)
  const totalRevenue = 0;
  const thisMonthRevenue = 0;
  const totalBookings = 0;
  const thisMonthBookings = 0;

  const averageBookingValue = (totalRevenue / totalBookings).toFixed(2);

const topCars = [
  { name: "Toyota Camry", bookings: 0, revenue: 0 },
  { name: "BMW X5", bookings: 0, revenue: 0 },
  { name: "Audi A6", bookings: 0, revenue: 0 },
  { name: "Porsche Cayenne", bookings: 0, revenue: 0 },
  { name: "Range Rover Evoque", bookings: 0, revenue: 0 },
];

  return (
    <div className="report-container">
      <h2 className="report-title">Admin Dashboard - Reports</h2>

      {/* Revenue Cards */}
      <div className="card-container">
        <div className="report-card">
          <h3>Total Revenue</h3>
          <p>₹ {totalRevenue}</p>
        </div>

        <div className="report-card">
          <h3>This Month Revenue</h3>
          <p>₹ {thisMonthRevenue}</p>
        </div>

        <div className="report-card">
          <h3>Average Booking Value</h3>
          <p>₹ {averageBookingValue}</p>
        </div>
      </div>

      {/* Booking Statistics */}
      <div className="statistics-section">
        <h3>Booking Statistics</h3>
        <div className="stats-box">
          <p>Total Bookings: <strong>{totalBookings}</strong></p>
          <p>This Month Bookings: <strong>{thisMonthBookings}</strong></p>
        </div>
      </div>

      {/* Top Performing Cars */}
      <div className="top-cars-section">
        <h3>Top Performing Cars</h3>
        <table>
          <thead>
            <tr>
              <th>Car Name</th>
              <th>Total Bookings</th>
              <th>Total Revenue (₹)</th>
            </tr>
          </thead>
          <tbody>
            {topCars.map((car, index) => (
              <tr key={index}>
                <td>{car.name}</td>
                <td>{car.bookings}</td>
                <td>{car.revenue}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminReport;