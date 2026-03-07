const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const {
  createEvent,
  getAllEvents,
  getEventsByTemple,
  updateEvent,
  deleteEvent
} = require("../controllers/eventController");

// Admin only routes
router.post("/", authMiddleware, roleMiddleware("ADMIN"), createEvent);
router.get("/", authMiddleware, getAllEvents);
router.get("/temple/:templeId", authMiddleware, getEventsByTemple);
router.put("/:id", authMiddleware, roleMiddleware("ADMIN"), updateEvent);
router.delete("/:id", authMiddleware, roleMiddleware("ADMIN"), deleteEvent);

module.exports = router;
