// routes/portals.js
const express = require("express");
const path = require("path");
const router = express.Router();

// Portal Access (Login Page)
router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/portal-access.html"));
});

// Admin Dashboard
router.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/admin_dashboard.html"));
});

// Doctor Dashboard
router.get("/doctor", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/doctor-dashboard.html"));
});

// Patient Dashboard
router.get("/patient", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/patient-dashboard.html"));
});

// Receptionist Dashboard
router.get("/receptionist", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/receptionist-dashboard.html"));
});

// Pharmacist Dashboard
router.get("/pharmacist", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/pharmacist_dashboard.html"));
});

module.exports = router;
