const mongoose = require("mongoose");

const maintenanceSchema = new mongoose.Schema({
  templeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Temple",
    required: true
  },
  type: {
    type: String,
    enum: ["CLEANING", "REPAIR", "MAINTENANCE", "INSPECTION"],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ["PENDING", "IN_PROGRESS", "COMPLETED"],
    default: "PENDING"
  },
  priority: {
    type: String,
    enum: ["LOW", "MEDIUM", "HIGH"],
    default: "MEDIUM"
  },
  scheduledDate: {
    type: String,
    required: true
  },
  estimatedHours: {
    type: Number
  },
  assignedTo: {
    type: String
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
}, { timestamps: true });

module.exports = mongoose.model("Maintenance", maintenanceSchema);
