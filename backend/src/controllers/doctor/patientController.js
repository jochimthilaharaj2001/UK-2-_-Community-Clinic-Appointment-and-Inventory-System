import db from '../../config/db.js';

export const getDoctorPatients = async (req, res) => {
    // In a real scenario, we might only show patients assigned to this doctor.
    // However, the SRS/Frontend suggests a general view or patients visited.
    // Let's matching patients who have appointments with this doctor.
    const doctorId = req.user.id;
    try {
        const [patients] = await db.query(`
            SELECT DISTINCT p.* 
            FROM patients p
            JOIN appointments a ON p.id = a.patient_id
            WHERE a.doctor_id = ?
            ORDER BY p.name ASC
        `, [doctorId]);

        // If the doctor has no patients yet, maybe show all?
        // For privacy, strict mapping is better. If empty, return empty array.

        res.json(patients);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getPatientById = async (req, res) => {
    const { id } = req.params;
    try {
        const [patients] = await db.query('SELECT * FROM patients WHERE id = ?', [id]);
        if (patients.length === 0) return res.status(404).json({ message: 'Patient not found' });
        res.json(patients[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
