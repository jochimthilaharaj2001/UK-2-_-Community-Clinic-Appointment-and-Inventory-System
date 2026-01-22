import db from '../../config/db.js';

// Get all inventory items
export const getInventory = async (req, res) => {
    try {
        const [items] = await db.query('SELECT * FROM inventory ORDER BY name ASC');
        res.json(items);
    } catch (error) {
        console.error('Error fetching inventory:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Add new inventory item
export const addInventoryItem = async (req, res) => {
    try {
        const { name, category, stock, unit, reorderLevel, price, supplier, expiryDate, location } = req.body;

        // Determine status based on stock and expiry
        let status = 'in-stock';
        if (parseInt(stock) <= parseInt(reorderLevel)) status = 'low-stock';
        if (parseInt(stock) === 0) status = 'out-of-stock';

        // Simple expire check logic could be here or frontend, but status is also ENUM

        const [result] = await db.query(
            `INSERT INTO inventory (name, category, stock, unit, reorder_level, price, supplier, expiry_date, location, status) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [name, category, stock, unit, reorderLevel, price, supplier, expiryDate, location, status]
        );

        res.status(201).json({ id: result.insertId, message: 'Item added successfully' });
    } catch (error) {
        console.error('Error adding inventory item:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update inventory item
export const updateInventoryItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, category, stock, unit, reorderLevel, price, supplier, expiryDate, location } = req.body;

        let status = 'in-stock';
        if (parseInt(stock) <= parseInt(reorderLevel)) status = 'low-stock';
        if (parseInt(stock) === 0) status = 'out-of-stock';

        await db.query(
            `UPDATE inventory SET name=?, category=?, stock=?, unit=?, reorder_level=?, price=?, supplier=?, expiry_date=?, location=?, status=? WHERE id=?`,
            [name, category, stock, unit, reorderLevel, price, supplier, expiryDate, location, status, id]
        );

        res.json({ message: 'Item updated successfully' });
    } catch (error) {
        console.error('Error updating inventory item:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete inventory item
export const deleteInventoryItem = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM inventory WHERE id = ?', [id]);
        res.json({ message: 'Item deleted successfully' });
    } catch (error) {
        console.error('Error deleting inventory item:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
