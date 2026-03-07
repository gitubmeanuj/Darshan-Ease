import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
  const { user, loading, hasAdminAccess } = useContext(AuthContext);

  if (loading) {
    return <div style={{ padding: "40px", textAlign: "center" }}>Loading...</div>;
  }

  if (!user || !hasAdminAccess) {
    return <Navigate to="/temples" replace />;
  }

  return children;
}