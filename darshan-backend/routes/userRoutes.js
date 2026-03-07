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
  getUserProfile,
  updateProfile
} = require("../controllers/userController");

// Admin routes
router.get("/", authMiddleware, roleMiddleware("ADMIN"), getAllUsers);
router.get("/role/:role", authMiddleware, roleMiddleware("ADMIN"), getUsersByRole);
router.post("/", authMiddleware, roleMiddleware("ADMIN"), createUser);
router.put("/:id", authMiddleware, roleMiddleware("ADMIN"), updateUser);
router.delete("/:id", authMiddleware, roleMiddleware("ADMIN"), deleteUser);

// User routes
router.get("/profile/me", authMiddleware, getUserProfile);
router.put("/profile/update", authMiddleware, updateProfile);

module.exports = router;
