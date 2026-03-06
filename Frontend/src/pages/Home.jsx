import { Link } from "react-router-dom";
import "./Home.css";

export default function Home() {
  return (
    <div className="home-container">

      <div className="hero-section">
        <h1 className="title">🛕 DarshanEase</h1>

        <p className="subtitle">
          DarshanEase allows devotees to conveniently book temple darshan slots
          online. Instead of waiting in long queues, users can select temples,
          choose available time slots, and confirm their darshan tickets in
          advance from anywhere.
        </p>

        <div className="button-group">
          <Link to="/login" className="btn primary">Login</Link>
          <Link to="/signup" className="btn secondary">Signup</Link>
        </div>
      </div>

      <div className="features-section">
        <h2>Features</h2>

        <div className="feature-grid">

          <div className="feature-card">
            🛕
            <h3>Book Darshan</h3>
            <p>Reserve temple darshan slots online easily.</p>
          </div>

          <div className="feature-card">
            📅
            <h3>Select Date</h3>
            <p>Choose preferred darshan date and timing.</p>
          </div>

          <div className="feature-card">
            🎫
            <h3>Manage Bookings</h3>
            <p>View and manage your previous bookings.</p>
          </div>

          <div className="feature-card">
            👤
            <h3>User Profile</h3>
            <p>Update personal information anytime.</p>
          </div>

        </div>
      </div>

    </div>
  );
}