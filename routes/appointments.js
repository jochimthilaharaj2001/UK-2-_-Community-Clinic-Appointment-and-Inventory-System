// backend/routes/appointments.js
const express = require('express');
const router = express.Router();
const pool = require('../db');
const { authGuard, requireAnyRole } = require('../middleware/auth');

// Create appointment
router.post('/', authGuard, requireAnyRole('patient','staff','admin'), async (req, res) => {
  const { patient_id, doctor_id, start_time, end_time, reason } = req.body;
  if (!patient_id || !doctor_id || !start_time || !end_time) return res.status(400).json({ message: 'Missing fields' });

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // Check conflict
    const [conflict] = await conn.query(
      'SELECT id FROM appointments WHERE doctor_id=? AND start_time=? AND status <> "cancelled"',
      [doctor_id, start_time]
    );
    if (conflict.length) { await conn.rollback(); conn.release(); return res.status(409).json({ message: 'Slot taken' }); }

    const [result] = await conn.query(
      'INSERT INTO appointments (patient_id,doctor_id,start_time,end_time,reason) VALUES (?,?,?,?,?)',
      [patient_id, doctor_id, start_time, end_time, reason || null]
    );

    await conn.query('INSERT INTO audit_log (actor_id, action, details) VALUES (?,?,?)',
      [req.user.id, 'create_appointment', JSON.stringify({ appointmentId: result.insertId })]);

    await conn.commit();
    conn.release();
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    await conn.rollback().catch(()=>{});
    conn.release();
    console.error(err);
    res.status(500).json({ message: 'Error creating appointment' });
  }
});

// List appointments (filter)
router.get('/', authGuard, requireAnyRole('doctor','staff','admin','patient'), async (req, res) => {
  const { doctor_id, date, patient_id } = req.query;
  try {
    let q = `SELECT a.*, p.user_id AS p_uid, u.name AS patient_name, d.user_id AS doctor_uid
             FROM appointments a
             JOIN patients p ON a.patient_id = p.id
             JOIN users u ON p.user_id = u.id
             JOIN doctors d ON a.doctor_id = d.id`;
    const params = [];
    const cond = [];
    if (doctor_id) { cond.push('a.doctor_id=?'); params.push(doctor_id); }
    if (patient_id) { cond.push('a.patient_id=?'); params.push(patient_id); }
    if (date) { cond.push('DATE(a.start_time)=?'); params.push(date); }
    if (cond.length) q += ' WHERE ' + cond.join(' AND ');
    const [rows] = await pool.query(q, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Reschedule
router.put('/:id', authGuard, requireAnyRole('staff','patient','admin'), async (req, res) => {
  const id = req.params.id;
  const { start_time, end_time } = req.body;
  if (!start_time || !end_time) return res.status(400).json({ message: 'Missing times' });

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [apptRows] = await conn.query('SELECT * FROM appointments WHERE id=? FOR UPDATE', [id]);
    if (!apptRows.length) { await conn.rollback(); conn.release(); return res.status(404).json({ message: 'Appointment not found' }); }
    const appt = apptRows[0];

    const [conflict] = await conn.query(
      'SELECT id FROM appointments WHERE doctor_id=? AND start_time=? AND id<>? AND status <> "cancelled"',
      [appt.doctor_id, start_time, id]
    );
    if (conflict.length) { await conn.rollback(); conn.release(); return res.status(409).json({ message: 'Slot taken' }); }

    await conn.query('UPDATE appointments SET start_time=?, end_time=?, status="booked" WHERE id=?', [start_time, end_time, id]);
    await conn.query('INSERT INTO audit_log (actor_id, action, details) VALUES (?,?,?)',
      [req.user.id, 'reschedule_appointment', JSON.stringify({ appointmentId: id })]);

    await conn.commit();
    conn.release();
    res.json({ message: 'Rescheduled' });
  } catch (err) {
    await conn.rollback().catch(()=>{});
    conn.release();
    console.error(err);
    res.status(500).json({ message: 'Error rescheduling' });
  }
});

// Cancel appointment
router.delete('/:id', authGuard, requireAnyRole('staff','patient','admin'), async (req, res) => {
  try {
    await pool.query('UPDATE appointments SET status="cancelled" WHERE id=?', [req.params.id]);
    await pool.query('INSERT INTO audit_log (actor_id, action, details) VALUES (?,?,?)',
      [req.user.id, 'cancel_appointment', JSON.stringify({ appointmentId: req.params.id })]);
    res.json({ message: 'Cancelled' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error' });
  }
});

module.exports = router;
