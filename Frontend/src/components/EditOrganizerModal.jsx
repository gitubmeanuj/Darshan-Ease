import { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, MenuItem } from "@mui/material";

export default function EditOrganizerModal({ open, organizer, onClose, onSave, temples = [] }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    managedTempleId: ""
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (organizer) {
      setFormData({
        name: organizer.name || "",
        email: organizer.email || "",
        phone: organizer.phone || "",
        managedTempleId: organizer.managedTempleId || ""
      });
    }
  }, [organizer, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.email.trim()) {
      alert("Please fill in all required fields");
      return;
    }

    setSaving(true);
    try {
      await onSave(formData);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Organizer</DialogTitle>
      <DialogContent>
        <div style={{ paddingTop: "20px" }}>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            select
            label="Assign Temple"
            name="managedTempleId"
            value={formData.managedTempleId}
            onChange={handleChange}
            margin="normal"
          >
            <MenuItem value="">No Temple Assigned</MenuItem>
            {temples.map((temple) => (
              <MenuItem key={temple._id} value={temple._id}>
                {temple.templeName}
              </MenuItem>
            ))}
          </TextField>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary" variant="contained" disabled={saving}>
          {saving ? "Saving..." : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
