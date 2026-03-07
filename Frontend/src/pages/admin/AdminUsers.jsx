import { useState, useEffect } from "react";
import { getAllUsers, deleteUser, getUser, updateUser } from "../../services/adminServices";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, CircularProgress } from "@mui/material";
import toast from "react-hot-toast";
import EditUserModal from "../../components/EditUserModal";

const styles = `
  .admin-container { padding: 40px 20px; max-width: 1400px; margin: 0 auto; }
  .admin-header { margin-bottom: 30px; }
  .admin-header h1 { font-size: 32px; color: #c97a20; margin: 0 0 10px 0; }
  .admin-header p { color: #666; margin: 0; }
  .table-container { overflow-x: auto; margin-top: 20px; }
  .data-table { width: 100%; border-collapse: collapse; background: white; }
  .data-table th { background: #f5f5f5; padding: 15px; text-align: left; font-weight: 600; border: 1px solid #ddd; color: #333; }
  .data-table td { padding: 15px; border: 1px solid #ddd; color: #555; }
  .data-table tr:hover { background: #fafafa; }
  .data-table .row-number { font-weight: 600; color: #c97a20; width: 50px; }
  .data-table .user-name { font-weight: 500; }
  .data-table .user-email { color: #666; font-size: 13px; }
  .action-buttons { display: flex; gap: 8px; flex-wrap: wrap; }
  .btn-action { padding: 6px 12px; border: none; border-radius: 4px; cursor: pointer; font-size: 12px; font-weight: 600; transition: all 0.2s; }
  .btn-edit { background: #4CAF50; color: white; }
  .btn-edit:hover { background: #45a049; }
  .btn-delete { background: #f44336; color: white; }
  .btn-delete:hover { background: #da190b; }
  .btn-view { background: #2196F3; color: white; }
  .btn-view:hover { background: #0b7dda; }
  .loading-center { display: flex; justify-content: center; align-items: center; min-height: 300px; }
  .empty-state { text-align: center; padding: 60px 20px; color: #999; }
  .stat-box { background: linear-gradient(135deg, #fff3e0, #ffe0b2); padding: 15px 20px; border-radius: 8px; border-left: 4px solid #ff9800; margin-bottom: 20px; display: inline-block; }
  .stat-box h3 { color: #ff9800; margin: 0; font-size: 13px; font-weight: 600; }
  .stat-box .stat-number { font-size: 24px; font-weight: bold; color: #c97a20; margin: 8px 0 0 0; }
`;

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [viewUser, setViewUser] = useState(null);
  const [deleting, setDeleting] = useState(null);

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await getAllUsers();
        setUsers(response.data.data || []);
      } catch (error) {
        toast.error("Failed to fetch users");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Handle Edit
  const handleEdit = async (userId) => {
    try {
      const response = await getUser(userId);
      setSelectedUser(response.data.data);
      setOpenEditModal(true);
    } catch (error) {
      toast.error("Failed to fetch user details");
    }
  };

  // Handle View
  const handleView = async (userId) => {
    try {
      const response = await getUser(userId);
      setViewUser(response.data.data);
      setOpenViewModal(true);
    } catch (error) {
      toast.error("Failed to fetch user details");
    }
  };

  // Handle Delete
  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        setDeleting(userId);
        await deleteUser(userId);
        toast.success("User deleted successfully");
        setUsers(users.filter(u => u._id !== userId));
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to delete user");
      } finally {
        setDeleting(null);
      }
    }
  };

  // Handle Update
  const handleUpdate = async (updatedData) => {
    try {
      await updateUser(selectedUser._id, updatedData);
      toast.success("User updated successfully");
      setOpenEditModal(false);
      
      // Refresh users list
      const response = await getAllUsers();
      setUsers(response.data.data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update user");
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="admin-container">
        <div className="admin-header">
          <h1>Users Management</h1>
          <p>Manage all registered platform users</p>
          <div className="stat-box">
            <h3>Total Users</h3>
            <div className="stat-number">{users.length}</div>
          </div>
        </div>

        {loading ? (
          <div className="loading-center">
            <CircularProgress />
          </div>
        ) : users.length === 0 ? (
          <div className="empty-state">
            <p>No users found</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>User ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={user._id}>
                    <td className="row-number">{index + 1}</td>
                    <td style={{ fontSize: '12px', color: '#999', fontFamily: 'monospace' }}>{user._id.substring(0, 8)}...</td>
                    <td className="user-name">{user.name}</td>
                    <td className="user-email">{user.email}</td>
                    <td>{user.phone || "-"}</td>
                    <td>
                      <span style={{
                        background: user.role === "ADMIN" ? "#ffebee" : "#e3f2fd",
                        color: user.role === "ADMIN" ? "#c62828" : "#1565c0",
                        padding: "4px 10px",
                        borderRadius: "12px",
                        fontSize: "12px",
                        fontWeight: "600"
                      }}>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn-action btn-view" onClick={() => handleView(user._id)}>
                          View
                        </button>
                        <button className="btn-action btn-edit" onClick={() => handleEdit(user._id)}>
                          Edit
                        </button>
                        <button
                          className="btn-action btn-delete"
                          onClick={() => handleDelete(user._id)}
                          disabled={deleting === user._id}
                        >
                          {deleting === user._id ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Edit User Modal */}
        {selectedUser && (
          <EditUserModal
            open={openEditModal}
            user={selectedUser}
            onClose={() => setOpenEditModal(false)}
            onSave={handleUpdate}
          />
        )}

        {/* View User Modal */}
        <Dialog open={openViewModal} onClose={() => setOpenViewModal(false)} maxWidth="sm" fullWidth>
          <DialogTitle>User Details</DialogTitle>
          <DialogContent>
            {viewUser && (
              <div style={{ paddingTop: "20px" }}>
                <div style={{ marginBottom: "15px" }}>
                  <strong>Name:</strong> {viewUser.name}
                </div>
                <div style={{ marginBottom: "15px" }}>
                  <strong>Email:</strong> {viewUser.email}
                </div>
                <div style={{ marginBottom: "15px" }}>
                  <strong>Phone:</strong> {viewUser.phone || "-"}
                </div>
                <div style={{ marginBottom: "15px" }}>
                  <strong>Role:</strong>{" "}
                  <span style={{
                    background: viewUser.role === "ADMIN" ? "#ffebee" : "#e3f2fd",
                    color: viewUser.role === "ADMIN" ? "#c62828" : "#1565c0",
                    padding: "4px 10px",
                    borderRadius: "12px",
                    fontSize: "12px",
                    fontWeight: "600"
                  }}>
                    {viewUser.role}
                  </span>
                </div>
                <div style={{ marginBottom: "15px" }}>
                  <strong>User ID:</strong> {viewUser._id}
                </div>
                <div style={{ marginBottom: "15px" }}>
                  <strong>Joined:</strong> {new Date(viewUser.createdAt).toLocaleDateString()}
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
      </div>
    </>
  );
}
