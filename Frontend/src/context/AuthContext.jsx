import { createContext, useState, useEffect } from "react";
import { loginUser } from "../services/authService";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Restore session on reload
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }

    setLoading(false);
  }, []);

  // 🔹 Login
  const login = async (credentials) => {
    try {
      const res = await loginUser(credentials);

      // Backend returns data in res.data.data structure
      const userData = {
        id: res.data.data.id,
        name: res.data.data.name,
        email: res.data.data.email,
        phone: res.data.data.phone,
        role: res.data.data.role
      };
      const userToken = res.data.data.token;

      localStorage.setItem("token", userToken);
      localStorage.setItem("user", JSON.stringify(userData));

      setUser(userData);
      setToken(userToken);

      return { success: true };

    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Login failed"
      };
    }
  };

  // 🔹 Logout
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
    setToken(null);
  };

    return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.role === "ADMIN",
        isOrganizer: user?.role === "ORGANIZER",
        isUser: user?.role === "USER",
        hasAdminAccess: ["ADMIN", "ORGANIZER"].includes(user?.role),
        login,
        logout
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}