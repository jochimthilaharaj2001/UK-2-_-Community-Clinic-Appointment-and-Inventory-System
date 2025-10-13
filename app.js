// app.js
const express = require("express");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static assets (if you have /public folder for Tailwind, JS, images)
app.use(express.static(path.join(__dirname, "public")));

// Import routes
const portalRoutes = require("./routes/portals");
const authRoutes = require("./routes/auth");
const appointmentRoutes = require("./routes/appointments");
const inventoryRoutes = require("./routes/inventory");

// Use routes
app.use("/", portalRoutes);
app.use("/auth", authRoutes);
app.use("/appointments", appointmentRoutes);
app.use("/inventory", inventoryRoutes);

// Default route (fallback)
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "views", "portal-access.html"));
});

// Server start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Clinic System running on http://localhost:${PORT}`);
});
