import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

const testUsers = [
  { email: "user@example.com", password: "password123", role: "USER", color: "#2196F3" },
  { email: "admin@example.com", password: "password123", role: "ADMIN", color: "#f44336" },
  { email: "organizer@example.com", password: "password123", role: "ORGANIZER", color: "#ffc107" }
];

export default function TestLogin() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleTestLogin = async (testUser) => {
    try {
      setLoading(true);
      const result = await login({
        email: testUser.email,
        password: testUser.password
      });

      if (result.success) {
        toast.success(`✅ Logged in as ${testUser.role}`);
        navigate("/temples");
      } else {
        toast.error(result.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed - please check your backend");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "80px auto", padding: "30px" }}>
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <h1>🧪 Test Login</h1>
        <p style={{ color: "#666", fontSize: "16px" }}>
          Select a role to test the application
        </p>
      </div>

      <div style={{ display: "grid", gap: "15px" }}>
        {testUsers.map(user => (
          <button
            key={user.role}
            onClick={() => handleTestLogin(user)}
            disabled={loading}
            style={{
              padding: "18px",
              backgroundColor: user.color,
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: loading ? "not-allowed" : "pointer",
              fontSize: "16px",
              fontWeight: "bold",
              transition: "0.2s",
              opacity: loading ? 0.7 : 1,
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
            }}
          >
            <div style={{ fontSize: "20px", marginBottom: "4px" }}>
              {user.role === "USER" ? "👤" : user.role === "ADMIN" ? "👨‍💼" : "🏢"}
            </div>
            {user.role}
            <div style={{ fontSize: "12px", opacity: 0.9 }}>
              {user.email}
            </div>
          </button>
        ))}
      </div>

      <div style={{ marginTop: "40px", padding: "15px", backgroundColor: "#f5f5f5", borderRadius: "8px" }}>
        <h3 style={{ margin: "0 0 10px 0", color: "#333" }}>📋 Test Credentials:</h3>
        <p style={{ margin: "5px 0", color: "#555", fontSize: "14px" }}>
          <strong>All passwords:</strong> password123
        </p>
        <hr style={{ margin: "15px 0" }} />
        <p style={{ margin: "5px 0", color: "#555", fontSize: "12px" }}>
          <strong>USER:</strong> user@example.com - Regular user with booking capability
        </p>
        <p style={{ margin: "5px 0", color: "#555", fontSize: "12px" }}>
          <strong>ADMIN:</strong> admin@example.com - Full system access
        </p>
        <p style={{ margin: "5px 0", color: "#555", fontSize: "12px" }}>
          <strong>ORGANIZER:</strong> organizer@example.com - Temple management access
        </p>
      </div>

      <div style={{ marginTop: "30px", paddingTop: "20px", borderTop: "1px solid #ddd" }}>
        <p style={{ color: "#999", fontSize: "12px", textAlign: "center" }}>
          👉 Run `npm run seed` to create these test users in database
        </p>
      </div>
    </div>
  );
}