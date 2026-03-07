import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import AuthProvider from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import OrganizerRoute from "./components/OrganizerRoute";
import Layout from "./components/Layout";

import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";    
import TestLogin from "./pages/TestLogin";
import Temples from "./pages/Temples";
import Slots from "./pages/Slots";
import Bookings from "./pages/Bookings";
import Profiles from "./pages/Profiles";
import AdminTemples from "./pages/admin/AdminTemples";
import OrganizerDashboard from "./pages/OrganizerDashboard";

import "./App.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>

          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/test-login" element={<TestLogin />} />

          {/* Protected Routes */}
          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="/temples" element={<Temples />} />
            <Route path="/temples/:id/slots" element={<Slots />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/profile" element={<Profiles />} />
          </Route>

          {/* Admin Routes */}
          <Route
            element={
              <AdminRoute>
                <Layout />
              </AdminRoute>
            }
          >
            <Route path="/admin/temples" element={<AdminTemples />} />
          </Route>

          {/* Organizer Routes */}
          <Route
            element={
              <OrganizerRoute>
                <Layout />
              </OrganizerRoute>
            }
          >
            <Route path="/organizer/dashboard" element={<OrganizerDashboard />} />
          </Route>

        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;