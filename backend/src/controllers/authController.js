import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../config/db.js';

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check in admins table
        const [admins] = await db.query('SELECT * FROM admins WHERE email = ?', [email]);

        if (admins.length > 0) {
            const admin = admins[0];
            const isMatch = await bcrypt.compare(password, admin.password);

            if (isMatch) {
                const token = jwt.sign(
                    { id: admin.id, role: 'admin', name: admin.name },
                    process.env.JWT_SECRET || 'secret',
                    { expiresIn: '1d' }
                );
                return res.json({ token, user: { id: admin.id, name: admin.name, email: admin.email, role: 'admin' } });
            }
        }

        // Check in doctors table
        const [doctors] = await db.query('SELECT * FROM doctors WHERE email = ?', [email]);
        if (doctors.length > 0) {
            const doctor = doctors[0];
            // Check if password exists (migrated doctors might not have one initially if not updated)
            if (!doctor.password) {
                return res.status(401).json({ message: 'Please contact admin to set your password' });
            }

            const isMatch = await bcrypt.compare(password, doctor.password);

            if (isMatch) {
                const token = jwt.sign(
                    { id: doctor.id, role: 'doctor', name: doctor.name },
                    process.env.JWT_SECRET || 'secret',
                    { expiresIn: '1d' }
                );
                return res.json({
                    token,
                    user: {
                        id: doctor.id,
                        name: doctor.name,
                        email: doctor.email,
                        role: 'doctor',
                        specialization: doctor.specialization
                    }
                });
            }
        }

        // Check in receptionists table
        const [receptionists] = await db.query('SELECT * FROM receptionists WHERE email = ?', [email]);
        if (receptionists.length > 0) {
            const receptionist = receptionists[0];
            const isMatch = await bcrypt.compare(password, receptionist.password);

            if (isMatch) {
                const token = jwt.sign(
                    { id: receptionist.id, role: 'receptionist', name: receptionist.name },
                    process.env.JWT_SECRET || 'secret',
                    { expiresIn: '1d' }
                );
                return res.json({
                    token,
                    user: {
                        id: receptionist.id,
                        name: receptionist.name,
                        email: receptionist.email,
                        role: 'receptionist'
                    }
                });
            }
        }

        // Check in pharmacists table
        const [pharmacists] = await db.query('SELECT * FROM pharmacists WHERE email = ?', [email]);
        if (pharmacists.length > 0) {
            const pharmacist = pharmacists[0];
            const isMatch = await bcrypt.compare(password, pharmacist.password);

            if (isMatch) {
                const token = jwt.sign(
                    { id: pharmacist.id, role: 'pharmacist', name: pharmacist.name },
                    process.env.JWT_SECRET || 'secret',
                    { expiresIn: '1d' }
                );
                return res.json({
                    token,
                    user: {
                        id: pharmacist.id,
                        name: pharmacist.name,
                        email: pharmacist.email,
                        role: 'pharmacist'
                    }
                });
            }
        }

        // Check in patients table
        // For patients, handle email as login
        const [patients] = await db.query('SELECT * FROM patients WHERE email = ?', [email]);
        if (patients.length > 0) {
            const patient = patients[0];

            // If patient has a password (some might not if they were just records)
            if (patient.password) {
                const isMatch = await bcrypt.compare(password, patient.password);
                if (isMatch) {
                    const token = jwt.sign(
                        { id: patient.id, role: 'patient', name: patient.name },
                        process.env.JWT_SECRET || 'secret',
                        { expiresIn: '1d' }
                    );
                    return res.json({
                        token,
                        user: {
                            id: patient.id,
                            name: patient.name,
                            email: patient.email,
                            role: 'patient'
                        }
                    });
                }
            } else if (password === '123456') { // Demo fallback if password not set
                const token = jwt.sign(
                    { id: patient.id, role: 'patient', name: patient.name },
                    process.env.JWT_SECRET || 'secret',
                    { expiresIn: '1d' }
                );
                return res.json({
                    token,
                    user: {
                        id: patient.id,
                        name: patient.name,
                        email: patient.email,
                        role: 'patient'
                    }
                });
            }
        }

        return res.status(401).json({ message: 'Invalid credentials' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const register = async (req, res) => {
    // Implement if needed
    res.status(501).json({ message: 'Not implemented' });
};
