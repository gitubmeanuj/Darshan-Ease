import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  getOrganizerTemple,
  deleteTemple,
  getOrganizerSlots,
  createSlot,
  deleteSlot,
} from "../services/templeService";
import { getAllBookings } from "../services/bookingService";
import { getUserProfile, updateProfile } from "../services/userService";
import EditTempleModal from "../components/EditTempleModal";
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
  .breadcrumb { margin-bottom: 20px; font-size: 14px; color: #666; }
  .breadcrumb a { color: #ffc107; text-decoration: none; font-weight: 600; }
  .breadcrumb a:hover { text-decoration: underline; }
  .breadcrumb span { margin: 0 8px; }
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
  .btn-danger { background: #f44336; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-weight: 600; }
  .btn-danger:hover { background: #da190b; }
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
  .temple-details { background: white; padding: 30px; border-radius: 8px; border: 1px solid #ddd; }
  .temple-details h3 { color: #ffc107; margin-bottom: 20px; font-size: 24px; }
  .temple-info { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
  .temple-info-item { padding: 15px; background: #f9f9f9; border-radius: 6px; }
  .temple-info-item label { display: block; font-weight: 600; color: #666; font-size: 12px; margin-bottom: 5px; text-transform: uppercase; }
  .temple-info-item span { display: block; font-size: 15px; color: #333; }
  .temple-image-container { text-align: center; margin-bottom: 24px; }
  .temple-image-container img { max-width: 100%; max-height: 260px; object-fit: cover; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
  .temple-card-header { background: linear-gradient(135deg, #fff8e1, #fff3cd); border: 1px solid #ffe082; border-radius: 10px; padding: 20px 24px; margin-bottom: 20px; display:flex; align-items:center; gap: 12px; }
  .temple-card-header h3 { margin: 0; font-size: 22px; color: #f57f17; }
  .slot-management-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
`;

const EMPTY_SLOT = { date: "", startTime: "", endTime: "", availableSeats: "", price: "" };

export default function OrganizerDashboard() {
  const [tab, setTab] = useState(0);
  const [profile, setProfile] = useState(null);
  const [temple, setTemple] = useState(null);
  const [slots, setSlots] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editPasswordMode, setEditPasswordMode] = useState(false);
  const [editTempleOpen, setEditTempleOpen] = useState(false);
  const [createSlotOpen, setCreateSlotOpen] = useState(false);
  const [slotForm, setSlotForm] = useState(EMPTY_SLOT);
  const [slotSubmitting, setSlotSubmitting] = useState(false);
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
        const res = await getOrganizerTemple();
        setTemple(res.data.data);
      } else if (tab === 2) {
        // Fetch temple if not already loaded (needed for slot creation and display)
        if (!temple) {
          try {
            const templeRes = await getOrganizerTemple();
            setTemple(templeRes.data.data);
          } catch {
            // temple remains null; handled in UI
          }
        }
        const res = await getOrganizerSlots();
        setSlots(res.data.data || []);
      } else if (tab === 3) {
        const res = await getAllBookings();
        setBookings(res.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      if (tab === 1) {
        setTemple(null);
        const msg = error.response?.data?.message || "Failed to load temple data.";
        toast.error(msg);
      }
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

  const handleDeleteTemple = async () => {
    if (window.confirm("Are you sure you want to delete your temple? This action cannot be undone.")) {
      try {
        await deleteTemple(temple._id);
        toast.success("Temple deleted successfully");
        setTemple(null);
      } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.message || "Failed to delete temple");
      }
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

  const handleCreateSlot = async () => {
    if (!temple) {
      toast.error("No temple assigned. Cannot create slot.");
      return;
    }
    if (!slotForm.date || !slotForm.startTime || !slotForm.endTime || !slotForm.availableSeats || !slotForm.price) {
      toast.error("Please fill in all fields.");
      return;
    }
    try {
      setSlotSubmitting(true);
      await createSlot({
        templeId: temple._id,
        date: slotForm.date,
        startTime: slotForm.startTime,
        endTime: slotForm.endTime,
        availableSeats: Number(slotForm.availableSeats),
        price: Number(slotForm.price),
      });
      toast.success("Darshan slot created successfully!");
      setCreateSlotOpen(false);
      setSlotForm(EMPTY_SLOT);
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to create slot");
    } finally {
      setSlotSubmitting(false);
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
        <div className="breadcrumb">
          <Link to="/organizer/dashboard" style={{ color: "#ffc107", textDecoration: "none", fontWeight: "600" }}>📊 Dashboard</Link>
        </div>
        <div className="organizer-header">
          <h2>🏛️ Organizer Dashboard</h2>
          <p style={{ color: "#666" }}>Manage your temple, operations and bookings</p>
        </div>

        <div className="tabs-container">
          <Tabs value={tab} onChange={(e, newVal) => setTab(newVal)}>
            <Tab label="👤 Profile Management" />
            <Tab label="🛕 My Temple" />
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

        {/* Tab 1: My Temple */}
        {tab === 1 && (
          <div className="tab-content">
            {loading ? (
              <div className="loading-center">
                <CircularProgress />
              </div>
            ) : temple ? (
              <div className="temple-details">
                {/* Temple Card Header */}
                <div className="temple-card-header">
                  <span style={{ fontSize: "32px" }}>🛕</span>
                  <div>
                    <h3>{temple.templeName}</h3>
                    <span style={{ color: "#888", fontSize: "13px" }}>My Temple</span>
                  </div>
                </div>

                {/* Temple Image */}
                <div className="temple-image-container">
                  {temple.image ? (
                    <img
                      src={temple.image.startsWith("http") ? temple.image : `http://localhost:5000${temple.image}`}
                      alt={temple.templeName}
                      onError={(e) => { e.target.style.display = "none"; }}
                    />
                  ) : (
                    <div style={{ background: "#f5f5f5", height: "160px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", color: "#aaa", fontSize: "48px" }}>🛕</div>
                  )}
                </div>

                {/* Temple Info Grid */}
                <div className="temple-info">
                  <div className="temple-info-item">
                    <label>Temple Name</label>
                    <span>{temple.templeName}</span>
                  </div>
                  <div className="temple-info-item">
                    <label>Location</label>
                    <span>{temple.location || "—"}</span>
                  </div>
                  <div className="temple-info-item">
                    <label>Opening Time</label>
                    <span>{temple.darshanStartTime || "—"}</span>
                  </div>
                  <div className="temple-info-item">
                    <label>Closing Time</label>
                    <span>{temple.darshanEndTime || "—"}</span>
                  </div>
                </div>

                {/* Description */}
                <div className="temple-info-item" style={{ marginBottom: "20px" }}>
                  <label>Description</label>
                  <span style={{ lineHeight: "1.6" }}>{temple.description || "No description provided"}</span>
                </div>

                <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                  <Button
                    variant="contained"
                    onClick={() => setEditTempleOpen(true)}
                    style={{ background: "#ffc107", color: "#333", fontWeight: "600" }}
                  >
                    ✏️ Edit Temple
                  </Button>
                  <button className="btn-danger" onClick={handleDeleteTemple}>
                    🗑️ Delete Temple
                  </button>
                </div>
              </div>
            ) : (
              <div className="empty-state">
                <div style={{ fontSize: "64px", marginBottom: "16px" }}>🛕</div>
                <p style={{ fontSize: "18px", fontWeight: "600", marginBottom: "8px" }}>No temple assigned to your account yet</p>
                <p style={{ fontSize: "13px", color: "#aaa" }}>Contact admin to assign a temple to your account</p>
              </div>
            )}

            <EditTempleModal
              open={editTempleOpen}
              temple={temple}
              onClose={() => setEditTempleOpen(false)}
              onSuccess={() => fetchData()}
            />
          </div>
        )}

        {/* Tab 2: Slot Management */}
        {tab === 2 && (
          <div className="tab-content">
            <div className="slot-management-header">
              <h3 style={{ color: "#333", margin: 0 }}>
                Darshan Slots {temple ? `— ${temple.templeName}` : ""}
              </h3>
              <Button
                variant="contained"
                onClick={() => {
                  if (!temple) {
                    toast.error("No temple assigned. Please contact admin.");
                    return;
                  }
                  setCreateSlotOpen(true);
                }}
                style={{ background: "#ffc107", color: "#333", fontWeight: "600" }}
              >
                ➕ Create Slot
              </Button>
            </div>

            {loading ? (
              <div className="loading-center"><CircularProgress /></div>
            ) : slots.length === 0 ? (
              <div className="empty-state">
                <div style={{ fontSize: "48px", marginBottom: "12px" }}>📅</div>
                <p style={{ fontSize: "16px" }}>No darshan slots created yet</p>
                <p style={{ fontSize: "13px", color: "#aaa" }}>Click "Create Slot" to add the first slot for your temple</p>
              </div>
            ) : (
              <div className="slot-grid">
                {slots.map((slot) => (
                  <div key={slot._id} className="slot-card">
                    <h3>📅 {slot.date}</h3>
                    <p><strong>🏛️ Temple:</strong> {slot.templeId?.templeName || temple?.templeName || "—"}</p>
                    <p><strong>⏰ Time:</strong> {slot.startTime} – {slot.endTime}</p>
                    <p><strong>👥 Available Seats:</strong> {slot.availableSeats}</p>
                    <p><strong>💰 Price:</strong> ₹{slot.price}</p>
                    <div className="action-buttons">
                      <Button size="small" variant="outlined" color="error" onClick={() => handleDeleteSlot(slot._id)}>
                        🗑️ Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Booking Management */}
        {tab === 3 && (
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
            {loading ? (
              <div className="loading-center"><CircularProgress /></div>
            ) : bookings.length === 0 ? (
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
                    {bookings.map((booking) => (
                      <tr key={booking._id}>
                        <td>{booking.userId?.name || "Unknown"}</td>
                        <td>{booking.slotId?.templeId?.templeName || "Temple"}</td>
                        <td>{booking.slotId?.date}</td>
                        <td>{booking.slotId?.startTime} - {booking.slotId?.endTime}</td>
                        <td>{booking.numberOfPeople}</td>
                        <td>₹ {(booking.slotId?.price || 0) * booking.numberOfPeople}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Create Slot Dialog */}
      <Dialog open={createSlotOpen} onClose={() => setCreateSlotOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: "bold", color: "#f57f17" }}>
          ➕ Create Darshan Slot
          {temple && <span style={{ fontSize: "13px", color: "#888", fontWeight: "normal", marginLeft: "8px" }}>for {temple.templeName}</span>}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Date"
            type="date"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            value={slotForm.date}
            onChange={(e) => setSlotForm({ ...slotForm, date: e.target.value })}
          />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <TextField
              label="Start Time"
              type="time"
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
              value={slotForm.startTime}
              onChange={(e) => setSlotForm({ ...slotForm, startTime: e.target.value })}
            />
            <TextField
              label="End Time"
              type="time"
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
              value={slotForm.endTime}
              onChange={(e) => setSlotForm({ ...slotForm, endTime: e.target.value })}
            />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <TextField
              label="Available Seats"
              type="number"
              fullWidth
              margin="normal"
              inputProps={{ min: 1 }}
              value={slotForm.availableSeats}
              onChange={(e) => setSlotForm({ ...slotForm, availableSeats: e.target.value })}
            />
            <TextField
              label="Price (₹)"
              type="number"
              fullWidth
              margin="normal"
              inputProps={{ min: 0 }}
              value={slotForm.price}
              onChange={(e) => setSlotForm({ ...slotForm, price: e.target.value })}
            />
          </div>
        </DialogContent>
        <DialogActions sx={{ padding: "16px 24px" }}>
          <Button onClick={() => { setCreateSlotOpen(false); setSlotForm(EMPTY_SLOT); }} disabled={slotSubmitting}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleCreateSlot}
            disabled={slotSubmitting}
            style={{ background: "#ffc107", color: "#333", fontWeight: "600" }}
          >
            {slotSubmitting ? <CircularProgress size={20} /> : "✅ Create Slot"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
