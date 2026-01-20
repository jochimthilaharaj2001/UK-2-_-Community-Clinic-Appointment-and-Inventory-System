import db from '../../config/db.js';

/**
 * GET all inventory
 */
export const getInventory = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM inventory ORDER BY created_at DESC'
    );
    res.json(rows);
  } catch (error) {
    console.error("GET INVENTORY ERROR:", error);
    res.status(500).json({ message: 'Failed to load inventory' });
  }
};

/**
 * ADD new medicine
 */
export const addMedicine = async (req, res) => {
  try {
    const {
      generic_name,
      brand_name,
      strength,
      batch_number,
      manufacturer,
      expiry_date,
      selling_price,
      quantity
    } = req.body;

    await db.query(
      `INSERT INTO inventory 
      (generic_name, brand_name, strength, batch_number, manufacturer, expiry_date, selling_price, quantity)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        generic_name,
        brand_name,
        strength,
        batch_number,
        manufacturer,
        expiry_date,
        selling_price,
        quantity
      ]
    );

    res.status(201).json({ message: 'Medicine added successfully' });
  } catch (error) {
    console.error("ADD MEDICINE ERROR:", error);
    res.status(500).json({ message: 'Failed to add medicine' });
  }
};

/**
 * UPDATE stock
 */
export const updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    await db.query(
      'UPDATE inventory SET quantity = ? WHERE id = ?',
      [quantity, id]
    );

    res.json({ message: 'Stock updated successfully' });
  } catch (error) {
    console.error("UPDATE STOCK ERROR:", error);
    res.status(500).json({ message: 'Failed to update stock' });
  }
};

// Delete medicine
export const deleteMedicine = async (req, res) => {
  const { id } = req.params;
  await db.query('DELETE FROM inventory WHERE id=?', [id]);
  res.json({ message: 'Medicine removed' });
};
