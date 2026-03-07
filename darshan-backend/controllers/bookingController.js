const Booking = require("../models/Booking");
const DarshanSlot = require("../models/DarshanSlot");

// Create Booking
exports.createBooking = async (req, res) => {
  try {
    const { slotId, numberOfPeople } = req.body;

    const slot = await DarshanSlot.findById(slotId);

    if (!slot) {
      return res.status(404).json({
        success: false,
        message: "Slot not found"
      });
    }

    if (slot.availableSeats < numberOfPeople) {
      return res.status(400).json({
        success: false,
        message: "Not enough seats available"
      });
    }

    // reduce seats
    slot.availableSeats -= numberOfPeople;
    await slot.save();

    const booking = await Booking.create({
      userId: req.user.id,
      slotId,
      numberOfPeople
    });

    res.status(201).json({
      success: true,
      message: "Booking successful",
      data: booking
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// Get logged-in user bookings
exports.getMyBookings = async (req, res) => {
  try {

    const bookings = await Booking.find({ userId: req.user.id })
      .populate({
        path: "slotId",
        populate: { path: "templeId" }
      });

    res.json({
      success: true,
      data: bookings
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// Get all bookings (admin / organizer)
exports.getAllBookings = async (req, res) => {
  try {

    const bookings = await Booking.find()
      .populate("userId", "name email")
      .populate({
        path: "slotId",
        populate: { path: "templeId" }
      });

    res.json({
      success: true,
      data: bookings
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Cancel Booking (refund seats)
exports.cancelBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    // Verify user owns this booking
    if (booking.userId.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to cancel this booking"
      });
    }

    // Refund seats back to slot
    const slot = await DarshanSlot.findById(booking.slotId);
    if (slot) {
      slot.availableSeats += booking.numberOfPeople;
      await slot.save();
    }

    // Delete booking
    await Booking.findByIdAndDelete(bookingId);

    res.json({
      success: true,
      message: "Booking cancelled successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};