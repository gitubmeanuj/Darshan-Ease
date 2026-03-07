import { useState, useEffect, useCallback } from "react";
import { getAllSlots, deleteSlot } from "../services/templeService";
import { getAllBookings } from "../services/bookingService";
import { getUserProfile, updateProfile } from "../services/userService";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  CircularProgress,
  Tab,
  Tabs,
} from "@mui/material";
import toast from "react-hot-toast";

const styles = `
  .organizer-container { padding: 40px 20px; max-width: 1400px; margin: 0 auto; }
  .organizer-header { margin-bottom: 30px; }
  .organizer-header h2 { font-size: 28px; color: #ffc107; margin-bottom: 10px; }
  .tabs-container { margin-bottom: 30px; border-bottom: 1px solid #ddd; }
  .tab-content { margin-top: 20px; }
  .organizer-card { border: 1px solid #ddd; padding: 20px; border-radius: 8px; background: white; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
  .organizer-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 30px; }
  .stat-box { background: linear-gradient(135deg, #fff9c4, #ffeb3b); padding: 20px; border-radius: 8px; border-left: 4px solid #ffc107; }
  .stat-box h3 { color: #ffc107; margin: 0; font-size: 14px; font-weight: 600; }
  .stat-box .stat-number { font-size: 28px; font-weight: bold; color: #f57f17; margin: 10px 0; }
  .btn-add { background: #ffc107; color: #333; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; font-weight: 600; }
  .btn-add:hover { background: #ffb300; }
  .loading-center { display: flex; justify-content: center; align-items: center; min-height: 300px; }
  .empty-state { text-align: center; padding: 60px 20px; color: #666; }
  .profile-form { max-width: 500px; background: white; padding: 30px; border-radius: 8px; border: 1px solid #ddd; }
  .profile-form input { width: 100%; padding: 10px; margin-bottom: 15px; border: 1px solid #ddd; border-radius: 4px; }
  .table-container { overflow-x: auto; margin-top: 20px; }
  .data-table { width: 100%; border-collapse: collapse; }
  .data-table th { background: #f5f5f5; padding: 12px; text-align: left; font-weight: 600; border-bottom: 2px solid #ddd; }
  .data-table td { padding: 12px; border-bottom: 1px solid #ddd; }
  .data-table tr:hover { background: #fafafa; }
  .slot-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; margin-top: 20px; }
  .slot-card { border: 1px solid #ddd; padding: 20px; border-radius: 8px; background: white; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
  .slot-card h3 { color: #ffc107; margin-bottom: 10px; }
  .slot-card p { margin: 8px 0; color: #666; }
  .action-buttons { display: flex; gap: 8px; margin-top: 12px; }
`;

export default function OrganizerDashboard() {
  const [tab, setTab] = useState(0);
  const [profile, setProfile] = useState(null);
  const [slots, setSlots] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editPasswordMode, setEditPasswordMode] = useState(false);
  const [formData, setFormData] = useState({});

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      if (tab === 0) {
        const res = await getUserProfile();
        setProfile(res.data.data);
        setFormData({
          name: res.data.data.name,
          email: res.data.data.email,
          phone: res.data.data.phone
        });
      } else if (tab === 1) {
        const res = await getAllSlots();
        setSlots(res.data.data || []);
      } else if (tab === 2) {
        const res = await getAllBookings();
        setBookings(res.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  }, [tab]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleUpdateProfile = async () => {
    try {
      const updateData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone
      };
      if (editPasswordMode && formData.password) {
        updateData.password = formData.password;
      }
      await updateProfile(updateData);
      toast.success("Profile updated successfully");
      setEditPasswordMode(false);
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile");
    }
  };

  const handleDeleteSlot = async (slotId) => {
    if (window.confirm("Are you sure you want to delete this slot?")) {
      try {
        await deleteSlot(slotId);
        toast.success("Slot deleted successfully");
        fetchData();
      } catch (error) {
        console.error(error);
        toast.error("Failed to delete slot");
      }
    }
  };

  if (loading && tab === 0) {
    return (
      <div className="loading-center">
        <CircularProgress />
      </div>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div className="organizer-container">
        <div className="organizer-header">
          <h2>🏛️ Organizer Dashboard</h2>
          <p style={{ color: "#666" }}>Manage your temple operations and bookings</p>
        </div>

        <div className="tabs-container">
          <Tabs value={tab} onChange={(e, newVal) => setTab(newVal)}>
            <Tab label="👤 Profile Management" />
            <Tab label="📅 Slot Management" />
            <Tab label="📊 Booking Management" />
          </Tabs>
        </div>

        {/* Tab 0: Profile Management */}
        {tab === 0 && profile && (
          <div className="tab-content">
            <div className="profile-form">
              <h3 style={{ color: "#ffc107", marginBottom: "20px" }}>Edit Profile</h3>
              <label style={{ display: "block", marginBottom: "10px", color: "#333", fontWeight: "600" }}>Name</label>
              <input
                type="text"
                value={formData.name || ""}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <label style={{ display: "block", marginBottom: "10px", color: "#333", fontWeight: "600" }}>Email</label>
              <input
                type="email"
                value={formData.email || ""}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <label style={{ display: "block", marginBottom: "10px", color: "#333", fontWeight: "600" }}>Phone</label>
              <input
                type="tel"
                value={formData.phone || ""}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
              
              {editPasswordMode ? (
                <>
                  <label style={{ display: "block", marginBottom: "10px", color: "#333", fontWeight: "600" }}>New Password</label>
                  <input
                    type="password"
                    value={formData.password || ""}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Enter new password"
                  />
                </>
              ) : null}
              
              <div style={{ display: "flex", gap: "10px" }}>
                <Button variant="contained" onClick={handleUpdateProfile} style={{ background: "#ffc107", color: "#333" }}>
                  💾 Save Changes
                </Button>
                <Button variant="outlined" onClick={() => setEditPasswordMode(!editPasswordMode)}>
                  🔐 {editPasswordMode ? "Cancel" : "Change Password"}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 1: Slot Management */}
        {tab === 1 && (
          <div className="tab-content">
            <h3 style={{ marginBottom: "20px", color: "#333" }}>Available Slots</h3>
            {slots.length === 0 ? (
              <div className="empty-state">
                <p>No slots available</p>
              </div>
            ) : (
              <div className="slot-grid">
                {slots.map((slot) => (
                  <div key={slot._id} className="slot-card">
                    <h3>{slot.templeId?.templeName || "Temple"}</h3>
                    <p><strong>📅 Date:</strong> {slot.date}</p>
                    <p><strong>⏰ Time:</strong> {slot.startTime} - {slot.endTime}</p>
                    <p><strong>👥 Available Seats:</strong> {slot.availableSeats}</p>
                    <p><strong>💰 Price:</strong> ₹ {slot.price}</p>
                    <div className="action-buttons">
                      <Button size="small" variant="outlined" color="error" onClick={() => handleDeleteSlot(slot._id)}>
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Booking Management */}
        {tab === 2 && (
          <div className="tab-content">
            <div className="organizer-stats">
              <div className="stat-box">
                <h3>📅 Total Bookings</h3>
                <div className="stat-number">{bookings.length}</div>
              </div>
              <div className="stat-box">
                <h3>💰 Total Revenue</h3>
                <div className="stat-number">₹ {bookings.reduce((sum, b) => sum + (b.slotId?.price || 0) * b.numberOfPeople, 0).toLocaleString()}</div>
              </div>
            </div>
            
            <h3 style={{ marginBottom: "20px", color: "#333" }}>Booking Details</h3>
            {bookings.length === 0 ? (
              <div className="empty-state">
                <p>No bookings yet</p>
              </div>
            ) : (
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Devotee</th>
                      <th>Temple</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>People</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking) => {
                      const slot = booking.slotId;
                      const total = (slot?.price || 0) * booking.numberOfPeople;
                      return (
                        <tr key={booking._id}>
                          <td>{booking.userId?.name || "Guest"}</td>
                          <td>{slot?.templeId?.templeName || "N/A"}</td>
                          <td>{slot?.date || "N/A"}</td>
                          <td>{slot?.startTime} - {slot?.endTime}</td>
                          <td>{booking.numberOfPeople}</td>
                          <td><strong>₹ {total}</strong></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
