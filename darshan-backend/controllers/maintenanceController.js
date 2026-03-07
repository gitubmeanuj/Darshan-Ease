const Maintenance = require("../models/Maintenance");
const Temple = require("../models/Temple");

// Create Maintenance Request
exports.createMaintenance = async (req, res) => {
  try {
    const { templeId, type, description, priority, scheduledDate, estimatedHours, assignedTo } = req.body;

    const temple = await Temple.findById(templeId);
    if (!temple) {
      return res.status(404).json({
        success: false,
        message: "Temple not found"
      });
    }

    const maintenance = await Maintenance.create({
      templeId,
      type,
      description,
      priority,
      scheduledDate,
      estimatedHours,
      assignedTo,
      createdBy: req.user.id
    });

    res.status(201).json({
      success: true,
      message: "Maintenance request created",
      data: maintenance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get All Maintenance Requests
exports.getAllMaintenance = async (req, res) => {
  try {
    const maintenance = await Maintenance.find()
      .populate("templeId", "templeName location")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: maintenance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get Maintenance by Temple
exports.getMaintenanceByTemple = async (req, res) => {
  try {
    const { templeId } = req.params;

    const maintenance = await Maintenance.find({ templeId })
      .populate("templeId", "templeName location")
      .sort({ scheduledDate: 1 });

    res.json({
      success: true,
      data: maintenance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update Maintenance Status
exports.updateMaintenanceStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, estimatedHours, assignedTo } = req.body;

    const maintenance = await Maintenance.findByIdAndUpdate(
      id,
      { status, estimatedHours, assignedTo },
      { new: true }
    );

    if (!maintenance) {
      return res.status(404).json({
        success: false,
        message: "Maintenance request not found"
      });
    }

    res.json({
      success: true,
      message: "Maintenance updated successfully",
      data: maintenance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete Maintenance Request
exports.deleteMaintenance = async (req, res) => {
  try {
    const { id } = req.params;

    const maintenance = await Maintenance.findByIdAndDelete(id);

    if (!maintenance) {
      return res.status(404).json({
        success: false,
        message: "Maintenance request not found"
      });
    }

    res.json({
      success: true,
      message: "Maintenance request deleted"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
