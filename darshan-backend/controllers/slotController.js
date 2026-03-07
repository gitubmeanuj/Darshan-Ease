const DarshanSlot = require("../models/DarshanSlot");
const User = require("../models/User");
const Temple = require("../models/Temple");

// Create Slot
exports.createSlot = async (req, res) => {
  try {
    const slot = await DarshanSlot.create(req.body);

    return res.status(201).json({
      success: true,
      message: "Slot created successfully",
      data: slot,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Slots
exports.getSlots = async (req, res) => {
  try {
    const slots = await DarshanSlot.find().populate("templeId");

    return res.status(200).json({
      success: true,
      data: slots,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Organizer's Temple Slots Only
exports.getOrganizerSlots = async (req, res) => {
  try {
    // First check for admin-assigned temple
    const user = await User.findById(req.user.id);
    let templeId = user && user.managedTempleId ? user.managedTempleId : null;

    // Fallback: look for temple created by this organizer
    if (!templeId) {
      const temple = await Temple.findOne({ organizerId: req.user.id });
      templeId = temple ? temple._id : null;
    }

    if (!templeId) {
      return res.status(200).json({
        success: true,
        data: [],
      });
    }

    const slots = await DarshanSlot.find({ templeId }).populate("templeId");

    return res.status(200).json({
      success: true,
      data: slots,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// Get Slots By Temple
exports.getSlotByTemple = async (req, res) => {
  try {
    const slots = await DarshanSlot.find({
      templeId: req.params.templeId,
    });

    return res.status(200).json({
      success: true,
      data: slots,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Slot
exports.updateSlot = async (req, res) => {
  try {
    const slot = await DarshanSlot.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!slot) {
      return res.status(404).json({
        success: false,
        message: "Slot not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Slot updated successfully",
      data: slot,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Slot
exports.deleteSlot = async (req, res) => {
  try {
    const slot = await DarshanSlot.findByIdAndDelete(req.params.id);

    if (!slot) {
      return res.status(404).json({
        success: false,
        message: "Slot not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Slot deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};