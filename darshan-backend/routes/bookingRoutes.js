 const express = require("express");
const router = express.Router();

const {
  createBooking,
  getMyBookings,
  getAllBookings
} = require("../controllers/bookingController");

const authMiddleware = require("../middleware/authMiddleware");

// create booking
router.post("/", authMiddleware, createBooking);

// logged-in user bookings
router.get("/my", authMiddleware, getMyBookings);

// admin / organizer bookings
router.get("/", authMiddleware, getAllBookings);

module.exports = router; 