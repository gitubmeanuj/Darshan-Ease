import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav style={{ padding: "15px", background: "#222", color: "white" }}>
      <Link to="/temples">Temples</Link>{" "}
      <Link to="/bookings">Bookings</Link>{" "}

      {user?.role === "ADMIN" && (
        <Link to="/admin/temples">Admin</Link>
      )}

      <button onClick={logout}>Logout</button>
    </nav>
  );
}