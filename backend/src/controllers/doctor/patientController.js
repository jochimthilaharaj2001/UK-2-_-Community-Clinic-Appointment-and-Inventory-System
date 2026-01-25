import db from '../../config/db.js';
import bcrypt from 'bcryptjs';


export const getDoctorPatients = async (req, res) => {
    try {
        // Return all patients so the doctor can manage the entire directory
        const [patients] = await db.query('SELECT * FROM patients ORDER BY name ASC');
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

export const getPatientHistory = async (req, res) => {
    const { id } = req.params;
    const doctorId = req.user.id;
    try {
        const [appointments] = await db.query(
            'SELECT * FROM appointments WHERE patient_id = ? AND doctor_id = ? ORDER BY date DESC',
            [id, doctorId]
        );
        const [prescriptions] = await db.query(
            'SELECT * FROM prescriptions WHERE patient_id = ? AND doctor_id = ? ORDER BY created_at DESC',
            [id, doctorId]
        );

        for (let pres of prescriptions) {
            const [items] = await db.query('SELECT * FROM prescription_items WHERE prescription_id = ?', [pres.id]);
            pres.medicines = items;
        }

        res.json({ appointments, prescriptions });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};


export const createPatient = async (req, res) => {
    const { name, email, phone, gender, dob, address, blood_type } = req.body;
    try {
        if (email) {
            const [existing] = await db.query('SELECT id FROM patients WHERE email = ?', [email]);
            if (existing.length > 0) return res.status(400).json({ message: 'Patient with this email already exists' });
        }

        const defaultPassword = await bcrypt.hash('123456', 10);

        const [result] = await db.query(
            'INSERT INTO patients (name, email, password, phone, gender, dob, address, blood_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [name, email, defaultPassword, phone || '', gender || '', dob || null, address || '', blood_type || '']
        );

        res.status(201).json({ message: 'Patient created successfully', patientId: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

