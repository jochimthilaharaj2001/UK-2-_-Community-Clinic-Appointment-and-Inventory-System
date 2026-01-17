import db from '../../config/db.js';

// Get pending prescriptions
export const getPrescriptions = async (req, res) => {
  const [rows] = await db.query(
    "SELECT * FROM prescriptions WHERE status='Pending'"
  );
  res.json(rows);
};

// Dispense medicine
export const dispenseMedicine = async (req, res) => {
  const { prescription_id } = req.body;

  // Fetch prescription items
  const [items] = await db.query(
    'SELECT * FROM prescription_items WHERE prescription_id=?',
    [prescription_id]
  );

  for (let item of items) {
    const [stock] = await db.query(
      'SELECT quantity FROM inventory WHERE medicine_name=?',
      [item.medicine_name]
    );

    if (stock.length === 0 || stock[0].quantity < item.quantity) {
      return res.status(400).json({
        message: `Out of stock: ${item.medicine_name}`
      });
    }

    await db.query(
      'UPDATE inventory SET quantity = quantity - ? WHERE medicine_name=?',
      [item.quantity, item.medicine_name]
    );
  }

  await db.query(
    "UPDATE prescriptions SET status='Dispensed' WHERE id=?",
    [prescription_id]
  );

  res.json({ message: 'Medicine dispensed successfully' });
};
