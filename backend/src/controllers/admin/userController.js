import db from '../../config/db.js';

export const getAllUsers = async (req, res) => {
    try {
        const users = [];

        // Fetch Admins
        try {
            const [admins] = await db.query("SELECT id, name, email, 'admin' as role, created_at FROM admins");
            admins.forEach(u => users.push({
                id: `A${u.id}`,
                originalId: u.id,
                name: u.name,
                email: u.email,
                role: 'admin',
                status: 'active',
                joinDate: u.created_at
            }));
        } catch (e) { console.error("Admin fetch fail:", e.message); }

        // Fetch Doctors
        try {
            const [doctors] = await db.query('SELECT id, name, email, department, specialization, phone, status, created_at FROM doctors');
            doctors.forEach(u => users.push({
                id: `D${u.id}`,
                originalId: u.id,
                name: u.name,
                email: u.email,
                role: 'doctor',
                status: u.status || 'active',
                phone: u.phone,
                department: u.department,
                specialization: u.specialization,
                joinDate: u.created_at
            }));
        } catch (e) { console.error("Doctor fetch fail:", e.message); }

        // Fetch Pharmacists
        try {
            const [pharmacists] = await db.query('SELECT id, name, email, status, created_at FROM pharmacists');
            pharmacists.forEach(u => users.push({
                id: `PH${u.id}`,
                originalId: u.id,
                name: u.name,
                email: u.email,
                role: 'pharmacist',
                status: (u.status || 'active').toLowerCase(),
                joinDate: u.created_at
            }));
        } catch (e) { console.error("Pharmacist fetch fail:", e.message); }

        // Fetch Receptionists
        try {
            const [receptionists] = await db.query('SELECT id, name, email, status, created_at FROM receptionists');
            receptionists.forEach(u => users.push({
                id: `R${u.id}`,
                originalId: u.id,
                name: u.name,
                email: u.email,
                role: 'receptionist',
                status: (u.status || 'active').toLowerCase(),
                joinDate: u.created_at
            }));
        } catch (e) { console.error("Receptionist fetch fail:", e.message); }

        // Fetch Patients - Using optional columns to avoid crash if migrations didn't add them
        try {
            const [patients] = await db.query('SELECT id, name, created_at FROM patients');
            // Try to add email and phone if they exist
            for (let u of patients) {
                // Fetch individually or just hope they exist in a more complex query? 
                // Let's just try to select them and if it fails, fallback.
            }

            // Re-attempt with more columns
            let pData = [];
            try {
                const [rows] = await db.query('SELECT id, name, email, phone, created_at FROM patients');
                pData = rows;
            } catch (e) {
                const [rows] = await db.query('SELECT id, name, created_at FROM patients');
                pData = rows.map(r => ({ ...r, email: 'N/A', phone: 'N/A' }));
            }

            pData.forEach(u => users.push({
                id: `P${u.id}`,
                originalId: u.id,
                name: u.name,
                email: u.email || 'N/A',
                phone: u.phone || 'N/A',
                role: 'patient',
                status: 'active',
                joinDate: u.created_at
            }));
        } catch (e) { console.error("Patient fetch fail:", e.message); }

        res.json(users);
    } catch (error) {
        console.error("General fetch error:", error);
        res.status(500).json({ message: 'Server error' });
    }
};

import bcrypt from 'bcryptjs';

export const createUser = async (req, res) => {
    const { role, name, email, password, phone, department, specialization, address } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password || '123456', 10);
        let table = '';
        const data = { name, email, password: hashedPassword };

        if (role === 'admin') table = 'admins';
        else if (role === 'doctor') {
            table = 'doctors';
            data.department = department;
            data.specialization = specialization;
            data.phone = phone;
        } else if (role === 'pharmacist') table = 'pharmacists';
        else if (role === 'receptionist') table = 'receptionists';
        else if (role === 'patient') {
            table = 'patients';
            data.phone = phone;
            data.address = address;
        } else {
            return res.status(400).json({ message: 'Invalid role' });
        }

        await db.query(`INSERT INTO ${table} SET ?`, data);
        res.status(201).json({ message: 'User created' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
export const deleteUser = async (req, res) => {
    const { id } = req.params;
    const prefix = id.charAt(0);
    const originalId = id.substring(1).replace(/[^\d]/g, ''); // Extract numbers

    let table = '';
    if (prefix === 'A') table = 'admins';
    else if (prefix === 'D') table = 'doctors';
    else if (prefix === 'P' && !id.startsWith('PH')) table = 'patients';
    else if (id.startsWith('PH')) {
        table = 'pharmacists';
        // handle PH index
    } else if (prefix === 'R') table = 'receptionists';

    // Better way: handle the ID parsing
    let finalTable = '';
    let finalId = '';
    if (id.startsWith('A')) { finalTable = 'admins'; finalId = id.substring(1); }
    else if (id.startsWith('D')) { finalTable = 'doctors'; finalId = id.substring(1); }
    else if (id.startsWith('PH')) { finalTable = 'pharmacists'; finalId = id.substring(2); }
    else if (id.startsWith('P')) { finalTable = 'patients'; finalId = id.substring(1); }
    else if (id.startsWith('R')) { finalTable = 'receptionists'; finalId = id.substring(1); }

    try {
        await db.query(`DELETE FROM ${finalTable} WHERE id = ?`, [finalId]);
        res.json({ message: 'User deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateUserStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    let finalTable = '';
    let finalId = '';
    if (id.startsWith('A')) { finalTable = 'admins'; finalId = id.substring(1); }
    else if (id.startsWith('D')) { finalTable = 'doctors'; finalId = id.substring(1); }
    else if (id.startsWith('PH')) { finalTable = 'pharmacists'; finalId = id.substring(2); }
    else if (id.startsWith('P')) { finalTable = 'patients'; finalId = id.substring(1); }
    else if (id.startsWith('R')) { finalTable = 'receptionists'; finalId = id.substring(1); }

    try {
        await db.query(`UPDATE ${finalTable} SET status = ? WHERE id = ?`, [status, finalId]);
        res.json({ message: 'Status updated' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const bulkImportUsers = async (req, res) => {
    const { users } = req.body;
    if (!Array.isArray(users)) return res.status(400).json({ message: 'Invalid data format' });

    try {
        const hashedPassword = await bcrypt.hash('123456', 10);
        let successCount = 0;

        for (const user of users) {
            const { role, name, email, phone, department, specialization, address } = user;
            let table = '';
            const data = { name, email, password: hashedPassword };

            if (role === 'admin') table = 'admins';
            else if (role === 'doctor') {
                table = 'doctors';
                data.department = department;
                data.specialization = specialization;
                data.phone = phone;
            } else if (role === 'pharmacist') table = 'pharmacists';
            else if (role === 'receptionist') table = 'receptionists';
            else if (role === 'patient') {
                table = 'patients';
                data.phone = phone;
                data.address = address;
            }

            if (table) {
                try {
                    await db.query(`INSERT INTO ${table} SET ?`, data);
                    successCount++;
                } catch (err) {
                    console.error(`Failed to import user ${email}:`, err.message);
                }
            }
        }

        res.json({ message: `Successfully imported ${successCount} users` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during bulk import' });
    }
};
