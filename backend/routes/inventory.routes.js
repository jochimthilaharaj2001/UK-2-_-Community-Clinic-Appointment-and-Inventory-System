const router = require("express").Router();
const db = require("../config/db");
const { auth } = require("../middleware/auth");

router.get("/", auth, async (req, res) => {
  const [rows] = await db.query("SELECT * FROM inventory");
  res.json(rows);
});

router.post("/", auth, async (req, res) => {
  const { name, quantity, expiry_date } = req.body;
  await db.query(
    "INSERT INTO inventory VALUES (NULL,?,?,?)",
    [name, quantity, expiry_date]
  );
  res.json({ message: "Added" });
});

module.exports = router;
