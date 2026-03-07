const express = require("express");
const router = express.Router();

const {
  createBooking,
  getMyBookings,
  getAllBookings,
  cancelBooking
} = require("../controllers/bookingController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// create booking
router.post("/", authMiddleware, createBooking);

// logged-in user bookings
router.get("/my", authMiddleware, getMyBookings);

// cancel booking
router.delete("/:id", authMiddleware, cancelBooking);

// admin / organizer bookings (protected by role)
router.get("/", authMiddleware, roleMiddleware("ADMIN", "ORGANIZER"), getAllBookings);

module.exports = router;