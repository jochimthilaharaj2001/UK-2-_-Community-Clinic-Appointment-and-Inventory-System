import db from '../../config/db.js';

// Get all inventory items
export const getInventory = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM inventory ORDER BY generic_name ASC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching inventory:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Add new inventory item
export const addMedicine = async (req, res) => {
  try {
    const {
      generic_name, brand_name, strength, batch_number,
      manufacturer, expiry_date, quantity, selling_price,
      reorder_level, location, category, unit
    } = req.body;

    const [result] = await db.query(
      `INSERT INTO inventory 
            (generic_name, brand_name, strength, batch_number, manufacturer, 
             expiry_date, quantity, selling_price, reorder_level, location, category, unit)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        generic_name,
        brand_name || null,
        strength || null,
        batch_number || null,
        manufacturer || null,
        expiry_date || null,
        quantity || 0,
        selling_price || 0,
        reorder_level || 10,
        location || null,
        category || null,
        unit || null
      ]
    );

    res.status(201).json({
      message: 'Item added successfully',
      itemId: result.insertId
    });
  } catch (error) {
    console.error('Error adding inventory item:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update inventory item
export const updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      generic_name, brand_name, strength, batch_number,
      manufacturer, expiry_date, quantity, selling_price,
      reorder_level, location, category, unit
    } = req.body;

    await db.query(
      `UPDATE inventory SET 
                generic_name = ?, brand_name = ?, strength = ?, batch_number = ?,
                manufacturer = ?, expiry_date = ?, quantity = ?, selling_price = ?,
                reorder_level = ?, location = ?, category = ?, unit = ?
            WHERE id = ?`,
      [
        generic_name, brand_name, strength, batch_number,
        manufacturer, expiry_date, quantity, selling_price,
        reorder_level, location, category, unit, id
      ]
    );

    res.json({ message: 'Inventory updated successfully' });
  } catch (error) {
    console.error('Error updating inventory:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete inventory item
export const deleteMedicine = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM inventory WHERE id = ?', [id]);
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting inventory item:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
