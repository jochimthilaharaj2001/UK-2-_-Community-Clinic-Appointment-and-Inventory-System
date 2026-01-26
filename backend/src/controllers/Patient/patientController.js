import db from '../../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const [patients] = await db.query('SELECT * FROM patients WHERE email = ?', [email]);
        if (patients.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const patient = patients[0];

        // Use default password if not set in DB for testing, or use bcrypt
        // Check if password exists in DB first
        if (!patient.password) {
            return res.status(401).json({ message: 'Account not set up' });
        }

        const isMatch = await bcrypt.compare(password, patient.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: patient.id, role: 'patient' }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, patient: { id: patient.id, name: patient.name, email: patient.email } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getProfile = async (req, res) => {
    try {
        const [patients] = await db.query('SELECT id, name, email, phone, gender, dob, address, blood_type FROM patients WHERE id = ?', [req.user.id]);
        if (patients.length === 0) return res.status(404).json({ message: 'Patient not found' });
        res.json(patients[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateProfile = async (req, res) => {
    const { name, phone, gender, dob, address, blood_type } = req.body;
    try {
        await db.query(
            'UPDATE patients SET name = ?, phone = ?, gender = ?, dob = ?, address = ?, blood_type = ? WHERE id = ?',
            [name, phone, gender, dob, address, blood_type, req.user.id]
        );
        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    try {
        const [patients] = await db.query('SELECT password FROM patients WHERE id = ?', [req.user.id]);
        const patient = patients[0];
        const isMatch = await bcrypt.compare(oldPassword, patient.password);
        if (!isMatch) return res.status(400).json({ message: 'Incorrect old password' });

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await db.query('UPDATE patients SET password = ? WHERE id = ?', [hashedPassword, req.user.id]);
        res.json({ message: 'Password changed successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getDashboardStats = async (req, res) => {
    try {
        const [appointments] = await db.query('SELECT COUNT(*) as count FROM appointments WHERE patient_id = ?', [req.user.id]);
        const [prescriptions] = await db.query('SELECT COUNT(*) as count FROM prescriptions WHERE patient_id = ?', [req.user.id]);
        res.json({
            totalAppointments: appointments[0].count,
            totalPrescriptions: prescriptions[0].count,
            medicalRecords: 0 // Placeholder
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getMedicalRecords = async (req, res) => {
    try {
        const [prescriptions] = await db.query('SELECT * FROM prescriptions WHERE patient_id = ? ORDER BY created_at DESC', [req.user.id]);
        res.json(prescriptions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export default { login, getProfile, updateProfile, changePassword, getDashboardStats, getMedicalRecords };
