import db from '../../config/db.js';

export const searchPatients = async (req, res) => {
    const { q } = req.query; // Search query
    if (!q) return res.json([]);

    try {
        const searchQuery = `%${q}%`;
        const [patients] = await db.query(`
            SELECT * FROM patients 
            WHERE name LIKE ? OR phone LIKE ? OR id LIKE ?
            LIMIT 10
        `, [searchQuery, searchQuery, searchQuery]);
        res.json(patients);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const registerPatient = async (req, res) => {
    const { name, age, gender, phone, email, address, medical_condition } = req.body;
    try {
        // Validation?
        const [result] = await db.query(
            'INSERT INTO patients (name, age, gender, phone, email, address, medical_condition) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [name, age, gender, phone, email, address, medical_condition]
        );
        res.status(201).json({ message: 'Patient registered', patientId: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
