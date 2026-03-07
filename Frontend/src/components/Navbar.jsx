import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "./Navbar.css";

export default function Navbar() {
  const { user, logout, isAdmin, isOrganizer, isUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="nav-logo">
        🛕 DarshanEase
      </div>

      <div className="nav-links">
        <Link to="/temples">🛕 Temples</Link>
        
        {user && isUser && (
          <>
            <Link to="/bookings">📅 Bookings</Link>
            <Link to="/profile">👤 Profile</Link>
          </>
        )}
        
        {user && isAdmin && (
          <>
            <Link to="/bookings" style={{ fontSize: "12px" }}>📊 All Bookings</Link>
            <Link to="/admin/temples" style={{ color: "#ff9800" }}>⚙️ Admin Panel</Link>
            <Link to="/profile">👤 Admin Profile</Link>
          </>
        )}

        {user && isOrganizer && (
          <>
            <Link to="/organizer/dashboard" style={{ color: "#ffc107" }}>📊 Dashboard</Link>
            <Link to="/profile">👤 Profile</Link>
          </>
        )}
      </div>

      <div className="nav-actions">
        {user ? (
          <>
            <span style={{ marginRight: "15px", color: "#333" }}>
              <strong>{user.name}</strong>
              <span style={{ fontSize: "12px", marginLeft: "8px", color: "#666" }}>
                ({user.role})
              </span>
            </span>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-btn login-btn">
              Login
            </Link>
            <Link to="/signup" className="nav-btn signup-btn">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}