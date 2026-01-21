import db from '../../config/db.js';

export const getAllUsers = async (req, res) => {
    try {
        const users = [];

        // Fetch Admins
        const [admins] = await db.query('SELECT id, name, email, role, created_at FROM admins');
        admins.forEach(u => users.push({
            id: `A${u.id}`,
            originalId: u.id,
            name: u.name,
            email: u.email,
            role: 'admin',
            status: 'active',
            joinDate: u.created_at
        }));

        // Fetch Doctors
        const [doctors] = await db.query('SELECT id, name, email, department, specialization, phone, status, created_at FROM doctors');
        doctors.forEach(u => users.push({
            id: `D${u.id}`,
            originalId: u.id,
            name: u.name,
            email: u.email,
            role: 'doctor',
            status: u.status,
            phone: u.phone,
            department: u.department,
            specialization: u.specialization,
            joinDate: u.created_at
        }));

        // Fetch Pharmacists
        const [pharmacists] = await db.query('SELECT id, name, email, status, created_at FROM pharmacists');
        pharmacists.forEach(u => users.push({
            id: `PH${u.id}`,
            originalId: u.id,
            name: u.name,
            email: u.email,
            role: 'pharmacist',
            status: u.status,
            joinDate: u.created_at
        }));

        // Fetch Patients
        const [patients] = await db.query('SELECT id, name, created_at FROM patients');
        patients.forEach(u => users.push({
            id: `P${u.id}`,
            originalId: u.id,
            name: u.name,
            email: 'N/A', // Patients might not have email in current schema
            role: 'patient',
            status: 'active',
            joinDate: u.created_at
        }));

        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const createUser = async (req, res) => {
    // This is complex because we need to know WHICH table to insert into.
    // Frontend sends 'role'.
    const { role, ...userData } = req.body;

    try {
        if (role === 'admin') {
            await db.query('INSERT INTO admins SET ?', userData);
        } else if (role === 'doctor') {
            await db.query('INSERT INTO doctors SET ?', userData);
        } else if (role === 'pharmacist') {
            await db.query('INSERT INTO pharmacists SET ?', userData);
        } else if (role === 'patient') {
            await db.query('INSERT INTO patients SET ?', userData);
        } else {
            return res.status(400).json({ message: 'Invalid role' });
        }
        res.status(201).json({ message: 'User created' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
