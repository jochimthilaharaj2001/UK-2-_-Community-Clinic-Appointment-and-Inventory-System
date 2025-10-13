// backend/routes/inventory.js
const express = require('express');
const router = express.Router();
const pool = require('../db');
const { authGuard, requireAnyRole } = require('../middleware/auth');

// List inventory
router.get('/', authGuard, requireAnyRole('staff','admin','doctor','patient'), async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM inventory ORDER BY name');
    res.json(rows);
  } catch (err) { console.error(err); res.status(500).json({ message: 'Err' }); }
});

// Add inventory (staff/admin)
router.post('/', authGuard, requireAnyRole('staff','admin'), async (req, res) => {
  const { name, description, quantity, unit, expiry_date, min_threshold } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO inventory (name,description,quantity,unit,expiry_date,min_threshold) VALUES (?,?,?,?,?,?)',
      [name, description || null, quantity || 0, unit || null, expiry_date || null, min_threshold || 0]
    );
    await pool.query('INSERT INTO audit_log (actor_id, action, details) VALUES (?,?,?)',
      [req.user.id, 'create_inventory', JSON.stringify({ id: result.insertId })]);
    res.status(201).json({ id: result.insertId });
  } catch (err) { console.error(err); res.status(500).json({ message: 'Err' }); }
});

// Update quantity
router.put('/:id/quantity', authGuard, requireAnyRole('staff','admin'), async (req, res) => {
  const { quantity } = req.body;
  try {
    await pool.query('UPDATE inventory SET quantity=? WHERE id=?', [quantity, req.params.id]);
    res.json({ message: 'Updated' });
  } catch (err) { console.error(err); res.status(500).json({ message: 'Err' }); }
});

module.exports = router;
