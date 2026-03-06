const mongoose = require("mongoose");

const templeSchema = new mongoose.Schema({
  templeName: { type: String, required: true },
  location: { type: String, required: true },
  darshanStartTime: { type: String, required: true },
  darshanEndTime: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model("Temple", templeSchema);