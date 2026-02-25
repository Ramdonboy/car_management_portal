import { useNavigate } from "react-router-dom";
import "./home.css";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-root">
      {/* Top Navigation */}
      <header className="home-header">
        <div className="brand-name">speedo</div>

        <nav className="header-links">
          <span onClick={() => navigate("/login")}>Cars</span>
          <span onClick={() => navigate("/login")}>Login</span>
          <button onClick={() => navigate("/register")}>Register</button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay">
          <div className="hero-text">
            <h1>Premium Car Rental Service</h1>
            <p>
              Reliable, affordable and convenient car rentals for business
              and personal travel.
            </p>

            <div className="hero-actions">
              <button onClick={() => navigate("/login")}>
                View Available Cars
              </button>
              <button className="secondary" onClick={() => navigate("/login")}>
                Book Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="info-section">
        <div className="info-card">
          <h3>Trusted Vehicles</h3>
          <p>Well-maintained cars with verified documentation.</p>
        </div>

        <div className="info-card">
          <h3>Flexible Booking</h3>
          <p>Daily, weekly and monthly rental options.</p>
        </div>

        <div className="info-card">
          <h3>Transparent Pricing</h3>
          <p>No hidden costs. What you see is what you pay.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        © 2026 CarRent Management System. All rights reserved.
      </footer>
    </div>
  );
}

export default Home;
