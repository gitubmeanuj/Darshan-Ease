const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  slotId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DarshanSlot",
    required: true
  },
  numberOfPeople: {
    type: Number,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);