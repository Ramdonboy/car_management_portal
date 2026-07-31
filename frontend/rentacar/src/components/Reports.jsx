import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import "./reports.css";

// Register chart
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Revenue = () => {
  const [data, setData] = useState({
    totalRevenue: 0,
    monthlyRevenue: [],
    totalBookings: 0,
  });

  useEffect(() => {
    fetchRevenue();
  }, []);

  const fetchRevenue = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/revenue");
      const result = await res.json();

      setData(result);
    } catch (err) {
      console.error(err);
    }
  };

  //  CHART DATA
  const chartData = {
    labels: data.monthlyRevenue.map((m) => m.month),
    datasets: [
      {
        label: "Monthly Revenue",
        data: data.monthlyRevenue.map((m) => m.revenue),
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: "Revenue Trend",
      },
    },
  };

  return (
    <div className="revenue-page">
      <h2>Revenue Analytics</h2>

      {/*  STATS */}
      <div className="stats">
        <div className="card">
          <h3>₹{Number(data.totalRevenue).toLocaleString()}</h3>
          <p>Total Revenue</p>
        </div>

        <div className="card">
          <h3>{data.totalBookings}</h3>
          <p>Total Bookings</p>
        </div>

        <div className="card">
          <h3>{data.monthlyRevenue.length}</h3>
          <p>Active Months</p>
        </div>
      </div>

      {/*  CHART */}
      <div className="chart-container">
        <Line data={chartData} options={chartOptions} />
      </div>

      {/*  TABLE */}
      <div className="table">
        <h3>Monthly Revenue</h3>

        <table>
          <thead>
            <tr>
              <th>Month</th>
              <th>Revenue</th>
            </tr>
          </thead>

          <tbody>
            {data.monthlyRevenue.length > 0 ? (
              data.monthlyRevenue.map((m, i) => (
                <tr key={i}>
                  <td>{m.month}</td>
                  <td>₹{Number(m.revenue).toLocaleString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2">No data</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Revenue;