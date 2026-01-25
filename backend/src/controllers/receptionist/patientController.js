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
    const {
        firstName, lastName, dateOfBirth, gender, maritalStatus,
        phone, email, address, emergencyContact, emergencyPhone,
        bloodGroup, allergies, medicalHistory, currentMedications,
        insuranceProvider, insuranceId, policyNumber,
        primaryDoctor, referralSource, notes
    } = req.body;

    try {
        const name = `${firstName} ${lastName}`;
        const [result] = await db.query(
            `INSERT INTO patients (
                name, first_name, last_name, date_of_birth, gender, marital_status,
                phone, email, address, emergency_contact, emergency_phone,
                blood_group, allergies, medical_history, current_medications,
                insurance_provider, insurance_id, policy_number,
                primary_doctor, referral_source, notes
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                name, firstName, lastName, dateOfBirth || null, gender || null, maritalStatus || null,
                phone || null, email || null, address || null, emergencyContact || null, emergencyPhone || null,
                bloodGroup || null, allergies || null, medicalHistory || null, currentMedications || null,
                insuranceProvider || null, insuranceId || null, policyNumber || null,
                primaryDoctor || null, referralSource || null, notes || null
            ]
        );
        res.status(201).json({ message: 'Patient registered', patientId: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getAllPatients = async (req, res) => {
    try {
        const [patients] = await db.query('SELECT * FROM patients ORDER BY created_at DESC');
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
        if (patients.length === 0) {
            return res.status(404).json({ message: 'Patient not found' });
        }
        res.json(patients[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const updatePatient = async (req, res) => {
    const { id } = req.params;
    const {
        firstName, lastName, dateOfBirth, gender, maritalStatus,
        phone, email, address, emergencyContact, emergencyPhone,
        bloodGroup, allergies, medicalHistory, currentMedications,
        insuranceProvider, insuranceId, policyNumber,
        primaryDoctor, referralSource, notes
    } = req.body;

    try {
        const name = `${firstName} ${lastName}`;
        await db.query(
            `UPDATE patients SET 
                name = ?, first_name = ?, last_name = ?, date_of_birth = ?, gender = ?, marital_status = ?,
                phone = ?, email = ?, address = ?, emergency_contact = ?, emergency_phone = ?,
                blood_group = ?, allergies = ?, medical_history = ?, current_medications = ?,
                insurance_provider = ?, insurance_id = ?, policy_number = ?,
                primary_doctor = ?, referral_source = ?, notes = ?
            WHERE id = ?`,
            [
                name, firstName, lastName, dateOfBirth || null, gender || null, maritalStatus || null,
                phone || null, email || null, address || null, emergencyContact || null, emergencyPhone || null,
                bloodGroup || null, allergies || null, medicalHistory || null, currentMedications || null,
                insuranceProvider || null, insuranceId || null, policyNumber || null,
                primaryDoctor || null, referralSource || null, notes || null,
                id
            ]
        );
        res.json({ message: 'Patient updated' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const deletePatient = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM patients WHERE id = ?', [id]);
        res.json({ message: 'Patient deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
