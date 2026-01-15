const router = require("express").Router();
const db = require("../config/db");
const { auth } = require("../middleware/auth");

router.post("/book", auth, async (req, res) => {
  const { patient_id, doctor_id, start_time, end_time } = req.body;
  await db.query(
    `INSERT INTO appointments VALUES (NULL,?,?,?,?)`,
    [patient_id, doctor_id, start_time, end_time]
  );
  res.json({ message: "Booked" });
});

router.get("/doctor/:id", auth, async (req, res) => {
  const [rows] = await db.query(
    "SELECT * FROM appointments WHERE doctor_id=?",
    [req.params.id]
  );
  res.json(rows);
});

module.exports = router;
