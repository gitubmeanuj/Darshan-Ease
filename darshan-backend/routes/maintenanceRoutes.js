const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const {
  createMaintenance,
  getAllMaintenance,
  getMaintenanceByTemple,
  updateMaintenanceStatus,
  deleteMaintenance
} = require("../controllers/maintenanceController");

// Admin only routes
router.post("/", authMiddleware, roleMiddleware("ADMIN"), createMaintenance);
router.get("/", authMiddleware, getAllMaintenance);
router.get("/temple/:templeId", authMiddleware, getMaintenanceByTemple);
router.put("/:id", authMiddleware, roleMiddleware("ADMIN"), updateMaintenanceStatus);
router.delete("/:id", authMiddleware, roleMiddleware("ADMIN"), deleteMaintenance);

module.exports = router;
