const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  templeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Temple",
    required: true
  },
  eventName: {
    type: String,
    required: true
  },
  description: {
    type: String
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
  location: {
    type: String
  },
  capacity: {
    type: Number,
    default: 100
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
}, { timestamps: true });

module.exports = mongoose.model("Event", eventSchema);
