const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  createSlot,
  getSlots,
  getSlotByTemple,
  updateSlot,
  deleteSlot
} = require("../controllers/slotController");

router.post("/", authMiddleware, createSlot);
router.get("/", getSlots);
router.get("/temple/:templeId", getSlotByTemple);
router.put("/:id", authMiddleware, updateSlot);
router.delete("/:id", authMiddleware, deleteSlot);

module.exports = router;