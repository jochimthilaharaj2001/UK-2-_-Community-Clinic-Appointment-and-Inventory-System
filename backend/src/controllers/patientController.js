import db from '../config/db.js';
import bcrypt from 'bcryptjs';

// Get Patient Dashboard Stats
export const getDashboardStats = async (req, res) => {
    try {
        const patientId = req.user.id; // From JWT middleware

        // Get upcoming appointments
        const [upcomingAppointments] = await db.query(
            'SELECT COUNT(*) as count FROM appointments WHERE patient_id = ? AND appointment_date >= CURDATE() AND status = "scheduled"',
            [patientId]
        );

        // Get total appointments
        const [totalAppointments] = await db.query(
            'SELECT COUNT(*) as count FROM appointments WHERE patient_id = ?',
            [patientId]
        );

        // Get pending prescriptions
        const [pendingPrescriptions] = await db.query(
            'SELECT COUNT(*) as count FROM prescriptions WHERE patient_id = ? AND status = "pending"',
            [patientId]
        );

        // Get unread notifications
        const [unreadNotifications] = await db.query(
            'SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND user_type = "patient" AND is_read = FALSE',
            [patientId]
        );

        res.json({
            upcomingAppointments: upcomingAppointments[0].count,
            totalAppointments: totalAppointments[0].count,
            pendingPrescriptions: pendingPrescriptions[0].count,
            unreadNotifications: unreadNotifications[0].count
        });
    } catch (error) {
        console.error('Error fetching patient dashboard stats:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get Patient Appointments
export const getAppointments = async (req, res) => {
    try {
        const patientId = req.user.id;
        const { status, upcoming } = req.query;

        let query = `
      SELECT 
        a.id,
        a.appointment_date,
        a.appointment_time,
        a.status,
        a.reason,
        a.notes,
        d.name as doctor_name,
        d.specialization as doctor_specialization,
        d.department as doctor_department
      FROM appointments a
      JOIN doctors d ON a.doctor_id = d.id
      WHERE a.patient_id = ?
    `;

        const params = [patientId];

        if (status) {
            query += ' AND a.status = ?';
            params.push(status);
        }

        if (upcoming === 'true') {
            query += ' AND a.appointment_date >= CURDATE()';
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
        const patientId = req.user.id;
        const { doctor_id, appointment_date, appointment_time, reason } = req.body;

        if (!doctor_id || !appointment_date || !appointment_time) {
            return res.status(400).json({ message: 'Required fields missing' });
        }

        let formattedTime = appointment_time;
        // Convert '11:00 AM' or '03:00 PM' to 24h format for MySQL
        if (appointment_time.includes('AM') || appointment_time.includes('PM')) {
            const [time, modifier] = appointment_time.split(' ');
            let [hours, minutes] = time.split(':');

            let h = parseInt(hours, 10);
            if (h === 12 && modifier === 'AM') h = 0;
            else if (h !== 12 && modifier === 'PM') h += 12;

            formattedTime = `${h.toString().padStart(2, '0')}:${minutes}:00`;
        }

        const [result] = await db.query(
            'INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, reason, status) VALUES (?, ?, ?, ?, ?, ?)',
            [patientId, doctor_id, appointment_date, formattedTime, reason, 'scheduled']
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

// Cancel Appointment
export const cancelAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const patientId = req.user.id;

        // Verify appointment belongs to patient
        const [appointments] = await db.query(
            'SELECT * FROM appointments WHERE id = ? AND patient_id = ?',
            [id, patientId]
        );

        if (appointments.length === 0) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        await db.query(
            'UPDATE appointments SET status = ? WHERE id = ?',
            ['cancelled', id]
        );

        res.json({ message: 'Appointment cancelled successfully' });
    } catch (error) {
        console.error('Error cancelling appointment:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get Medical Records
export const getMedicalRecords = async (req, res) => {
    try {
        const patientId = req.user.id;
        const { type } = req.query;

        let query = `
      SELECT 
        mr.id,
        mr.record_type,
        mr.diagnosis,
        mr.treatment,
        mr.notes,
        mr.file_path,
        mr.record_date,
        d.name as doctor_name,
        d.specialization as doctor_specialization
      FROM medical_records mr
      JOIN doctors d ON mr.doctor_id = d.id
      WHERE mr.patient_id = ?
    `;

        const params = [patientId];

        if (type) {
            query += ' AND mr.record_type = ?';
            params.push(type);
        }

        query += ' ORDER BY mr.record_date DESC';

        const [records] = await db.query(query, params);

        res.json(records);
    } catch (error) {
        console.error('Error fetching medical records:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get Prescriptions
export const getPrescriptions = async (req, res) => {
    try {
        const patientId = req.user.id;
        const { status } = req.query;

        let query = `
      SELECT 
        pr.id,
        pr.medication_name,
        pr.dosage,
        pr.frequency,
        pr.duration,
        pr.instructions,
        pr.status,
        pr.prescribed_date,
        d.name as doctor_name,
        d.specialization as doctor_specialization
      FROM prescriptions pr
      JOIN doctors d ON pr.doctor_id = d.id
      WHERE pr.patient_id = ?
    `;

        const params = [patientId];

        if (status) {
            query += ' AND pr.status = ?';
            params.push(status);
        }

        query += ' ORDER BY pr.prescribed_date DESC';

        const [prescriptions] = await db.query(query, params);

        res.json(prescriptions);
    } catch (error) {
        console.error('Error fetching prescriptions:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get Patient Profile
export const getProfile = async (req, res) => {
    try {
        const patientId = req.user.id;

        const [patients] = await db.query(
            'SELECT id, email, firstName, lastName, dateOfBirth, gender, phone, address, emergencyContact, emergencyPhone, bloodGroup, allergies, medicalHistory, currentMedications, insuranceProvider, insuranceId, policyNumber, created_at FROM patients WHERE id = ?',
            [patientId]
        );

        if (patients.length === 0) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        res.json(patients[0]);
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update Patient Profile
export const updateProfile = async (req, res) => {
    try {
        const patientId = req.user.id;
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
                insuranceId, policyNumber, patientId
            ]
        );

        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get Notifications
export const getNotifications = async (req, res) => {
    try {
        const patientId = req.user.id;

        const [notifications] = await db.query(
            'SELECT * FROM notifications WHERE user_id = ? AND user_type = "patient" ORDER BY created_at DESC',
            [patientId]
        );

        res.json(notifications);
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Mark Notification as Read
export const markNotificationRead = async (req, res) => {
    try {
        const { id } = req.params;
        const patientId = req.user.id;

        await db.query(
            'UPDATE notifications SET is_read = TRUE WHERE id = ? AND user_id = ? AND user_type = "patient"',
            [id, patientId]
        );

        res.json({ message: 'Notification marked as read' });
    } catch (error) {
        console.error('Error marking notification as read:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete Notification
export const deleteNotification = async (req, res) => {
    try {
        const { id } = req.params;
        const patientId = req.user.id;

        await db.query(
            'DELETE FROM notifications WHERE id = ? AND user_id = ? AND user_type = "patient"',
            [id, patientId]
        );

        res.json({ message: 'Notification deleted successfully' });
    } catch (error) {
        console.error('Error deleting notification:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get Available Doctors
export const getAvailableDoctors = async (req, res) => {
    try {
        const { specialization, department } = req.query;

        let query = 'SELECT id, name, email, department, specialization, phone, experience, education FROM doctors WHERE 1=1';
        const params = [];

        if (specialization) {
            query += ' AND specialization = ?';
            params.push(specialization);
        }

        if (department) {
            query += ' AND department = ?';
            params.push(department);
        }

        query += ' ORDER BY name';

        const [doctors] = await db.query(query, params);

        res.json(doctors);
    } catch (error) {
        console.error('Error fetching doctors:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Patient Login (separate from unified auth)
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const [patients] = await db.query('SELECT * FROM patients WHERE email = ?', [email]);

        if (patients.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const patient = patients[0];
        const isMatch = await bcrypt.compare(password, patient.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const jwt = await import('jsonwebtoken');
        const token = jwt.sign(
            { id: patient.id, role: 'patient' },
            process.env.JWT_SECRET || 'secretkey',
            { expiresIn: '1d' }
        );

        delete patient.password;

        res.json({ token, user: patient, role: 'patient' });
    } catch (error) {
        console.error('Patient login error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Change Password
export const changePassword = async (req, res) => {
    try {
        const patientId = req.user.id;
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Get patient's current password
        const [patients] = await db.query('SELECT password FROM patients WHERE id = ?', [patientId]);

        if (patients.length === 0) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        const isMatch = await bcrypt.compare(currentPassword, patients[0].password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Incorrect current password' });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        await db.query('UPDATE patients SET password = ? WHERE id = ?', [hashedNewPassword, patientId]);

        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
