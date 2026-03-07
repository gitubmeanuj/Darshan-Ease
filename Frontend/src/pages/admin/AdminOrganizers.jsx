import { useState, useEffect } from "react";
import { getAllOrganizers, deleteOrganizer, getOrganizer, updateOrganizer, createOrganizer, assignTempleToOrganizer } from "../../services/adminServices";
import { getTemples } from "../../services/templeService";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, CircularProgress, MenuItem } from "@mui/material";
import toast from "react-hot-toast";
import EditOrganizerModal from "../../components/EditOrganizerModal";

const styles = `
  .admin-container { padding: 40px 20px; max-width: 1400px; margin: 0 auto; }
  .admin-header { margin-bottom: 30px; }
  .admin-header h1 { font-size: 32px; color: #c97a20; margin: 0 0 10px 0; }
  .admin-header p { color: #666; margin: 0; }
  .btn-add-organizer { background: #6a1b9a; color: white; padding: 10px 20px; border-radius: 4px; cursor: pointer; font-weight: 600; border: none; margin-bottom: 20px; margin-top: 15px; }
  .btn-add-organizer:hover { background: #4a0073; }
  .table-container { overflow-x: auto; margin-top: 20px; }
  .data-table { width: 100%; border-collapse: collapse; background: white; }
  .data-table th { background: #f5f5f5; padding: 15px; text-align: left; font-weight: 600; border: 1px solid #ddd; color: #333; }
  .data-table td { padding: 15px; border: 1px solid #ddd; color: #555; }
  .data-table tr:hover { background: #fafafa; }
  .data-table .row-number { font-weight: 600; color: #c97a20; width: 50px; }
  .data-table .organizer-name { font-weight: 500; }
  .data-table .organizer-email { color: #666; font-size: 13px; }
  .action-buttons { display: flex; gap: 8px; flex-wrap: wrap; }
  .loading-center { display: flex; justify-content: center; align-items: center; min-height: 300px; }
  .empty-state { text-align: center; padding: 60px 20px; color: #999; }
  .stat-box { background: linear-gradient(135deg, #f3e5f5, #e1bee7); padding: 15px 20px; border-radius: 8px; border-left: 4px solid #9c27b0; margin-bottom: 20px; display: inline-block; }
  .stat-box h3 { color: #9c27b0; margin: 0; font-size: 13px; font-weight: 600; }
  .stat-box .stat-number { font-size: 24px; font-weight: bold; color: #6a1b9a; margin: 8px 0 0 0; }
`;

export default function AdminOrganizers() {
  const [organizers, setOrganizers] = useState([]);
  const [temples, setTemples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrganizer, setSelectedOrganizer] = useState(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openAssignTempleModal, setOpenAssignTempleModal] = useState(false);
  const [viewOrganizer, setViewOrganizer] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [assigningTemple, setAssigningTemple] = useState(null);
  const [selectedTempleId, setSelectedTempleId] = useState("");
  const [addFormData, setAddFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: ""
  });
  const [adding, setAdding] = useState(false);

  // Fetch all organizers and temples
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [organizersRes, templesRes] = await Promise.all([
        getAllOrganizers(),
        getTemples()
      ]);
      setOrganizers(organizersRes.data.data || []);
      setTemples(templesRes.data.data || []);
    } catch (error) {
      toast.error("Failed to fetch data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Handle Add Organizer
  const handleAddOrganizer = async () => {
    try {
      if (!addFormData.name.trim() || !addFormData.email.trim() || !addFormData.password.trim()) {
        toast.error("Please fill all required fields");
        return;
      }

      setAdding(true);
      await createOrganizer(addFormData);
      toast.success("Organizer created successfully");
      setOpenAddModal(false);
      setAddFormData({ name: "", email: "", phone: "", password: "" });
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create organizer");
    } finally {
      setAdding(false);
    }
  };

  // Handle Edit - Fixed to properly fetch and display organizer
  const handleEdit = async (organizerId) => {
    try {
      console.log("Fetching organizer for edit:", organizerId);
      const response = await getOrganizer(organizerId);
      console.log("Organizer data received:", response.data);
      const organizerData = response.data.data;
      setSelectedOrganizer(organizerData);
      setTimeout(() => setOpenEditModal(true), 0);
    } catch (error) {
      console.error("Error fetching organizer:", error);
      console.error("Error response:", error.response?.data);
      toast.error(error.response?.data?.message || "Failed to fetch organizer details");
    }
  };

  // Handle View - Fixed to properly fetch and display organizer
  const handleView = async (organizerId) => {
    try {
      console.log("Fetching organizer for view:", organizerId);
      const response = await getOrganizer(organizerId);
      console.log("Organizer data received:", response.data);
      const organizerData = response.data.data;
      setViewOrganizer(organizerData);
      setTimeout(() => setOpenViewModal(true), 0);
    } catch (error) {
      console.error("Error fetching organizer:", error);
      console.error("Error response:", error.response?.data);
      toast.error(error.response?.data?.message || "Failed to fetch organizer details");
    }
  };

  // Handle Delete
  const handleDelete = async (organizerId) => {
    if (window.confirm("Are you sure you want to delete this organizer?")) {
      try {
        setDeleting(organizerId);
        await deleteOrganizer(organizerId);
        toast.success("Organizer deleted successfully");
        setOrganizers(organizers.filter(o => o._id !== organizerId));
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to delete organizer");
      } finally {
        setDeleting(null);
      }
    }
  };

  // Handle Update - Fixed to include temple assignment
  const handleUpdate = async (updatedData) => {
    try {
      await updateOrganizer(selectedOrganizer._id, updatedData);
      toast.success("Organizer updated successfully");
      setOpenEditModal(false);
      setSelectedOrganizer(null);
      
      // Refresh data
      fetchData();
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.response?.data?.message || "Failed to update organizer");
    }
  };

  // Handle Assign Temple
  const handleAssignTemple = (organizerId) => {
    const organizer = organizers.find(o => o._id === organizerId);
    if (organizer) {
      setSelectedOrganizer(organizer);
      // managedTempleId may be a populated object { _id, templeName } or a plain string ID
      const currentTempleId = organizer.managedTempleId
        ? (typeof organizer.managedTempleId === "object" ? organizer.managedTempleId._id : organizer.managedTempleId)
        : "";
      setSelectedTempleId(currentTempleId);
      setOpenAssignTempleModal(true);
    }
  };

  // Handle Save Temple Assignment
  const handleSaveTempleAssignment = async () => {
    try {
      setAssigningTemple(selectedOrganizer._id);
      const res = await assignTempleToOrganizer(selectedOrganizer._id, selectedTempleId);
      toast.success(selectedTempleId ? "Temple assigned successfully!" : "Temple unassigned successfully!");
      setOpenAssignTempleModal(false);
      setSelectedOrganizer(null);
      setSelectedTempleId("");
      
      // Refresh data to get updated organizer list
      fetchData();
    } catch (error) {
      console.error("Temple assignment error:", error);
      toast.error(error.response?.data?.message || "Failed to assign temple");
    } finally {
      setAssigningTemple(null);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="admin-container">
        <div className="admin-header">
          <h1>Organizers Management</h1>
          <p>Manage all registered temple and event organizers</p>
          <div className="stat-box">
            <h3>Total Organizers</h3>
            <div className="stat-number">{organizers.length}</div>
          </div>
        </div>

        <button className="btn-add-organizer" onClick={() => setOpenAddModal(true)}>
          ➕ Add Organizer
        </button>

        {loading ? (
          <div className="loading-center">
            <CircularProgress />
          </div>
        ) : organizers.length === 0 ? (
          <div className="empty-state">
            <p>No organizers found</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Organizer ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Managed Temple</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {organizers.map((organizer, index) => {
                  return (
                    <tr key={organizer._id}>
                      <td className="row-number">{index + 1}</td>
                      <td style={{ fontSize: '12px', color: '#999', fontFamily: 'monospace' }}>{organizer._id.substring(0, 8)}...</td>
                      <td className="organizer-name">{organizer.name}</td>
                      <td className="organizer-email">{organizer.email}</td>
                      <td>{organizer.phone || "-"}</td>
                      <td style={{ fontSize: '13px', color: organizer.managedTempleId ? '#2e7d32' : '#999', fontWeight: organizer.managedTempleId ? '600' : 'normal' }}>
                        {(() => {
                          const mti = organizer.managedTempleId;
                          if (!mti) return "No temple assigned";
                          // If populated object from backend
                          if (typeof mti === "object" && mti.templeName) return `🛕 ${mti.templeName}`;
                          // If plain string ID, look up in temples array
                          const found = temples.find(t => t._id === mti || t._id === mti?._id);
                          return found ? `🛕 ${found.templeName}` : "No temple assigned";
                        })()}
                      </td>
                      <td>
                        <span style={{
                          background: "#f3e5f5",
                          color: "#6a1b9a",
                          padding: "4px 10px",
                          borderRadius: "12px",
                          fontSize: "12px",
                          fontWeight: "600"
                        }}>
                          {organizer.role}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <Button 
                            size="small" 
                            variant="contained" 
                            color="info"
                            onClick={() => handleView(organizer._id)}
                          >
                            View
                          </Button>
                          <Button 
                            size="small" 
                            variant="contained" 
                            color="success"
                            onClick={() => handleEdit(organizer._id)}
                          >
                            Edit
                          </Button>
                          <Button
                            size="small"
                            variant="contained" 
                            color="primary"
                            onClick={() => handleAssignTemple(organizer._id)}
                          >
                            Temple
                          </Button>
                          <Button
                            size="small"
                            variant="contained" 
                            color="error"
                            onClick={() => handleDelete(organizer._id)}
                            disabled={deleting === organizer._id}
                          >
                            {deleting === organizer._id ? "Deleting..." : "Delete"}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Add Organizer Dialog */}
        <Dialog open={openAddModal} onClose={() => setOpenAddModal(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Add New Organizer</DialogTitle>
          <DialogContent>
            <div style={{ paddingTop: "20px" }}>
              <TextField
                fullWidth
                label="Name"
                value={addFormData.name}
                onChange={(e) => setAddFormData({ ...addFormData, name: e.target.value })}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={addFormData.email}
                onChange={(e) => setAddFormData({ ...addFormData, email: e.target.value })}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Phone"
                value={addFormData.phone}
                onChange={(e) => setAddFormData({ ...addFormData, phone: e.target.value })}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={addFormData.password}
                onChange={(e) => setAddFormData({ ...addFormData, password: e.target.value })}
                margin="normal"
                required
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => {
              setOpenAddModal(false);
              setAddFormData({ name: "", email: "", phone: "", password: "" });
            }}>Cancel</Button>
            <Button 
              onClick={handleAddOrganizer} 
              variant="contained" 
              color="primary"
              disabled={adding}
            >
              {adding ? "Creating..." : "Create Organizer"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Edit Organizer Modal - Always rendered, visibility controlled by open prop */}
        <EditOrganizerModal
          open={openEditModal}
          organizer={selectedOrganizer}
          temples={temples}
          onClose={() => {
            setOpenEditModal(false);
            setSelectedOrganizer(null);
          }}
          onSave={handleUpdate}
        />

        {/* View Organizer Modal */}
        <Dialog open={openViewModal} onClose={() => setOpenViewModal(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Organizer Details</DialogTitle>
          <DialogContent>
            {viewOrganizer && (
              <div style={{ paddingTop: "20px" }}>
                <div style={{ marginBottom: "15px" }}>
                  <strong>Name:</strong> {viewOrganizer.name}
                </div>
                <div style={{ marginBottom: "15px" }}>
                  <strong>Email:</strong> {viewOrganizer.email}
                </div>
                <div style={{ marginBottom: "15px" }}>
                  <strong>Phone:</strong> {viewOrganizer.phone || "-"}
                </div>
                <div style={{ marginBottom: "15px" }}>
                  <strong>Role:</strong>{" "}
                  <span style={{
                    background: "#f3e5f5",
                    color: "#6a1b9a",
                    padding: "4px 10px",
                    borderRadius: "12px",
                    fontSize: "12px",
                    fontWeight: "600"
                  }}>
                    {viewOrganizer.role}
                  </span>
                </div>
                <div style={{ marginBottom: "15px" }}>
                  <strong>Managed Temple:</strong>{" "}
                  {viewOrganizer.managedTempleId ? (
                    (() => {
                      const temple = temples.find(t => t._id === viewOrganizer.managedTempleId);
                      return temple ? temple.templeName : "Not found";
                    })()
                  ) : "No temple assigned"}
                </div>
                <div style={{ marginBottom: "15px" }}>
                  <strong>Organizer ID:</strong> {viewOrganizer._id}
                </div>
                <div style={{ marginBottom: "15px" }}>
                  <strong>Joined:</strong> {new Date(viewOrganizer.createdAt).toLocaleDateString()}
                </div>
              </div>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenViewModal(false)} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>

        {/* Assign Temple Dialog */}
        <Dialog open={openAssignTempleModal} onClose={() => setOpenAssignTempleModal(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Assign Temple to Organizer</DialogTitle>
          <DialogContent>
            {selectedOrganizer && (
              <div style={{ paddingTop: "20px" }}>
                <div style={{ marginBottom: "20px" }}>
                  <strong>Organizer:</strong> {selectedOrganizer.name}
                </div>
                <TextField
                  select
                  fullWidth
                  label="Select Temple"
                  value={selectedTempleId}
                  onChange={(e) => setSelectedTempleId(e.target.value)}
                  margin="normal"
                  required
                >
                  <MenuItem value="">-- No Temple --</MenuItem>
                  {temples.map((temple) => (
                    <MenuItem key={temple._id} value={temple._id}>
                      {temple.templeName}
                    </MenuItem>
                  ))}
                </TextField>
              </div>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => {
              setOpenAssignTempleModal(false);
              setSelectedOrganizer(null);
              setSelectedTempleId("");
            }}>Cancel</Button>
            <Button 
              onClick={handleSaveTempleAssignment} 
              variant="contained" 
              color="primary"
              disabled={assigningTemple !== null}
            >
              {assigningTemple ? "Assigning..." : "Assign"}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
}
