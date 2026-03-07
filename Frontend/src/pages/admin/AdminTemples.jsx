import { useState, useEffect, useCallback } from "react";
import { getTemples, getAllSlots } from "../../services/templeService";
import { getAllBookings } from "../../services/bookingService";
import { getAllUsers, createUser, deleteUser } from "../../services/userService";
import { getAllEvents, createEvent, deleteEvent } from "../../services/eventService";
import { getAllMaintenance, createMaintenance, deleteMaintenance } from "../../services/maintenanceService";
import { createTemple, deleteTemple, createSlot, deleteSlot } from "../../services/adminServices";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, CircularProgress, Tab, Tabs, MenuItem } from "@mui/material";
import toast from "react-hot-toast";

const styles = `
  .admin-container { padding: 40px 20px; max-width: 1400px; margin: 0 auto; }
  .admin-header { margin-bottom: 30px; }
  .admin-header h2 { font-size: 28px; color: #c97a20; margin-bottom: 10px; }
  .tabs-container { margin-bottom: 30px; border-bottom: 1px solid #ddd; }
  .tab-content { margin-top: 20px; }
  .admin-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 20px; }
  .admin-card { border: 1px solid #ddd; padding: 20px; border-radius: 8px; background: white; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
  .admin-card h3 { color: #c97a20; margin-bottom: 10px; }
  .admin-card p { margin: 8px 0; color: #666; font-size: 14px; }
  .admin-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 30px; }
  .stat-box { background: linear-gradient(135deg, #fff3e0, #ffe0b2); padding: 20px; border-radius: 8px; border-left: 4px solid #ff9800; }
  .stat-box h3 { color: #ff9800; margin: 0; font-size: 14px; font-weight: 600; }
  .stat-box .stat-number { font-size: 28px; font-weight: bold; color: #c97a20; margin: 10px 0; }
  .action-buttons { display: flex; gap: 8px; margin-top: 12px; }
  .btn-add { background: #ff9800; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; font-weight: 600; }
  .btn-add:hover { background: #f57c00; }
  .loading-center { display: flex; justify-content: center; align-items: center; min-height: 300px; }
  .empty-state { text-align: center; padding: 60px 20px; color: #666; }
  .table-container { overflow-x: auto; margin-top: 20px; }
  .data-table { width: 100%; border-collapse: collapse; }
  .data-table th { background: #f5f5f5; padding: 12px; text-align: left; font-weight: 600; border-bottom: 2px solid #ddd; }
  .data-table td { padding: 12px; border-bottom: 1px solid #ddd; }
  .data-table tr:hover { background: #fafafa; }
  .badge { display: inline-block; padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: bold; }
  .badge-pending { background: #fff3e0; color: #e65100; }
  .badge-completed { background: #e8f5e9; color: #2e7d32; }
  .badge-user { background: #e3f2fd; color: #1565c0; }
  .badge-organizer { background: #f3e5f5; color: #6a1b9a; }
`;

export default function AdminTemples() {
  const [tab, setTab] = useState(0);
  const [temples, setTemples] = useState([]);
  const [slots, setSlots] = useState([]);
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [events, setEvents] = useState([]);
  const [maintenance, setMaintenance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openTempleDialog, setOpenTempleDialog] = useState(false);
  const [openSlotDialog, setOpenSlotDialog] = useState(false);
  const [openUserDialog, setOpenUserDialog] = useState(false);
  const [openEventDialog, setOpenEventDialog] = useState(false);
  const [openMaintenanceDialog, setOpenMaintenanceDialog] = useState(false);
  const [formData, setFormData] = useState({});

  const availableImages = [
    { name: "Badrinath", path: "/assets/images/Badrinath.jpg" },
    { name: "Rameswaram", path: "/assets/images/Rameswaram.jpg" },
    { name: "Temple 1", path: "/assets/images/temple1.jpg" },
    { name: "Vrindavan", path: "/assets/images/Vrindavan.jpg" }
  ];

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      switch(tab) {
        case 0: {
          const res = await getTemples();
          setTemples(res.data.data || []);
          break;
        }
        case 1: {
          const res = await getAllSlots();
          setSlots(res.data.data || []);
          break;
        }
        case 2: {
          const res = await getAllUsers();
          setUsers(res.data.data || []);
          break;
        }
        case 3: {
          const res = await getAllEvents();
          setEvents(res.data.data || []);
          break;
        }
        case 4: {
          const res = await getAllMaintenance();
          setMaintenance(res.data.data || []);
          break;
        }
        case 5: {
          const res = await getAllBookings();
          setBookings(res.data.data || []);
          break;
        }
        default:
          break;
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

  const handleAddTemple = async () => {
    try {
      if (!formData.templeName || !formData.location || !formData.description) {
        toast.error("Please fill all required fields");
        return;
      }
      await createTemple(formData);
      toast.success("Temple created successfully");
      setOpenTempleDialog(false);
      setFormData({});
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error("Failed to create temple");
    }
  };

  const handleDeleteTemple = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        await deleteTemple(id);
        toast.success("Temple deleted");
        fetchData();
      } catch (error) {
        console.error(error);
        toast.error("Failed to delete temple");
      }
    }
  };

  const handleAddSlot = async () => {
    try {
      if (!formData.templeId || !formData.date || !formData.startTime || !formData.endTime || !formData.availableSeats || !formData.price) {
        toast.error("Please fill all required fields");
        return;
      }
      await createSlot(formData);
      toast.success("Slot created successfully");
      setOpenSlotDialog(false);
      setFormData({});
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error("Failed to create slot");
    }
  };

  const handleDeleteSlot = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        await deleteSlot(id);
        toast.success("Slot deleted");
        fetchData();
      } catch (error) {
        console.error(error);
        toast.error("Failed to delete slot");
      }
    }
  };

  const handleAddUser = async () => {
    try {
      if (!formData.name || !formData.email || !formData.password || !formData.role) {
        toast.error("Please fill all fields");
        return;
      }
      await createUser(formData);
      toast.success("User created successfully");
      setOpenUserDialog(false);
      setFormData({});
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error("Failed to create user");
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        await deleteUser(id);
        toast.success("User deleted");
        fetchData();
      } catch (error) {
        console.error(error);
        toast.error("Failed to delete user");
      }
    }
  };

  const handleAddEvent = async () => {
    try {
      if (!formData.templeId || !formData.eventName || !formData.date) {
        toast.error("Please fill required fields");
        return;
      }
      await createEvent(formData);
      toast.success("Event created successfully");
      setOpenEventDialog(false);
      setFormData({});
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error("Failed to create event");
    }
  };

  const handleDeleteEvent = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        await deleteEvent(id);
        toast.success("Event deleted");
        fetchData();
      } catch (error) {
        console.error(error);
        toast.error("Failed to delete event");
      }
    }
  };

  const handleAddMaintenance = async () => {
    try {
      if (!formData.templeId || !formData.type || !formData.scheduledDate) {
        toast.error("Please fill required fields");
        return;
      }
      await createMaintenance(formData);
      toast.success("Maintenance created");
      setOpenMaintenanceDialog(false);
      setFormData({});
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error("Failed to create maintenance");
    }
  };

  const handleDeleteMaintenance = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        await deleteMaintenance(id);
        toast.success("Maintenance deleted");
        fetchData();
      } catch (error) {
        console.error(error);
        toast.error("Failed to delete maintenance");
      }
    }
  };

  if (loading) {
    return <div className="loading-center"><CircularProgress /></div>;
  }

  return (
    <>
      <style>{styles}</style>
      <div className="admin-container">
        <div className="admin-header">
          <h2>⚙️ Admin Dashboard</h2>
          <p style={{ color: "#666" }}>Complete system management</p>
        </div>

        <div className="tabs-container">
          <Tabs value={tab} onChange={(_, newVal) => setTab(newVal)}>
            <Tab label="🏢 Temples" />
            <Tab label="📅 Slots" />
            <Tab label="👥 Users" />
            <Tab label="🎉 Events" />
            <Tab label="🔧 Maintenance" />
            <Tab label="📊 Bookings" />
          </Tabs>
        </div>

        {tab === 0 && (
          <div className="tab-content">
            <Button className="btn-add" onClick={() => setOpenTempleDialog(true)}>➕ Add Temple</Button>
            <div className="admin-grid">
              {temples.map((t) => (
                <div key={t._id} className="admin-card" style={{ overflow: "hidden" }}>
                  <img src={t.image} alt={t.templeName} style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "8px 8px 0 0", marginBottom: "10px" }} />
                  <h3>{t.templeName}</h3>
                  <p><strong>Location:</strong> {t.location}</p>
                  <p><strong>Desc:</strong> {t.description?.substring(0, 50)}...</p>
                  <div className="action-buttons">
                    <Button size="small" color="error" onClick={() => handleDeleteTemple(t._id)}>Delete</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 1 && (
          <div className="tab-content">
            <Button className="btn-add" onClick={() => setOpenSlotDialog(true)}>➕ Add Slot</Button>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Temple</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Seats</th>
                    <th>Price</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {slots.map((s) => (
                    <tr key={s._id}>
                      <td>{s.templeId?.templeName || "N/A"}</td>
                      <td>{s.date}</td>
                      <td>{s.startTime} - {s.endTime}</td>
                      <td>{s.availableSeats}</td>
                      <td>₹{s.price}</td>
                      <td>
                        <Button size="small" color="error" onClick={() => handleDeleteSlot(s._id)}>Delete</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 2 && (
          <div className="tab-content">
            <Button className="btn-add" onClick={() => setOpenUserDialog(true)}>➕ Add User</Button>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Role</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id}>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>{u.phone || "-"}</td>
                      <td><span className={`badge badge-${u.role === "USER" ? "user" : "organizer"}`}>{u.role}</span></td>
                      <td>
                        <Button size="small" color="error" onClick={() => handleDeleteUser(u._id)}>Delete</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 3 && (
          <div className="tab-content">
            <Button className="btn-add" onClick={() => setOpenEventDialog(true)}>➕ Add Event</Button>
            <div className="admin-grid">
              {events.map((e) => (
                <div key={e._id} className="admin-card">
                  <h3>{e.eventName}</h3>
                  <p><strong>Temple:</strong> {e.templeId?.templeName || "N/A"}</p>
                  <p><strong>Date:</strong> {e.date}</p>
                  <p><strong>Time:</strong> {e.startTime} - {e.endTime}</p>
                  <div className="action-buttons">
                    <Button size="small" color="error" onClick={() => handleDeleteEvent(e._id)}>Delete</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 4 && (
          <div className="tab-content">
            <Button className="btn-add" onClick={() => setOpenMaintenanceDialog(true)}>➕ Schedule Maintenance</Button>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Temple</th>
                    <th>Type</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {maintenance.map((m) => (
                    <tr key={m._id}>
                      <td>{m.templeId?.templeName || "N/A"}</td>
                      <td>{m.type}</td>
                      <td>{m.scheduledDate}</td>
                      <td><span className={`badge ${m.status === "COMPLETED" ? "badge-completed" : "badge-pending"}`}>{m.status}</span></td>
                      <td>
                        <Button size="small" color="error" onClick={() => handleDeleteMaintenance(m._id)}>Delete</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 5 && (
          <div className="tab-content">
            <div className="admin-stats">
              <div className="stat-box">
                <h3>📅 Total Bookings</h3>
                <div className="stat-number">{bookings.length}</div>
              </div>
              <div className="stat-box">
                <h3>💰 Revenue</h3>
                <div className="stat-number">₹ {bookings.reduce((sum, b) => sum + ((b.slotId?.price || 0) * b.numberOfPeople), 0).toLocaleString()}</div>
              </div>
            </div>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Temple</th>
                    <th>Date</th>
                    <th>People</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b._id}>
                      <td>{b.userId?.name || "Guest"}</td>
                      <td>{b.slotId?.templeId?.templeName || "N/A"}</td>
                      <td>{b.slotId?.date || "N/A"}</td>
                      <td>{b.numberOfPeople}</td>
                      <td>₹ {(b.slotId?.price || 0) * b.numberOfPeople}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <Dialog open={openTempleDialog} onClose={() => setOpenTempleDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Temple</DialogTitle>
        <DialogContent>
          <TextField label="Name" fullWidth margin="normal" value={formData.templeName || ""} onChange={(e) => setFormData({ ...formData, templeName: e.target.value })} />
          <TextField label="Location" fullWidth margin="normal" value={formData.location || ""} onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
          <TextField label="Description" fullWidth margin="normal" multiline rows={3} value={formData.description || ""} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
          <TextField select label="Image" fullWidth margin="normal" value={formData.image || ""} onChange={(e) => setFormData({ ...formData, image: e.target.value })}>
            <MenuItem value="">Select Image</MenuItem>
            {availableImages.map((img) => <MenuItem key={img.path} value={img.path}>{img.name}</MenuItem>)}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenTempleDialog(false)}>Cancel</Button>
          <Button onClick={handleAddTemple} variant="contained">Create</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openSlotDialog} onClose={() => setOpenSlotDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Slot</DialogTitle>
        <DialogContent>
          <TextField select label="Temple" fullWidth margin="normal" value={formData.templeId || ""} onChange={(e) => setFormData({ ...formData, templeId: e.target.value })} SelectProps={{ native: true }}>
            <option value="">Select</option>
            {temples.map((t) => <option key={t._id} value={t._id}>{t.templeName}</option>)}
          </TextField>
          <TextField label="Date" type="date" fullWidth margin="normal" InputLabelProps={{ shrink: true }} value={formData.date || ""} onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
          <TextField label="Start Time" type="time" fullWidth margin="normal" InputLabelProps={{ shrink: true }} value={formData.startTime || ""} onChange={(e) => setFormData({ ...formData, startTime: e.target.value })} />
          <TextField label="End Time" type="time" fullWidth margin="normal" InputLabelProps={{ shrink: true }} value={formData.endTime || ""} onChange={(e) => setFormData({ ...formData, endTime: e.target.value })} />
          <TextField label="Seats" type="number" fullWidth margin="normal" value={formData.availableSeats || ""} onChange={(e) => setFormData({ ...formData, availableSeats: parseInt(e.target.value) || 0 })} />
          <TextField label="Price" type="number" fullWidth margin="normal" value={formData.price || ""} onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSlotDialog(false)}>Cancel</Button>
          <Button onClick={handleAddSlot} variant="contained">Create</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openUserDialog} onClose={() => setOpenUserDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add User</DialogTitle>
        <DialogContent>
          <TextField label="Name" fullWidth margin="normal" value={formData.name || ""} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          <TextField label="Email" type="email" fullWidth margin="normal" value={formData.email || ""} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
          <TextField label="Phone" fullWidth margin="normal" value={formData.phone || ""} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
          <TextField label="Password" type="password" fullWidth margin="normal" value={formData.password || ""} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
          <TextField select label="Role" fullWidth margin="normal" value={formData.role || "USER"} onChange={(e) => setFormData({ ...formData, role: e.target.value })} SelectProps={{ native: true }}>
            <option value="USER">USER</option>
            <option value="ORGANIZER">ORGANIZER</option>
            <option value="ADMIN">ADMIN</option>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenUserDialog(false)}>Cancel</Button>
          <Button onClick={handleAddUser} variant="contained">Create</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openEventDialog} onClose={() => setOpenEventDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Event</DialogTitle>
        <DialogContent>
          <TextField select label="Temple" fullWidth margin="normal" value={formData.templeId || ""} onChange={(e) => setFormData({ ...formData, templeId: e.target.value })} SelectProps={{ native: true }}>
            <option value="">Select</option>
            {temples.map((t) => <option key={t._id} value={t._id}>{t.templeName}</option>)}
          </TextField>
          <TextField label="Event Name" fullWidth margin="normal" value={formData.eventName || ""} onChange={(e) => setFormData({ ...formData, eventName: e.target.value })} />
          <TextField label="Date" type="date" fullWidth margin="normal" InputLabelProps={{ shrink: true }} value={formData.date || ""} onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
          <TextField label="Start Time" type="time" fullWidth margin="normal" InputLabelProps={{ shrink: true }} value={formData.startTime || ""} onChange={(e) => setFormData({ ...formData, startTime: e.target.value })} />
          <TextField label="End Time" type="time" fullWidth margin="normal" InputLabelProps={{ shrink: true }} value={formData.endTime || ""} onChange={(e) => setFormData({ ...formData, endTime: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEventDialog(false)}>Cancel</Button>
          <Button onClick={handleAddEvent} variant="contained">Create</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openMaintenanceDialog} onClose={() => setOpenMaintenanceDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Schedule Maintenance</DialogTitle>
        <DialogContent>
          <TextField select label="Temple" fullWidth margin="normal" value={formData.templeId || ""} onChange={(e) => setFormData({ ...formData, templeId: e.target.value })} SelectProps={{ native: true }}>
            <option value="">Select</option>
            {temples.map((t) => <option key={t._id} value={t._id}>{t.templeName}</option>)}
          </TextField>
          <TextField select label="Type" fullWidth margin="normal" value={formData.type || ""} onChange={(e) => setFormData({ ...formData, type: e.target.value })} SelectProps={{ native: true }}>
            <option value="">Select</option>
            <option value="CLEANING">CLEANING</option>
            <option value="REPAIR">REPAIR</option>
            <option value="MAINTENANCE">MAINTENANCE</option>
            <option value="INSPECTION">INSPECTION</option>
          </TextField>
          <TextField label="Description" fullWidth margin="normal" multiline rows={3} value={formData.description || ""} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
          <TextField label="Date" type="date" fullWidth margin="normal" InputLabelProps={{ shrink: true }} value={formData.scheduledDate || ""} onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenMaintenanceDialog(false)}>Cancel</Button>
          <Button onClick={handleAddMaintenance} variant="contained">Schedule</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
