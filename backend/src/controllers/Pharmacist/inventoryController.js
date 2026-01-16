import db from '../../config/db.js';

// Get all medicines
export const getInventory = async (req, res) => {
  const [rows] = await db.query('SELECT * FROM inventory');
  res.json(rows);
};

// Add medicine
export const addMedicine = async (req, res) => {
  const { medicine_name, category, quantity, unit_price, expiry_date } = req.body;

  await db.query(
    `INSERT INTO inventory 
     (medicine_name, category, quantity, unit_price, expiry_date, status)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      medicine_name,
      category,
      quantity,
      unit_price,
      expiry_date,
      quantity <= 10 ? 'Low Stock' : 'Available'
    ]
  );

  res.json({ message: 'Medicine added successfully' });
};

// Update medicine stock
export const updateStock = async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;

  await db.query(
    'UPDATE inventory SET quantity=?, status=? WHERE id=?',
    [quantity, quantity <= 10 ? 'Low Stock' : 'Available', id]
  );

  res.json({ message: 'Inventory updated' });
};

// Delete medicine
export const deleteMedicine = async (req, res) => {
  const { id } = req.params;
  await db.query('DELETE FROM inventory WHERE id=?', [id]);
  res.json({ message: 'Medicine removed' });
};
