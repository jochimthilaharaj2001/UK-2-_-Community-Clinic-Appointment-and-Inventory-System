import db from '../../config/db.js';

export const inventoryReport = async (req, res) => {
  const [rows] = await db.query('SELECT * FROM inventory');
  res.json(rows);
};

export const lowStockReport = async (req, res) => {
  const [rows] = await db.query(
    "SELECT * FROM inventory WHERE quantity <= 10"
  );
  res.json(rows);
};

export const dispensedReport = async (req, res) => {
  const [rows] = await db.query(
    "SELECT * FROM prescriptions WHERE status='Dispensed'"
  );
  res.json(rows);
};
