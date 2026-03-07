const Temple = require("../models/Temple");

// Create Temple
exports.createTemple = async (req, res) => {
  try {
    const templeData = {
      ...req.body,
      organizerId: req.user.id
    };
    const temple = await Temple.create(templeData);

    return res.status(201).json({
      success: true,
      message: "Temple created successfully",
      data: temple,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Organizer's Temple
exports.getOrganizerTemple = async (req, res) => {
  try {
    // First, get the user to check if they have a managed temple assigned
    const User = require("../models/User");
    const user = await User.findById(req.user.id).populate("managedTempleId");
    
    if (user && user.managedTempleId) {
      // If organizer has a managed temple assigned by admin
      return res.status(200).json({
        success: true,
        data: user.managedTempleId,
      });
    }
    
    // Otherwise, look for temple created by this organizer
    const temple = await Temple.findOne({ organizerId: req.user.id });

    if (!temple) {
      return res.status(404).json({
        success: false,
        message: "No temple found for this organizer",
        data: null
      });
    }

    return res.status(200).json({
      success: true,
      data: temple,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Temples
exports.getTemples = async (req, res) => {
  try {
    const temples = await Temple.find();

    return res.status(200).json({
      success: true,
      data: temples,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Temple By ID
exports.getTempleById = async (req, res) => {
  try {
    const temple = await Temple.findById(req.params.id);

    if (!temple) {
      return res.status(404).json({
        success: false,
        message: "Temple not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: temple,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Temple
exports.updateTemple = async (req, res) => {
  try {
    const temple = await Temple.findById(req.params.id);

    if (!temple) {
      return res.status(404).json({
        success: false,
        message: "Temple not found",
      });
    }

    // Authorization check for organizers
    if (req.user.role === "ORGANIZER") {
      const User = require("../models/User");
      const user = await User.findById(req.user.id);
      const hasManagedTemple = user && user.managedTempleId &&
        user.managedTempleId.toString() === temple._id.toString();
      const isCreator = temple.organizerId &&
        temple.organizerId.toString() === req.user.id;
      if (!hasManagedTemple && !isCreator) {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to update this temple",
        });
      }
    }

    const updatedTemple = await Temple.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Temple updated successfully",
      data: updatedTemple,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Temple
exports.deleteTemple = async (req, res) => {
  try {
    const temple = await Temple.findById(req.params.id);

    if (!temple) {
      return res.status(404).json({
        success: false,
        message: "Temple not found",
      });
    }

    // Authorization check for organizers
    if (req.user.role === "ORGANIZER") {
      const User = require("../models/User");
      const user = await User.findById(req.user.id);
      const hasManagedTemple = user && user.managedTempleId &&
        user.managedTempleId.toString() === temple._id.toString();
      const isCreator = temple.organizerId &&
        temple.organizerId.toString() === req.user.id;
      if (!hasManagedTemple && !isCreator) {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to delete this temple",
        });
      }
    }

    await Temple.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Temple deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};