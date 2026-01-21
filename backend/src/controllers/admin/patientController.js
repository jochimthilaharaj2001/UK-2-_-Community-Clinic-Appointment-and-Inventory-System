import db from '../../config/db.js';

export const getAllPatients = async (req, res) => {
    try {
        const [patients] = await db.query('SELECT * FROM patients ORDER BY created_at DESC');
        res.json(patients);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const createPatient = async (req, res) => {
    const { name, age, gender, contact, email, address } = req.body; // Added contact/email/address derived from user management form
    // Note: Existing patients table only has name, age, gender. Migration might be needed to add contact info if not present.
    // Checking Clinic_System.sql:
    // CREATE TABLE patients (id, name, age, gender, created_at)
    // We need to add columns or store in limited fields.
    // Let's assume we might need to ALTER table in migration if we want these fields.
    // For now, inserting what we have.

    try {
        const [result] = await db.query(
            'INSERT INTO patients (name, age, gender) VALUES (?, ?, ?)',
            [name, age, gender]
        );
        res.status(201).json({ id: result.insertId, name, age, gender });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
