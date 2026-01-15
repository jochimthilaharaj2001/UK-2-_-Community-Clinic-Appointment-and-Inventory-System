const router = require("express").Router();
const db = require("../config/db");
const { auth, role } = require("../middleware/auth");

router.get("/dashboard", auth, role("admin"), async (req, res) => {
  const [[a]] = await db.query("SELECT COUNT(*) total FROM appointments");
  const [[p]] = await db.query("SELECT COUNT(*) total FROM users WHERE role='patient'");
  const [[i]] = await db.query("SELECT COUNT(*) total FROM inventory");
  res.json({ appointments: a.total, patients: p.total, inventory: i.total });
});

module.exports = router;
