/**
 * cleanBookings.js
 * Deletes all bookings where the associated userId no longer exists in the User collection.
 * Run once: node cleanBookings.js
 */

require("dotenv").config();
const mongoose = require("mongoose");

const Booking = require("./models/Booking");
const User    = require("./models/User");

async function run() {
  console.log("🔌 Connecting to MongoDB...");
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ Connected.\n");

  // Fetch all bookings
  const allBookings = await Booking.find({});
  console.log(`📋 Total bookings found: ${allBookings.length}`);

  if (allBookings.length === 0) {
    console.log("Nothing to clean up.");
    await mongoose.disconnect();
    return;
  }

  // Get unique userIds from all bookings
  const userIds = [...new Set(allBookings.map(b => b.userId?.toString()).filter(Boolean))];

  // Find which of those users actually exist
  const existingUsers = await User.find({ _id: { $in: userIds } }).select("_id");
  const existingUserIds = new Set(existingUsers.map(u => u._id.toString()));

  // Identify bookings whose user is missing
  const orphanedBookings = allBookings.filter(b => !existingUserIds.has(b.userId?.toString()));

  console.log(`👻 Orphaned bookings (unknown users): ${orphanedBookings.length}`);

  if (orphanedBookings.length === 0) {
    console.log("✅ No orphaned bookings found. Database is clean!");
    await mongoose.disconnect();
    return;
  }

  // Show what will be deleted
  console.log("\nBookings to be deleted:");
  orphanedBookings.forEach((b, i) => {
    console.log(`  ${i + 1}. Booking ID: ${b._id} | userId: ${b.userId} | slotId: ${b.slotId} | people: ${b.numberOfPeople} | created: ${b.createdAt?.toISOString().slice(0,10)}`);
  });

  // Delete them
  const ids = orphanedBookings.map(b => b._id);
  const result = await Booking.deleteMany({ _id: { $in: ids } });

  console.log(`\n🗑️  Deleted ${result.deletedCount} orphaned booking(s).`);
  console.log("✅ Cleanup complete!");

  await mongoose.disconnect();
}

run().catch(err => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});
