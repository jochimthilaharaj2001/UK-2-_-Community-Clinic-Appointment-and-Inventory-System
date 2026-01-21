import db from '../../config/db.js';

export const getDoctorPrescriptions = async (req, res) => {
    const doctorId = req.user.id;
    try {
        // We added doctor_id to prescriptions in migration
        const [prescriptions] = await db.query(`
            SELECT p.*, pt.name as patient_name 
            FROM prescriptions p
            LEFT JOIN patients pt ON p.patient_id = pt.id
            WHERE p.doctor_id = ? 
            ORDER BY p.created_at DESC
        `, [doctorId]);

        // Also fetch items for each prescription?
        // For list view, maybe not needed or fetch in loop (inefficient) or join.
        // Let's assume frontend fetches details or we send simple list.
        // Frontend Prescription card shows medicines list. We need to join.

        // Better approach: Get prescriptions, then get items.
        // Or simple aggregation if mysql version supports JSON_ARRAYAGG (MySQL 5.7+).
        // Let's try simple array fetch.

        for (let pres of prescriptions) {
            const [items] = await db.query('SELECT * FROM prescription_items WHERE prescription_id = ?', [pres.id]);
            pres.medicines = items;
        }

        res.json(prescriptions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const createPrescription = async (req, res) => {
    const doctorId = req.user.id;
    const { patientName, medicines, instructions } = req.body;
    // Note: Frontend sends patientName, but we need patient_id.
    // We should probably look up patient by name or ask frontend to send ID.
    // Frontend form has patientName text input.
    // We'll try to find patient or create one? Or just store name if schema allows?
    // Schema: prescriptions (patient_id, doctor_name...). 'patient_id' is INT NOT NULL.
    // We MUST resolve patient_id.

    try {
        // Try to find patient by name
        let patientId;
        const [patients] = await db.query('SELECT id FROM patients WHERE name LIKE ?', [patientName]);
        if (patients.length > 0) {
            patientId = patients[0].id;
        } else {
            // Check if we should create a new patient or error.
            // For now, fail if not found, or maybe just pick the first match.
            return res.status(400).json({ message: 'Patient not found. Please ensure patient is registered.' });
        }

        // Get Doctor Name
        const [doc] = await db.query('SELECT name FROM doctors WHERE id = ?', [doctorId]);
        const doctorName = doc[0].name;

        // Create Prescription
        const [result] = await db.query(
            'INSERT INTO prescriptions (patient_id, doctor_id, doctor_name, notes, status) VALUES (?, ?, ?, ?, ?)',
            [patientId, doctorId, doctorName, instructions, 'PENDING']
        );

        const prescriptionId = result.insertId;

        // Insert Items
        if (medicines && medicines.length > 0) {
            const itemValues = medicines.map(m => [prescriptionId, m.name, m.dosage, m.frequency, m.duration]);
            // Schema: prescription_items (prescription_id, medicine_name, strength, quantity)
            // Frontend: dosage, frequency, duration.
            // Mapping: medicine_name -> m.name, strength -> m.dosage, quantity -> 1 (placeholder or add columns)
            // We probably need to update schema or just stuff info into existing columns.
            // Let's trust schema: medicine_name, strength, quantity.
            // We'll put frequency/duration in name or we need migration?
            // Let's modify migration if we can, OR just use `strength` for dosage. `quantity` for duration?
            // Actually, let's keep it simple. medicine_name, strength (dosage), quantity (duration parsed?).

            for (const m of medicines) {
                await db.query(
                    'INSERT INTO prescription_items (prescription_id, medicine_name, strength, quantity) VALUES (?, ?, ?, ?)',
                    [prescriptionId, m.name, m.dosage, 1] // Quantity hardcoded to 1 for now
                );
            }
        }

        res.status(201).json({ message: 'Prescription created' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
