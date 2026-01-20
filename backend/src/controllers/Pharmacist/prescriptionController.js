import db from '../../config/db.js';

export const getPrescriptionById = async (req, res) => {
  try {
    const { id } = req.params;

    // 1️⃣ Get prescription header
    const [prescriptions] = await db.query(
      `SELECT id, patient_id, doctor_name, notes, created_at
       FROM prescriptions
       WHERE id = ?`,
      [id]
    );

    if (prescriptions.length === 0) {
      return res.status(404).json({ message: "Prescription not found" });
    }

    // 2️⃣ Get prescription items + medicine details
    const [items] = await db.query(
      `SELECT 
          pi.id,
          pi.quantity,
          pi.dosage,
          m.generic_name,
          m.brand_name,
          m.strength
       FROM prescription_items pi
       JOIN inventory m ON pi.medicine_id = m.id
       WHERE pi.prescription_id = ?`,
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
