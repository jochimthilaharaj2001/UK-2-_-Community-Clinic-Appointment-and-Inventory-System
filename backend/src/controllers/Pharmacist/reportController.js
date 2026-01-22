import db from '../../config/db.js';

export const inventoryReport = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT 
        id,
        generic_name,
        brand_name,
        strength,
        batch_number,
        manufacturer,
        expiry_date,
        quantity,
        selling_price,
        created_at,
        CASE 
          WHEN expiry_date < CURDATE() THEN 'Expired'
          WHEN quantity = 0 THEN 'Out of Stock'
          WHEN quantity < 10 THEN 'Low Stock'
          ELSE 'In Stock'
        END as status
       FROM inventory 
       ORDER BY created_at DESC`
    );
    res.json(rows);
  } catch (error) {
    console.error("Inventory report error:", error);
    res.status(500).json({ message: 'Failed to load inventory report' });
  }
};

export const lowStockReport = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT 
        id,
        generic_name,
        brand_name,
        strength,
        batch_number,
        manufacturer,
        expiry_date,
        quantity,
        selling_price,
        created_at,
        CASE 
          WHEN expiry_date < CURDATE() THEN 'Expired'
          WHEN quantity = 0 THEN 'Out of Stock'
          ELSE 'Low Stock'
        END as status
       FROM inventory 
       WHERE quantity < 100
       ORDER BY quantity ASC`
    );
    res.json(rows);
  } catch (error) {
    console.error("Low stock report error:", error);
    res.status(500).json({ message: 'Failed to load low stock report' });
  }
};

export const dispensedReport = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT 
        p.id as prescription_id,
        p.patient_id,
        pa.name as patient_name,
        p.doctor_name,
        p.notes,
        p.status,
        dl.inventory_id,
        i.generic_name as medicine_name,
        i.strength,
        dl.quantity_dispensed as quantity,
        dl.dispensed_at as dispensed_date,
        ph.name as dispensed_by_name
       FROM prescriptions p
       LEFT JOIN patients pa ON p.patient_id = pa.id
       LEFT JOIN dispense_logs dl ON p.id = dl.prescription_id
       LEFT JOIN inventory i ON dl.inventory_id = i.id
       LEFT JOIN pharmacists ph ON dl.dispensed_by = ph.id
       WHERE p.status = 'DISPENSED'
       ORDER BY dl.dispensed_at DESC`
    );
    res.json(rows);
  } catch (error) {
    console.error("Dispensed report error:", error);
    res.status(500).json({ message: 'Failed to load dispensed report' });
  }
};
