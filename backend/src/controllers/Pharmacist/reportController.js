import db from '../../config/db.js';

export const inventoryReport = async (req, res) => {
  const [rows] = await db.query('SELECT * FROM inventory');
  res.json(rows);
};

export const lowStockReport = async (req, res) => {
  const [rows] = await db.query(
    'SELECT * FROM inventory WHERE quantity <= 100'
  );
  res.json(rows);
};

export const dispensedReport = async (req, res) => {
  const [rows] = await db.query(
    `SELECT 
      p.id,
      p.patient_id,
      pi.medicine_name,
      pi.quantity,
      p.created_at AS dispensed_date
     FROM prescriptions p
     JOIN prescription_items pi ON p.id = pi.prescription_id
     WHERE p.status = 'DISPENSED'`
  );
  res.json(rows);
};
