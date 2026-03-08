import db from '../config/db.js';
import bcrypt from 'bcryptjs';

// Get Admin Dashboard Stats
export const getDashboardStats = async (req, res) => {
    try {
        // Get total patients
        const [patientsCount] = await db.query('SELECT COUNT(*) as count FROM patients');

        // Get total doctors
        const [doctorsCount] = await db.query('SELECT COUNT(*) as count FROM doctors');

        // Get today's appointments
        const [todayAppointments] = await db.query(
            'SELECT COUNT(*) as count FROM appointments WHERE appointment_date = CURDATE()'
        );

        // Get low stock items (quantity < 10)
        const [lowStockCount] = await db.query(
            'SELECT COUNT(*) as count FROM inventory WHERE quantity < 10'
        );

        // Get monthly revenue (current month)
        const [revenueData] = await db.query(
            `SELECT COALESCE(SUM(paid_amount), 0) as revenue 
       FROM invoices 
       WHERE MONTH(invoice_date) = MONTH(CURDATE()) 
       AND YEAR(invoice_date) = YEAR(CURDATE())`
        );

        res.json({
            totalPatients: patientsCount[0].count,
            totalDoctors: doctorsCount[0].count,
            todayAppointments: todayAppointments[0].count,
            lowStockItems: lowStockCount[0].count,
            monthlyRevenue: parseFloat(revenueData[0].revenue),
            satisfactionRate: 4.7 // This could be calculated from a ratings table
        });
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get All Users (for User Management)
export const getAllUsers = async (req, res) => {
    try {
        const { role } = req.query;

        let users = [];

        if (!role || role === 'all') {
            // Get all users from all tables
            const [admins] = await db.query('SELECT id, email, name, department, status, created_at as joinDate, "" as phone, "admin" as role FROM admins');
            const [doctors] = await db.query('SELECT id, email, name, department, status, created_at as joinDate, phone, "doctor" as role FROM doctors');
            const [pharmacists] = await db.query('SELECT id, email, name, department, status, created_at as joinDate, phone, "pharmacist" as role FROM pharmacists');
            const [receptionists] = await db.query('SELECT id, email, name, department, status, created_at as joinDate, phone, "receptionist" as role FROM receptionists');
            const [patients] = await db.query('SELECT id, email, CONCAT(firstName, " ", lastName) as name, "" as department, status, created_at as joinDate, phone, "patient" as role FROM patients');

            users = [...admins, ...doctors, ...pharmacists, ...receptionists, ...patients];
        } else {
            // Get users from specific role table
            const tableName = role === 'admin' ? 'admins' :
                role === 'doctor' ? 'doctors' :
                    role === 'pharmacist' ? 'pharmacists' :
                        role === 'receptionist' ? 'receptionists' :
                            role === 'patient' ? 'patients' : null;

            if (tableName) {
                let query = '';
                if (role === 'patient') {
                    query = `SELECT id, email, CONCAT(firstName, " ", lastName) as name, "" as department, phone, status, created_at as joinDate FROM ${tableName}`;
                } else if (role === 'admin') {
                    query = `SELECT id, email, name, department, "" as phone, status, created_at as joinDate FROM ${tableName}`;
                } else {
                    query = `SELECT id, email, name, department, phone, status, created_at as joinDate FROM ${tableName}`;
                }
                const [results] = await db.query(query);
                users = results.map(user => ({ ...user, role }));
            }
        }

        // Remove passwords
        users = users.map(({ password, ...user }) => user);

        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Create User
export const createUser = async (req, res) => {
    try {
        const { email, password, name, role, department, specialization, location, licenseNumber, license, phone } = req.body;

        if (!email || !password || !role || (!name && !(req.body.firstName && req.body.lastName))) {
            return res.status(400).json({ message: 'Required fields missing' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const tableName = role === 'admin' ? 'admins' :
            role === 'doctor' ? 'doctors' :
                role === 'pharmacist' ? 'pharmacists' :
                    role === 'receptionist' ? 'receptionists' :
                        role === 'patient' ? 'patients' : null;

        if (!tableName) {
            return res.status(400).json({ message: 'Invalid role' });
        }

        let query, values;
        const actualLicense = licenseNumber || license;

        if (role === 'doctor') {
            query = `INSERT INTO ${tableName} (email, password, name, department, specialization, phone, status) VALUES (?, ?, ?, ?, ?, ?, ?)`;
            values = [email, hashedPassword, name, department, specialization, phone || '', 'active'];
        } else if (role === 'receptionist') {
            query = `INSERT INTO ${tableName} (email, password, name, department, location, phone, status) VALUES (?, ?, ?, ?, ?, ?, ?)`;
            values = [email, hashedPassword, name, department, location || '', phone || '', 'active'];
        } else if (role === 'patient') {
            const { firstName, lastName, address } = req.body;
            query = `INSERT INTO ${tableName} (email, password, firstName, lastName, phone, address, status) VALUES (?, ?, ?, ?, ?, ?, ?)`;
            values = [email, hashedPassword, firstName || name.split(' ')[0], lastName || name.split(' ').slice(1).join(' '), phone || '', address || '', 'active'];
        } else if (role === 'pharmacist') {
            query = `INSERT INTO ${tableName} (email, password, name, department, phone, status) VALUES (?, ?, ?, ?, ?, ?)`;
            values = [email, hashedPassword, name, department, phone || '', 'active'];
        } else {
            query = `INSERT INTO ${tableName} (email, password, name, department, status) VALUES (?, ?, ?, ?, ?)`;
            values = [email, hashedPassword, name, department, 'active'];
        }

        const [result] = await db.query(query, values);

        res.status(201).json({
            message: 'User created successfully',
            userId: result.insertId
        });
    } catch (error) {
        console.error('Error creating user:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'Email already exists' });
        }
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update User
export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, department, specialization, location, licenseNumber, role, status, phone } = req.body;

        const tableName = role === 'admin' ? 'admins' :
            role === 'doctor' ? 'doctors' :
                role === 'pharmacist' ? 'pharmacists' :
                    role === 'receptionist' ? 'receptionists' :
                        role === 'patient' ? 'patients' : null;

        if (!tableName) {
            return res.status(400).json({ message: 'Invalid role' });
        }

        let query, values;

        if (role === 'doctor') {
            query = `UPDATE ${tableName} SET name = ?, department = ?, specialization = ?, status = ?, phone = ? WHERE id = ?`;
            values = [name, department, specialization, status || 'active', phone, id];
        } else if (role === 'pharmacist') {
            query = `UPDATE ${tableName} SET name = ?, department = ?, status = ?, phone = ? WHERE id = ?`;
            values = [name, department, status || 'active', phone, id];
        } else if (role === 'receptionist') {
            query = `UPDATE ${tableName} SET name = ?, department = ?, location = ?, status = ?, phone = ? WHERE id = ?`;
            values = [name, department, location || '', status || 'active', phone, id];
        } else if (role === 'patient') {
            const { firstName, lastName, address } = req.body;
            query = `UPDATE ${tableName} SET firstName = ?, lastName = ?, email = ?, phone = ?, address = ?, status = ? WHERE id = ?`;
            values = [firstName, lastName, email, phone, address, status || 'active', id];
        } else {
            query = `UPDATE ${tableName} SET name = ?, department = ?, status = ? WHERE id = ?`;
            values = [name, department, status || 'active', id];
        }

        await db.query(query, values);

        res.json({ message: 'User updated successfully' });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete User
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.query;

        const tableName = role === 'admin' ? 'admins' :
            role === 'doctor' ? 'doctors' :
                role === 'receptionist' ? 'receptionists' :
                    role === 'pharmacist' ? 'pharmacists' :
                        role === 'patient' ? 'patients' : null;

        if (!tableName) {
            return res.status(400).json({ message: 'Invalid role' });
        }

        await db.query(`DELETE FROM ${tableName} WHERE id = ?`, [id]);

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update User Status (Active/Inactive)
export const updateUserStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, role } = req.body;

        const tableName = role === 'admin' ? 'admins' :
            role === 'doctor' ? 'doctors' :
                role === 'receptionist' ? 'receptionists' :
                    role === 'patient' ? 'patients' : null;

        if (!tableName) {
            return res.status(400).json({ message: 'Invalid role' });
        }

        await db.query(`UPDATE ${tableName} SET status = ? WHERE id = ?`, [status, id]);

        res.json({ message: `User ${status === 'active' ? 'activated' : 'deactivated'} successfully` });
    } catch (error) {
        console.error('Error updating status:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Bulk Import Users
export const bulkImportUsers = async (req, res) => {
    try {
        const { users } = req.body; // Array of user objects

        if (!users || !Array.isArray(users)) {
            return res.status(400).json({ message: 'Invalid users data' });
        }

        const bcrypt = await import('bcryptjs');
        const defaultPassword = await bcrypt.hash('password123', 10);

        let successCount = 0;
        let errors = [];

        for (const user of users) {
            try {
                const { email, name, role, department, specialization, location, licenseNumber } = user;

                const tableName = role === 'admin' ? 'admins' :
                    role === 'doctor' ? 'doctors' :
                        role === 'pharmacist' ? 'pharmacists' :
                            role === 'staff' || role === 'receptionist' ? 'receptionists' : null;

                if (!tableName) {
                    errors.push({ email, error: 'Invalid role' });
                    continue;
                }

                let query, values;
                if (role === 'doctor') {
                    query = `INSERT INTO ${tableName} (email, password, name, department, specialization) VALUES (?, ?, ?, ?, ?)`;
                    values = [email, defaultPassword, name, department, specialization];
                } else if (role === 'receptionist') {
                    query = `INSERT INTO ${tableName} (email, password, name, department, location) VALUES (?, ?, ?, ?, ?)`;
                    values = [email, defaultPassword, name, department, location];
                } else if (role === 'patient') {
                    query = `INSERT INTO ${tableName} (email, password, firstName, lastName, phone) VALUES (?, ?, ?, ?, ?)`;
                    values = [email, defaultPassword, user.firstName || name.split(' ')[0], user.lastName || name.split(' ').slice(1).join(' '), user.phone || ''];
                } else {
                    query = `INSERT INTO ${tableName} (email, password, name, department) VALUES (?, ?, ?, ?)`;
                    values = [email, defaultPassword, name, department || 'General'];
                }

                await db.query(query, values);
                successCount++;
            } catch (err) {
                errors.push({ email: user.email, error: err.message });
            }
        }

        res.json({
            message: `Bulk import completed. Successfully imported ${successCount} users.`,
            successCount,
            errorCount: errors.length,
            errors
        });
    } catch (error) {
        console.error('Error in bulk import:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get All Doctors (for Doctor Management)
export const getAllDoctors = async (req, res) => {
    try {
        const [doctors] = await db.query('SELECT id, email, name, department, specialization, phone, status, created_at FROM doctors');
        res.json(doctors);
    } catch (error) {
        console.error('Error fetching doctors:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get All Patients
export const getAllPatients = async (req, res) => {
    try {
        const [patients] = await db.query('SELECT id, email, firstName, lastName, phone, status, created_at FROM patients');
        res.json(patients);
    } catch (error) {
        console.error('Error fetching patients:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get All Appointments
export const getAllAppointments = async (req, res) => {
    try {
        const [appointments] = await db.query(`
            SELECT a.*, p.firstName as patient_name, p.phone as patient_phone, 
                   d.name as doctor_name, d.specialization as doctor_specialization
            FROM appointments a
            JOIN patients p ON a.patient_id = p.id
            JOIN doctors d ON a.doctor_id = d.id
            ORDER BY a.appointment_date DESC, a.appointment_time DESC
        `);
        res.json(appointments);
    } catch (error) {
        console.error('Error fetching appointments:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get Financial Stats
export const getFinancialStats = async (req, res) => {
    try {
        const { range = 'monthly' } = req.query;
        let [stats] = await db.query(`
            SELECT 
                DATE_FORMAT(invoice_date, '%b') as month,
                SUM(total_amount) as revenue,
                SUM(total_amount * 0.6) as expenses, 
                SUM(total_amount * 0.4) as profit
            FROM invoices
            GROUP BY month, MONTH(invoice_date)
            ORDER BY MONTH(invoice_date)
        `);

        if (stats.length === 0) {
            // Provide mock data if no real invoices exist
            stats = [
                { month: 'Jan', revenue: 125430, expenses: 85430, profit: 40000 },
                { month: 'Feb', revenue: 132560, expenses: 92340, profit: 40220 },
                { month: 'Mar', revenue: 148920, expenses: 101230, profit: 47690 },
                { month: 'Apr', revenue: 156780, expenses: 112340, profit: 44440 },
                { month: 'May', revenue: 142310, expenses: 98760, profit: 43550 },
                { month: 'Jun', revenue: 165430, expenses: 115670, profit: 49760 },
            ];
        }

        res.json(stats);
    } catch (error) {
        console.error('Error fetching financial stats:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Create Appointment
export const createAppointment = async (req, res) => {
    try {
        const { patient_id, doctor_id, appointment_date, appointment_time, reason, notes } = req.body;
        if (!patient_id || !doctor_id || !appointment_date || !appointment_time) {
            return res.status(400).json({ message: 'Required fields missing' });
        }

        let formattedTime = appointment_time;
        // Convert '11:00 AM' or '03:00 PM' to 24h format for MySQL
        if (typeof appointment_time === 'string' && (appointment_time.includes('AM') || appointment_time.includes('PM'))) {
            const parts = appointment_time.split(' ');
            if (parts.length === 2) {
                const [time, modifier] = parts;
                let [hours, minutes] = time.split(':');
                let h = parseInt(hours, 10);
                if (h === 12 && modifier === 'AM') h = 0;
                else if (h !== 12 && modifier === 'PM') h += 12;
                formattedTime = `${h.toString().padStart(2, '0')}:${minutes}:00`;
            }
        }

        const [result] = await db.query(
            'INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, reason, notes, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [patient_id, doctor_id, appointment_date, formattedTime, reason || '', notes || '', 'scheduled']
        );

        res.status(201).json({
            message: 'Appointment created successfully',
            appointmentId: result.insertId
        });
    } catch (error) {
        console.error('Error creating appointment:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update Appointment
export const updateAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const { appointment_date, appointment_time, status, reason, notes } = req.body;

        let formattedTime = appointment_time;
        // Convert '11:00 AM' or '03:00 PM' to 24h format for MySQL
        if (typeof appointment_time === 'string' && (appointment_time.includes('AM') || appointment_time.includes('PM'))) {
            const parts = appointment_time.split(' ');
            if (parts.length === 2) {
                const [time, modifier] = parts;
                let [hours, minutes] = time.split(':');
                let h = parseInt(hours, 10);
                if (h === 12 && modifier === 'AM') h = 0;
                else if (h !== 12 && modifier === 'PM') h += 12;
                formattedTime = `${h.toString().padStart(2, '0')}:${minutes}:00`;
            }
        }

        await db.query(
            'UPDATE appointments SET appointment_date = ?, appointment_time = ?, status = ?, reason = ?, notes = ? WHERE id = ?',
            [appointment_date, formattedTime, status, reason || '', notes || '', id]
        );

        res.json({ message: 'Appointment updated successfully' });
    } catch (error) {
        console.error('Error updating appointment:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete Appointment
export const deleteAppointment = async (req, res) => {
    try {
        const { id } = req.params;

        await db.query('DELETE FROM appointments WHERE id = ?', [id]);

        res.json({ message: 'Appointment deleted successfully' });
    } catch (error) {
        console.error('Error deleting appointment:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
