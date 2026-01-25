import db from '../../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const [rows] = await db.execute('SELECT * FROM patients WHERE email = ?', [email]);
        if (rows.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const patient = rows[0];
        const isMatch = await bcrypt.compare(password, patient.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: patient.id, type: 'PATIENT' }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
        res.json({ token, patient: { id: patient.id, name: patient.name, email: patient.email } });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getProfile = async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT id, name, email, phone, address, dob, gender, blood_type, profile_image FROM patients WHERE id = ?', [req.user.id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Patient not found' });
        }
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateProfile = async (req, res) => {
    const { name, phone, address, dob, gender, blood_type, profile_image } = req.body;
    try {
        await db.execute(
            'UPDATE patients SET name = ?, phone = ?, address = ?, dob = ?, gender = ?, blood_type = ?, profile_image = ? WHERE id = ?',
            [name, phone, address, dob, gender, blood_type, profile_image, req.user.id]
        );
        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const changePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    try {
        const [rows] = await db.execute('SELECT password FROM patients WHERE id = ?', [req.user.id]);
        const isMatch = await bcrypt.compare(currentPassword, rows[0].password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Incorrect current password' });
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await db.execute('UPDATE patients SET password = ? WHERE id = ?', [hashedPassword, req.user.id]);
        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getDashboardStats = async (req, res) => {
    try {
        const [upcoming] = await db.execute('SELECT COUNT(*) as count FROM appointments WHERE patient_id = ? AND appointment_date >= CURDATE() AND status != "CANCELLED"', [req.user.id]);
        const [prescriptions] = await db.execute('SELECT COUNT(*) as count FROM prescriptions WHERE patient_id = ?', [req.user.id]);
        const [reports] = await db.execute('SELECT COUNT(*) as count FROM medical_reports WHERE patient_id = ?', [req.user.id]);

        res.json({
            upcomingAppointments: upcoming[0].count,
            totalPrescriptions: prescriptions[0].count,
            totalReports: reports[0].count
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getMedicalRecords = async (req, res) => {
    try {
        const [prescriptions] = await db.execute(`
            SELECT p.id, p.diagnostic, p.status, p.created_at as date, d.name as doctor,
            (SELECT GROUP_CONCAT(CONCAT(medicine_name, ' (', strength, ')') SEPARATOR ', ') 
             FROM prescription_items 
             WHERE prescription_id = p.id) as meds
            FROM prescriptions p 
            LEFT JOIN doctors d ON p.doctor_id = d.id 
            WHERE p.patient_id = ? 
            ORDER BY p.created_at DESC
        `, [req.user.id]);

        const [reports] = await db.execute(`
            SELECT id, title, clinic, type, report_date as date 
            FROM medical_reports 
            WHERE patient_id = ? 
            ORDER BY report_date DESC
        `, [req.user.id]);

        res.json({ prescriptions, reports });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export default {
    login,
    getProfile,
    updateProfile,
    changePassword,
    getDashboardStats,
    getMedicalRecords
};
