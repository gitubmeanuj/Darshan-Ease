const Temple = require("../models/Temple");

// Create Temple
exports.createTemple = async (req, res) => {
  try {
    const temple = await Temple.create(req.body);

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
    const temple = await Temple.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!temple) {
      return res.status(404).json({
        success: false,
        message: "Temple not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Temple updated successfully",
      data: temple,
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
    const temple = await Temple.findByIdAndDelete(req.params.id);

    if (!temple) {
      return res.status(404).json({
        success: false,
        message: "Temple not found",
      });
    }

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