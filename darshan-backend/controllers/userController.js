const User = require("../models/User");
const bcrypt = require("bcryptjs");

// Get All Users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").populate("managedTempleId", "templeName");

    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get Users by Role
exports.getUsersByRole = async (req, res) => {
  try {
    const { role } = req.params;

    const validRoles = ["USER", "ADMIN", "ORGANIZER"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role"
      });
    }

    const users = await User.find({ role }).select("-password").populate("managedTempleId", "templeName");

    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update User
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, role, managedTempleId } = req.body;

    // Only include fields that were actually sent in the request
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (role !== undefined) updateData.role = role;
    if (managedTempleId !== undefined) {
      updateData.managedTempleId = managedTempleId || null;
    }

    console.log("[updateUser] id:", id, "updateData:", JSON.stringify(updateData));

    const user = await User.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    ).select("-password").populate("managedTempleId", "templeName");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    console.log("[updateUser] updated user managedTempleId:", user.managedTempleId);

    res.json({
      success: true,
      message: "User updated successfully",
      data: user
    });
  } catch (error) {
    console.error("[updateUser] error:", error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Assign Temple to Organizer (Admin only)
exports.assignTemple = async (req, res) => {
  try {
    const { id } = req.params;
    const { managedTempleId } = req.body;

    console.log("[assignTemple] organizerId:", id, "managedTempleId:", managedTempleId);

    const user = await User.findByIdAndUpdate(
      id,
      { $set: { managedTempleId: managedTempleId || null } },
      { new: true }
    ).select("-password").populate("managedTempleId", "templeName");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Organizer not found"
      });
    }

    console.log("[assignTemple] success — managedTempleId:", user.managedTempleId);

    res.json({
      success: true,
      message: managedTempleId ? "Temple assigned successfully" : "Temple unassigned",
      data: user
    });
  } catch (error) {
    console.error("[assignTemple] error:", error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// Delete User
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.json({
      success: true,
      message: "User deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Create User (by Admin)
exports.createUser = async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role: role || "USER"
    });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get Single User by ID (Admin)
exports.getUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get User Profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update Own Profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    const updateData = { name, email, phone };

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
