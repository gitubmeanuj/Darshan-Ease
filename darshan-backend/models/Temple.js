const mongoose = require("mongoose");

const templeSchema = new mongoose.Schema({
  templeName: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String },
  image: { type: String, default: "/assets/images/temple1.jpg" },
  darshanStartTime: { type: String, required: true },
  darshanEndTime: { type: String, required: true },
  organizerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

module.exports = mongoose.model("Temple", templeSchema);