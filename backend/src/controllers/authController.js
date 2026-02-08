
import db from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const login = async (req, res) => {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    let tableName = '';
    switch (role) {
        case 'admin': tableName = 'admins'; break;
        case 'doctor': tableName = 'doctors'; break;
        case 'patient': tableName = 'patients'; break;
        case 'receptionist': tableName = 'receptionists'; break;
        case 'pharmacist': tableName = 'pharmacists'; break;
        default: return res.status(400).json({ message: 'Invalid role' });
    }

    try {
        const [rows] = await db.query(`SELECT * FROM ${tableName} WHERE email = ?`, [email]);

        if (rows.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = rows[0];
        // Compare password (assuming hashed)
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user.id, role: role },
            process.env.JWT_SECRET || 'secretkey',
            { expiresIn: '1d' }
        );

        // Remove password from user object
        delete user.password;

        res.json({ token, user, role });
    } catch (error) {
        console.error(`Login error for role ${role}:`, error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
