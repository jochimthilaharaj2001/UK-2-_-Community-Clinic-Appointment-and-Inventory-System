import db from '../../config/db.js';

export const getPrescriptionById = async (req, res) => {
  try {
    const { id } = req.params;

    // 1️⃣ Get prescription header
    const [prescriptions] = await db.query(
      `SELECT id, patient_id, doctor_name, notes, created_at, status
       FROM prescriptions
       WHERE id = ?`,
      [id]
    );

    if (prescriptions.length === 0) {
      return res.status(404).json({ message: "Prescription not found" });
    }

    // 2️⃣ Get prescription items (NO JOIN)
    const [items] = await db.query(
      `SELECT 
         id,
         medicine_name, strength, quantity
       FROM prescription_items
       WHERE prescription_id = ?`,
      [id]
    );

    res.json({
      prescription: prescriptions[0],
      items
    });

  } catch (error) {
    console.error("Prescription retrieval error:", error);
    res.status(500).json({ message: "Server error" });
  }
};



// Dispense medicine
export const dispenseMedicine = async (req, res) => {
  try {
    const { prescription_id } = req.body;

    const [items] = await db.query(
      'SELECT medicine_name, strength, quantity FROM prescription_items WHERE prescription_id = ?',
      [prescription_id]
    );

    if (items.length === 0) {
      return res.status(400).json({ message: "No prescription items found" });
    }

    for (let item of items) {
      const [stock] = await db.query(
        `SELECT id, quantity 
         FROM inventory 
         WHERE generic_name = ? AND strength = ?
         LIMIT 1`,
        [item.medicine_name, item.strength]
      );

      if (stock.length === 0 || stock[0].quantity < item.quantity) {
        return res.status(400).json({
          message: `Out of stock: ${item.medicine_name} ${item.strength}`
        });
      }

      await db.query(
        'UPDATE inventory SET quantity = quantity - ? WHERE id = ?',
        [item.quantity, stock[0].id]
      );
    }

    await db.query(
      "UPDATE prescriptions SET status = 'DISPENSED' WHERE id = ?",
      [prescription_id]
    );

    res.json({ message: "Medicine dispensed successfully" });

  } catch (error) {
    console.error("Dispense error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

