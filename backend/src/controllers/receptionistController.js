import db from '../config/db.js';
import bcrypt from 'bcryptjs';

// Get Receptionist Dashboard Stats
export const getDashboardStats = async (req, res) => {
    try {
        // Get today's appointments
        const [todayAppointments] = await db.query(
            'SELECT COUNT(*) as count FROM appointments WHERE appointment_date = CURDATE()'
        );

        // Get total patients
        const [totalPatients] = await db.query(
            'SELECT COUNT(*) as count FROM patients'
        );

        // Get pending payments
        const [pendingPayments] = await db.query(
            'SELECT COUNT(*) as count FROM invoices WHERE payment_status = "pending"'
        );

        // Get today's revenue
        const [todayRevenue] = await db.query(
            `SELECT COALESCE(SUM(paid_amount), 0) as revenue 
       FROM invoices 
       WHERE invoice_date = CURDATE()`
        );

        res.json({
            todayAppointments: todayAppointments[0].count,
            totalPatients: totalPatients[0].count,
            pendingPayments: pendingPayments[0].count,
            todayRevenue: parseFloat(todayRevenue[0].revenue)
        });
    } catch (error) {
        console.error('Error fetching receptionist dashboard stats:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get All Patients
export const getPatients = async (req, res) => {
    try {
        const { search } = req.query;

        let query = `
      SELECT 
        id, 
        CONCAT(firstName, ' ', lastName) as name,
        email,
        phone,
        dateOfBirth,
        gender,
        bloodGroup,
        created_at
      FROM patients
    `;

        const params = [];

        if (search) {
            query += ' WHERE firstName LIKE ? OR lastName LIKE ? OR email LIKE ? OR phone LIKE ?';
            const searchTerm = `%${search}%`;
            params.push(searchTerm, searchTerm, searchTerm, searchTerm);
        }

        query += ' ORDER BY created_at DESC';

        const [patients] = await db.query(query, params);

        res.json(patients);
    } catch (error) {
        console.error('Error fetching patients:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get Patient by ID
export const getPatientById = async (req, res) => {
    try {
        const { id } = req.params;

        const [patients] = await db.query(
            'SELECT * FROM patients WHERE id = ?',
            [id]
        );

        if (patients.length === 0) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        const patient = patients[0];
        delete patient.password;

        res.json(patient);
    } catch (error) {
        console.error('Error fetching patient:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Register New Patient
export const registerPatient = async (req, res) => {
    try {
        const {
            email, password, firstName, lastName, dateOfBirth, gender, phone,
            address, emergencyContact, emergencyPhone, bloodGroup, allergies,
            medicalHistory, currentMedications, insuranceProvider, insuranceId, policyNumber
        } = req.body;

        if (!firstName || !lastName || !phone) {
            return res.status(400).json({ message: 'Required fields missing' });
        }

        let hashedPassword = null;
        if (password) {
            hashedPassword = await bcrypt.hash(password, 10);
        }

        const [result] = await db.query(
            `INSERT INTO patients 
       (email, password, firstName, lastName, dateOfBirth, gender, phone, address, 
        emergencyContact, emergencyPhone, bloodGroup, allergies, medicalHistory, 
        currentMedications, insuranceProvider, insuranceId, policyNumber) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                email, hashedPassword, firstName, lastName, dateOfBirth, gender, phone, address,
                emergencyContact, emergencyPhone, bloodGroup, allergies, medicalHistory,
                currentMedications, insuranceProvider, insuranceId, policyNumber
            ]
        );

        res.status(201).json({
            message: 'Patient registered successfully',
            patientId: result.insertId
        });
    } catch (error) {
        console.error('Error registering patient:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'Email already exists' });
        }
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update Patient
export const updatePatient = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            firstName, lastName, dateOfBirth, gender, phone, address,
            emergencyContact, emergencyPhone, bloodGroup, allergies,
            medicalHistory, currentMedications, insuranceProvider,
            insuranceId, policyNumber
        } = req.body;

        await db.query(
            `UPDATE patients SET 
       firstName = ?, lastName = ?, dateOfBirth = ?, gender = ?, phone = ?, 
       address = ?, emergencyContact = ?, emergencyPhone = ?, bloodGroup = ?, 
       allergies = ?, medicalHistory = ?, currentMedications = ?, 
       insuranceProvider = ?, insuranceId = ?, policyNumber = ? 
       WHERE id = ?`,
            [
                firstName, lastName, dateOfBirth, gender, phone, address,
                emergencyContact, emergencyPhone, bloodGroup, allergies,
                medicalHistory, currentMedications, insuranceProvider,
                insuranceId, policyNumber, id
            ]
        );

        res.json({ message: 'Patient updated successfully' });
    } catch (error) {
        console.error('Error updating patient:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Search Patients
export const searchPatients = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query) {
            return res.status(400).json({ message: 'Search query required' });
        }

        const searchTerm = `%${query}%`;

        const [patients] = await db.query(
            `SELECT 
        id, 
        CONCAT(firstName, ' ', lastName) as name,
        email,
        phone,
        dateOfBirth,
        gender,
        bloodGroup
      FROM patients
      WHERE firstName LIKE ? OR lastName LIKE ? OR email LIKE ? OR phone LIKE ?
      LIMIT 20`,
            [searchTerm, searchTerm, searchTerm, searchTerm]
        );

        res.json(patients);
    } catch (error) {
        console.error('Error searching patients:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get All Appointments
export const getAppointments = async (req, res) => {
    try {
        const { date, status, doctor_id } = req.query;

        let query = `
      SELECT 
        a.id,
        a.appointment_date,
        a.appointment_time,
        a.status,
        a.reason,
        a.notes,
        CONCAT(p.firstName, ' ', p.lastName) as patient_name,
        p.phone as patient_phone,
        p.email as patient_email,
        d.name as doctor_name,
        d.specialization as doctor_specialization
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      JOIN doctors d ON a.doctor_id = d.id
      WHERE 1=1
    `;

        const params = [];

        if (date) {
            query += ' AND a.appointment_date = ?';
            params.push(date);
        }

        if (status) {
            query += ' AND a.status = ?';
            params.push(status);
        }

        if (doctor_id) {
            query += ' AND a.doctor_id = ?';
            params.push(doctor_id);
        }

        query += ' ORDER BY a.appointment_date DESC, a.appointment_time DESC';

        const [appointments] = await db.query(query, params);

        res.json(appointments);
    } catch (error) {
        console.error('Error fetching appointments:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Book Appointment
export const bookAppointment = async (req, res) => {
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
            message: 'Appointment booked successfully',
            appointmentId: result.insertId
        });
    } catch (error) {
        console.error('Error booking appointment:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update Appointment
export const updateAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ message: 'No update data provided' });
        }

        let query = 'UPDATE appointments SET ';
        const params = [];
        const entries = Object.entries(updates);

        entries.forEach(([key, value], index) => {
            let val = value;
            // Convert '11:00 AM' or '03:00 PM' to 24h format for MySQL
            if (key === 'appointment_time' && typeof value === 'string' && (value.includes('AM') || value.includes('PM'))) {
                const parts = value.split(' ');
                if (parts.length === 2) {
                    const [time, modifier] = parts;
                    let [hours, minutes] = time.split(':');
                    let h = parseInt(hours, 10);
                    if (h === 12 && modifier === 'AM') h = 0;
                    else if (h !== 12 && modifier === 'PM') h += 12;
                    val = `${h.toString().padStart(2, '0')}:${minutes}:00`;
                }
            }
            query += `${key} = ?${index < entries.length - 1 ? ', ' : ''}`;
            params.push(val);
        });

        query += ' WHERE id = ?';
        params.push(id);

        await db.query(query, params);

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

// Get All Invoices/Billing
export const getInvoices = async (req, res) => {
    try {
        const { status, patient_id } = req.query;

        let query = `
      SELECT 
        i.id,
        i.total_amount,
        i.paid_amount,
        i.payment_status,
        i.payment_method,
        i.invoice_date,
        i.due_date,
        i.notes,
        CONCAT(p.firstName, ' ', p.lastName) as patient_name,
        p.phone as patient_phone
      FROM invoices i
      JOIN patients p ON i.patient_id = p.id
      WHERE 1=1
    `;

        const params = [];

        if (status) {
            query += ' AND i.payment_status = ?';
            params.push(status);
        }

        if (patient_id) {
            query += ' AND i.patient_id = ?';
            params.push(patient_id);
        }

        query += ' ORDER BY i.invoice_date DESC';

        const [invoices] = await db.query(query, params);

        res.json(invoices);
    } catch (error) {
        console.error('Error fetching invoices:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Create Invoice
export const createInvoice = async (req, res) => {
    try {
        const { patient_id, appointment_id, total_amount, payment_method, notes, due_date } = req.body;

        if (!patient_id || !total_amount) {
            return res.status(400).json({ message: 'Required fields missing' });
        }

        const [result] = await db.query(
            'INSERT INTO invoices (patient_id, appointment_id, total_amount, paid_amount, payment_status, payment_method, invoice_date, due_date, notes) VALUES (?, ?, ?, ?, ?, ?, CURDATE(), ?, ?)',
            [patient_id, appointment_id, total_amount, 0, 'pending', payment_method, due_date, notes]
        );

        res.status(201).json({
            message: 'Invoice created successfully',
            invoiceId: result.insertId
        });
    } catch (error) {
        console.error('Error creating invoice:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update Invoice/Process Payment
export const updateInvoice = async (req, res) => {
    try {
        const { id } = req.params;
        const { paid_amount, payment_status, payment_method } = req.body;

        await db.query(
            'UPDATE invoices SET paid_amount = ?, payment_status = ?, payment_method = ? WHERE id = ?',
            [paid_amount, payment_status, payment_method, id]
        );

        res.json({ message: 'Invoice updated successfully' });
    } catch (error) {
        console.error('Error updating invoice:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete Invoice
export const deleteInvoice = async (req, res) => {
    try {
        const { id } = req.params;

        await db.query('DELETE FROM invoices WHERE id = ?', [id]);

        res.json({ message: 'Invoice deleted successfully' });
    } catch (error) {
        console.error('Error deleting invoice:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get Available Doctors
export const getAvailableDoctors = async (req, res) => {
    try {
        const [doctors] = await db.query(
            'SELECT id, name, email, department, specialization, phone FROM doctors ORDER BY name'
        );

        res.json(doctors);
    } catch (error) {
        console.error('Error fetching doctors:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get Receptionist Profile
export const getProfile = async (req, res) => {
    try {
        const receptionistId = req.user.id;

        const [receptionists] = await db.query(
            'SELECT id, email, name, department, location, phone, created_at FROM receptionists WHERE id = ?',
            [receptionistId]
        );

        if (receptionists.length === 0) {
            return res.status(404).json({ message: 'Receptionist not found' });
        }

        res.json(receptionists[0]);
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update Receptionist Profile
export const updateProfile = async (req, res) => {
    try {
        const receptionistId = req.user.id;
        const { name, department, location, phone } = req.body;

        await db.query(
            'UPDATE receptionists SET name = ?, department = ?, location = ?, phone = ? WHERE id = ?',
            [name, department, location, phone, receptionistId]
        );

        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get Recent Invoices (for dashboard)
export const getRecentInvoices = async (req, res) => {
    try {
        const [invoices] = await db.query(`
      SELECT 
        i.id,
        i.total_amount,
        i.paid_amount,
        i.payment_status,
        i.invoice_date,
        CONCAT(p.firstName, ' ', p.lastName) as patient_name
      FROM invoices i
      JOIN patients p ON i.patient_id = p.id
      WHERE i.payment_status = 'pending'
      ORDER BY i.invoice_date DESC
      LIMIT 10
    `);

        res.json(invoices);
    } catch (error) {
        console.error('Error fetching recent invoices:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
