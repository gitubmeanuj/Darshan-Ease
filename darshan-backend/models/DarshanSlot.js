const mongoose = require("mongoose");

const darshanSlotSchema = new mongoose.Schema({
  templeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Temple",
    required: true
  },
  date: {
    type: String,
    required: true
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  availableSeats: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model("DarshanSlot", darshanSlotSchema);