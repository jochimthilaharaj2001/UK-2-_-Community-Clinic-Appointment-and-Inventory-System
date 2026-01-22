import db from '../../config/db.js';

export const getPrescriptionById = async (req, res) => {
  try {
    const { id } = req.params;

    // 1️⃣ Get prescription header with patient name
    const [prescriptions] = await db.query(
      `SELECT p.id, p.patient_id, pa.name as patientName, p.doctor_name, p.notes, p.status, p.created_at
       FROM prescriptions p
       LEFT JOIN patients pa ON p.patient_id = pa.id
       WHERE p.id = ?`,
      [id]
    );

    if (prescriptions.length === 0) {
      return res.status(404).json({ message: "Prescription not found" });
    }

    // 2️⃣ Get prescription items + medicine details with stock info
    const [items] = await db.query(
      `SELECT 
          pi.id,
          COALESCE(pi.medicine_id, m.id) as medicine_id,
          pi.quantity,
          m.generic_name,
          m.brand_name,
          m.strength,
          m.quantity as availableStock,
          m.selling_price
       FROM prescription_items pi
       LEFT JOIN inventory m ON (pi.medicine_id = m.id OR pi.medicine_name = m.generic_name)
       WHERE pi.prescription_id = ?`,
      [id]
    );

    res.json({
      id: prescriptions[0].id,
      patient_id: prescriptions[0].patient_id,
      patientName: prescriptions[0].patientName,
      doctor_name: prescriptions[0].doctor_name,
      notes: prescriptions[0].notes,
      status: prescriptions[0].status,
      created_at: prescriptions[0].created_at,
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

    if (!prescription_id) {
      return res.status(400).json({ message: "Prescription ID required" });
    }

    // Fetch prescription items with medicine_id
    const [items] = await db.query(
      `SELECT 
        pi.id,
        COALESCE(pi.medicine_id, m.id) as medicine_id,
        pi.quantity,
        m.generic_name,
        m.quantity as stock
       FROM prescription_items pi
       LEFT JOIN inventory m ON (pi.medicine_id = m.id OR pi.medicine_name = m.generic_name)
       WHERE pi.prescription_id = ?`,
      [prescription_id]
    );

    if (items.length === 0) {
      return res.status(404).json({ message: "Prescription items not found" });
    }

    // Check stock availability for all items
    for (let item of items) {
      if (item.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${item.generic_name}. Available: ${item.stock}, Required: ${item.quantity}`
        });
      }
    }

    // Deduct stock and log dispensing for each item
    for (let item of items) {
      // Get pharmacist ID from auth (use 1 as default if not authenticated)
      const pharmacistId = req.user?.id || 1;
      
      // Get the actual medicine ID - prefer the med_id from joined table
      const [medDetails] = await db.query(
        'SELECT id FROM inventory WHERE id = ? OR generic_name = ?',
        [item.medicine_id, item.generic_name]
      );
      
      if (medDetails.length === 0) {
        return res.status(400).json({
          message: `Medicine not found: ${item.generic_name}`
        });
      }
      
      const medicineId = medDetails[0].id;

      // Update inventory stock
      await db.query(
        'UPDATE inventory SET quantity = quantity - ? WHERE id = ?',
        [item.quantity, medicineId]
      );

      // Log the dispensing
      await db.query(
        `INSERT INTO dispense_logs (prescription_id, inventory_id, quantity_dispensed, dispensed_by)
         VALUES (?, ?, ?, ?)`,
        [prescription_id, medicineId, item.quantity, pharmacistId]
      );
    }

    // Update prescription status
    await db.query(
      "UPDATE prescriptions SET status = 'DISPENSED' WHERE id = ?",
      [prescription_id]
    );

    res.json({ message: 'Medicine dispensed successfully' });

  } catch (error) {
    console.error("Dispense medicine error:", error);
    res.status(500).json({ message: "Server error during dispensing" });
  }
};
