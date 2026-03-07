import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import toast from "react-hot-toast";
import { updateTemple } from "../services/templeService";

const styles = `
  .temple-form-group {
    margin-bottom: 20px;
  }
  .temple-form-label {
    display: block;
    margin-bottom: 8px;
    color: #333;
    font-weight: 600;
    font-size: 14px;
  }
  .temple-form-input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
    box-sizing: border-box;
  }
  .temple-form-input:focus {
    outline: none;
    border-color: #ffc107;
    box-shadow: 0 0 5px rgba(255, 193, 7, 0.3);
  }
  .temple-form-textarea {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
    box-sizing: border-box;
    font-family: Arial, sans-serif;
    resize: vertical;
    min-height: 80px;
  }
  .temple-form-textarea:focus {
    outline: none;
    border-color: #ffc107;
    box-shadow: 0 0 5px rgba(255, 193, 7, 0.3);
  }
  .image-preview {
    width: 100%;
    max-width: 200px;
    height: 150px;
    border: 2px dashed #ddd;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f9f9f9;
    margin-bottom: 10px;
  }
  .image-preview img {
    max-width: 100%;
    max-height: 100%;
    border-radius: 6px;
  }
  .image-input-label {
    display: inline-block;
    background: #ffc107;
    color: #333;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 600;
    transition: background 0.3s;
  }
  .image-input-label:hover {
    background: #ffb300;
  }
  .time-inputs {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
  }
  @media (max-width: 600px) {
    .time-inputs {
      grid-template-columns: 1fr;
    }
  }
`;

export default function EditTempleModal({ open, temple, onClose, onSuccess }) {
  const [formData, setFormData] = useState(temple || {});
  const [imagePreview, setImagePreview] = useState(temple?.image || null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    if (!formData.templeName || !formData.location || !formData.darshanStartTime || !formData.darshanEndTime) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      const updateData = {
        templeName: formData.templeName,
        location: formData.location,
        description: formData.description || "",
        darshanStartTime: formData.darshanStartTime,
        darshanEndTime: formData.darshanEndTime,
      };

      if (imagePreview && imagePreview.startsWith("data:")) {
        updateData.image = imagePreview;
      }

      await updateTemple(temple._id, updateData);
      toast.success("Temple updated successfully");
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update temple");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle style={{ background: "#ffc107", color: "#333", fontWeight: "bold" }}>
          ✏️ Edit Temple Details
        </DialogTitle>
        <DialogContent style={{ paddingTop: "20px" }}>
          {/* Temple Name */}
          <div className="temple-form-group">
            <label className="temple-form-label">Temple Name *</label>
            <input
              type="text"
              name="templeName"
              value={formData.templeName || ""}
              onChange={handleChange}
              className="temple-form-input"
              placeholder="Enter temple name"
            />
          </div>

          {/* Location */}
          <div className="temple-form-group">
            <label className="temple-form-label">Location *</label>
            <input
              type="text"
              name="location"
              value={formData.location || ""}
              onChange={handleChange}
              className="temple-form-input"
              placeholder="Enter city/state"
            />
          </div>

          {/* Description */}
          <div className="temple-form-group">
            <label className="temple-form-label">Description</label>
            <textarea
              name="description"
              value={formData.description || ""}
              onChange={handleChange}
              className="temple-form-textarea"
              placeholder="Enter temple description"
            />
          </div>

          {/* Darshan Timings */}
          <div className="temple-form-group">
            <label className="temple-form-label">Darshan Timings *</label>
            <div className="time-inputs">
              <div>
                <label className="temple-form-label" style={{ marginBottom: "5px" }}>Opening Time</label>
                <input
                  type="time"
                  name="darshanStartTime"
                  value={formData.darshanStartTime || ""}
                  onChange={handleChange}
                  className="temple-form-input"
                />
              </div>
              <div>
                <label className="temple-form-label" style={{ marginBottom: "5px" }}>Closing Time</label>
                <input
                  type="time"
                  name="darshanEndTime"
                  value={formData.darshanEndTime || ""}
                  onChange={handleChange}
                  className="temple-form-input"
                />
              </div>
            </div>
          </div>

          {/* Image Upload */}
          <div className="temple-form-group">
            <label className="temple-form-label">Temple Image</label>
            {imagePreview && (
              <div className="image-preview">
                <img src={imagePreview} alt="Preview" />
              </div>
            )}
            <label className="image-input-label">
              📸 Upload Image
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
            </label>
          </div>
        </DialogContent>
        <DialogActions style={{ padding: "15px" }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={loading}
            style={{ background: "#ffc107", color: "#333" }}
          >
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
