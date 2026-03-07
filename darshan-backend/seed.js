require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const Temple = require("./models/Temple");
const DarshanSlot = require("./models/DarshanSlot");
const connectDB = require("./config/db");

const seedDatabase = async () => {
  try {
    await connectDB();
    console.log("✅ Database connected");

    // Clear existing data (optional - comment out after first run)
    await User.deleteMany({});
    await Temple.deleteMany({});
    await DarshanSlot.deleteMany({});
    console.log("🗑️  Cleared existing data");

    // Create test users
    const hashedPassword = await bcrypt.hash("password123", 10);
    
    const users = await User.insertMany([
      {
        name: "John User",
        email: "user@example.com",
        phone: "9876543210",
        password: hashedPassword,
        role: "USER"
      },
      {
        name: "Admin Manager",
        email: "admin@example.com",
        phone: "9876543211",
        password: hashedPassword,
        role: "ADMIN"
      },
      {
        name: "Organizer Person",
        email: "organizer@example.com",
        phone: "9876543212",
        password: hashedPassword,
        role: "ORGANIZER"
      }
    ]);
    console.log("✅ Created 3 test users");

    // Create sample temples
    const temples = await Temple.insertMany([
      {
        templeName: "Badrinath",
        location: "Uttarakhand",
        description: "Ancient Hindu temple dedicated to Vishnu, located in the Garhwal Himalayas.",
        image: "/assets/images/Badrinath.jpg",
        darshanStartTime: "06:00",
        darshanEndTime: "18:00"
      },
      {
        templeName: "Rameswaram",
        location: "Tamil Nadu",
        description: "Coastal temple dedicated to Lord Shiva and an important pilgrimage site.",
        image: "/assets/images/Rameswaram.jpg",
        darshanStartTime: "07:00",
        darshanEndTime: "19:00"
      },
      {
        templeName: "Vaishno Devi",
        location: "Jammu & Kashmir",
        description: "Sacred shrine dedicated to the Hindu Goddess in the Trikuta Mountains.",
        image: "/assets/images/temple1.jpg",
        darshanStartTime: "05:00",
        darshanEndTime: "20:00"
      },
      {
        templeName: "Prem Mandir",
        location: "Mathura",
        description: "Sacred pilgrimage site and temple dedicated to Lord Krishna in Mathura, the birthplace of Lord Krishna.",
        image: "/assets/images/Vrindavan.jpg",
        darshanStartTime: "06:00",
        darshanEndTime: "19:00"
      },
      {
        templeName: "Kedarnath",
        location: "Uttarakhand",
        description: "One of the most sacred Hindu pilgrimage sites, dedicated to Lord Shiva in the Himalayas.",
        image: "/assets/images/Kedarnath.jpg",
        darshanStartTime: "06:00",
        darshanEndTime: "17:00"
      },
      {
        templeName: "Somnath",
        location: "Gujarat",
        description: "Ancient Shiva temple on the coast of Gujarat, one of the twelve Jyotirlingas.",
        image: "/assets/images/Somnath.jpg",
        darshanStartTime: "07:00",
        darshanEndTime: "18:30"
      },
      {
        templeName: "Kamakhya Devi",
        location: "Assam",
        description: "Ancient temple dedicated to the Hindu Goddess Kamakhya on the banks of the Brahmaputra River.",
        image: "/assets/images/KamakhyaDevi.jpg",
        darshanStartTime: "05:30",
        darshanEndTime: "19:00"
      },
      {
        templeName: "Kashi Vishwanath",
        location: "Uttar Pradesh",
        description: "One of the most sacred temples dedicated to Lord Shiva, located in Varanasi on the Ganges River.",
        image: "/assets/images/KashiVishwanath.jpg",
        darshanStartTime: "06:00",
        darshanEndTime: "19:30"
      },
      {
        templeName: "Meenakshi Temple",
        location: "Tamil Nadu",
        description: "Ancient temple dedicated to Goddess Meenakshi and Lord Shiva in Madurai.",
        image: "/assets/images/Meenakshi.jpg",
        darshanStartTime: "05:00",
        darshanEndTime: "21:00"
      }
    ]);
    console.log("✅ Created 9 sample temples");

    // Create sample slots
    const slots = await DarshanSlot.insertMany([
      {
        templeId: temples[0]._id,
        date: "2026-03-10",
        startTime: "08:00",
        endTime: "09:00",
        availableSeats: 50,
        price: 100
      },
      {
        templeId: temples[0]._id,
        date: "2026-03-10",
        startTime: "10:00",
        endTime: "11:00",
        availableSeats: 50,
        price: 100
      },
      {
        templeId: temples[0]._id,
        date: "2026-03-11",
        startTime: "08:00",
        endTime: "09:00",
        availableSeats: 50,
        price: 100
      },
      {
        templeId: temples[1]._id,
        date: "2026-03-10",
        startTime: "09:00",
        endTime: "10:00",
        availableSeats: 40,
        price: 150
      },
      {
        templeId: temples[1]._id,
        date: "2026-03-11",
        startTime: "15:00",
        endTime: "16:00",
        availableSeats: 40,
        price: 150
      },
      {
        templeId: temples[2]._id,
        date: "2026-03-10",
        startTime: "07:00",
        endTime: "08:00",
        availableSeats: 30,
        price: 200
      },
      {
        templeId: temples[2]._id,
        date: "2026-03-12",
        startTime: "14:00",
        endTime: "15:00",
        availableSeats: 30,
        price: 200
      },
      {
        templeId: temples[3]._id,
        date: "2026-03-10",
        startTime: "11:00",
        endTime: "12:00",
        availableSeats: 60,
        price: 50
      },
      {
        templeId: temples[4]._id,
        date: "2026-03-10",
        startTime: "08:00",
        endTime: "09:00",
        availableSeats: 45,
        price: 120
      },
      {
        templeId: temples[4]._id,
        date: "2026-03-11",
        startTime: "09:00",
        endTime: "10:00",
        availableSeats: 45,
        price: 120
      },
      {
        templeId: temples[5]._id,
        date: "2026-03-10",
        startTime: "07:30",
        endTime: "08:30",
        availableSeats: 55,
        price: 90
      },
      {
        templeId: temples[5]._id,
        date: "2026-03-12",
        startTime: "17:00",
        endTime: "18:00",
        availableSeats: 55,
        price: 90
      },
      {
        templeId: temples[6]._id,
        date: "2026-03-10",
        startTime: "06:00",
        endTime: "07:00",
        availableSeats: 40,
        price: 110
      },
      {
        templeId: temples[6]._id,
        date: "2026-03-13",
        startTime: "17:00",
        endTime: "18:00",
        availableSeats: 40,
        price: 110
      },
      {
        templeId: temples[7]._id,
        date: "2026-03-10",
        startTime: "07:00",
        endTime: "08:00",
        availableSeats: 70,
        price: 75
      },
      {
        templeId: temples[7]._id,
        date: "2026-03-11",
        startTime: "18:00",
        endTime: "19:00",
        availableSeats: 70,
        price: 75
      },
      {
        templeId: temples[8]._id,
        date: "2026-03-10",
        startTime: "05:30",
        endTime: "06:30",
        availableSeats: 80,
        price: 85
      },
      {
        templeId: temples[8]._id,
        date: "2026-03-12",
        startTime: "19:00",
        endTime: "20:00",
        availableSeats: 80,
        price: 85
      }
    ]);
    console.log("✅ Created 18 sample slots");

    console.log("\n🎉 Database seeded successfully!\n");
    console.log("📝 TEST USER CREDENTIALS:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("👤 USER          | user@example.com       | password123");
    console.log("👨‍💼 ADMIN         | admin@example.com      | password123");
    console.log("🏢 ORGANIZER     | organizer@example.com  | password123");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
    process.exit(1);
  }
};

seedDatabase();