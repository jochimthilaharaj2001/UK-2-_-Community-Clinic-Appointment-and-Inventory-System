const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

router.post("/login", async (req, res) => {
  const [rows] = await db.query(
    "SELECT * FROM users WHERE email=?",
    [req.body.email]
  );

  if (!rows.length) return res.sendStatus(401);

  const user = rows[0];
  const ok = await bcrypt.compare(req.body.password, user.password);
  if (!ok) return res.sendStatus(401);

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET
  );

  res.json({ token, user });
});

module.exports = router;
