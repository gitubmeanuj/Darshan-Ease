require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/db");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Serve static files (temple images and other assets)
app.use("/assets", express.static("assets"));

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/temples", require("./routes/templeRoutes"));
app.use("/api/slots", require("./routes/slotRoutes"));
app.use("/api/bookings", require("./routes/bookingRoutes"));
app.use("/api/events", require("./routes/eventRoutes"));
app.use("/api/maintenance", require("./routes/maintenanceRoutes"));
app.use("/api/users", require("./routes/userRoutes"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));