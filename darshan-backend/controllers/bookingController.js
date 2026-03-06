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
      .populate("slotId");

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