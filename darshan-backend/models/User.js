const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  role: {
    type: String,
    enum: ["USER", "ADMIN", "ORGANIZER"],
    default: "USER"
  },
  managedTempleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Temple",
    default: null
  }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);