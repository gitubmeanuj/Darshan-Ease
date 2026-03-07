const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const {
  getAllUsers,
  getUsersByRole,
  createUser,
  updateUser,
  deleteUser,
  getUser,
  getUserProfile,
  updateProfile,
  assignTemple
} = require("../controllers/userController");

// User routes (must be before parameterized routes)
router.get("/profile/me", authMiddleware, getUserProfile);
router.put("/profile/update", authMiddleware, updateProfile);

// Admin routes - Specific routes before parameterized routes to avoid conflicts
router.get("/role/:role", authMiddleware, roleMiddleware("ADMIN"), getUsersByRole);
router.get("/", authMiddleware, roleMiddleware("ADMIN"), getAllUsers);
router.post("/", authMiddleware, roleMiddleware("ADMIN"), createUser);

// Parameterized routes - AFTER specific routes
router.get("/:id", authMiddleware, roleMiddleware("ADMIN"), getUser);
router.put("/:id", authMiddleware, roleMiddleware("ADMIN"), updateUser);
router.patch("/:id/assign-temple", authMiddleware, roleMiddleware("ADMIN"), assignTemple);
router.delete("/:id", authMiddleware, roleMiddleware("ADMIN"), deleteUser);

module.exports = router;
