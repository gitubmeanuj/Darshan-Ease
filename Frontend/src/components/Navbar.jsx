import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {

  const { user, logout } = useContext(AuthContext);

  return (

    <nav className="navbar">

      <div className="nav-logo">
        🛕 DarshanEase
      </div>

      <div className="nav-links">

        <Link to="/temples">Temples</Link>

        <Link to="/bookings">Bookings</Link>

        {user?.role === "ADMIN" && (
          <Link to="/admin/temples">Admin</Link>
        )}

      </div>

      <div className="nav-actions">

        {user && (
          <button onClick={logout} className="logout-btn">
            Logout
          </button>
        )}

      </div>

    </nav>

  );

}