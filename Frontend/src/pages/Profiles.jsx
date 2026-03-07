import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

const styles = `
  .profile-container { padding: 40px 20px; max-width: 500px; margin: 0 auto; }
  .profile-header { text-align: center; margin-bottom: 30px; }
  .profile-header h2 { font-size: 28px; color: #c97a20; margin-bottom: 10px; }
  .profile-card { background: white; border: 1px solid #ddd; border-radius: 8px; padding: 30px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
  .profile-field { margin-bottom: 20px; }
  .profile-field label { display: block; font-weight: bold; color: #333; margin-bottom: 6px; }
  .profile-field input { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px; }
  .profile-field input:focus { outline: none; border-color: #ff9800; box-shadow: 0 0 4px rgba(255, 152, 0, 0.2); }
  .profile-field .value { padding: 10px; background: #f5f5f5; border-radius: 4px; color: #333; }
  .btn { width: 100%; padding: 12px; border: none; border-radius: 4px; font-size: 16px; font-weight: bold; cursor: pointer; }
  .btn-primary { background: #ff9800; color: white; }
  .btn-primary:hover { background: #f57c00; }
  .btn-danger { background: #f44336; color: white; margin-top: 10px; }
  .btn-danger:hover { background: #da190b; }
  .alert { padding: 15px; border-radius: 4px; margin-bottom: 20px; }
  .alert-info { background: #e3f2fd; color: #1976d2; border-left: 4px solid #1976d2; }
`;

export default function Profile() {
  const { user, logout } = useContext(AuthContext);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(user || {});

  if (!user) {
    return (
      <div className="profile-container">
        <div className="alert alert-info">
          Please log in to view your profile.
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleCancel = () => {
    setEditing(false);
    setForm(user);
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
  };

  return (
    <>
      <style>{styles}</style>
      <div className="profile-container">
        <div className="profile-header">
          <h2>👤 My Profile</h2>
          <p style={{ color: "#666" }}>Manage your account information</p>
        </div>

        <div className="profile-card">
          <div className="profile-field">
            <label>Full Name</label>
            {editing ? (
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
              />
            ) : (
              <div className="value">{user.name}</div>
            )}
          </div>

          <div className="profile-field">
            <label>Email Address</label>
            <div className="value">{user.email}</div>
          </div>

          <div className="profile-field">
            <label>Phone Number</label>
            {editing ? (
              <input
                type="tel"
                name="phone"
                value={form.phone || ""}
                onChange={handleChange}
              />
            ) : (
              <div className="value">{user.phone || "Not provided"}</div>
            )}
          </div>

          <div className="profile-field">
            <label>Account Role</label>
            <div className="value" style={{ textTransform: "capitalize" }}>
              {user.role?.toLowerCase() || "User"}
            </div>
          </div>

          <div className="profile-field">
            <label>Member Since</label>
            <div className="value">
              {new Date().toLocaleDateString()}
            </div>
          </div>

          {!editing ? (
            <>
              <button 
                className="btn btn-primary"
                onClick={() => setEditing(true)}
              >
                ✏️ Edit Profile
              </button>
              <button 
                className="btn btn-danger"
                onClick={handleLogout}
              >
                🚪 Logout
              </button>
            </>
          ) : (
            <>
              <button 
                className="btn btn-primary"
                onClick={() => {
                  toast.info("Profile update coming soon");
                  setEditing(false);
                }}
              >
                💾 Save Changes
              </button>
              <button 
                className="btn btn-danger"
                onClick={handleCancel}
              >
                ❌ Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}