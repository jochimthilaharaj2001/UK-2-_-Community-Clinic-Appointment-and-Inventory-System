import db from '../config/db.js';
import bcrypt from 'bcryptjs';

// Get Doctor Dashboard Stats
export const getDashboardStats = async (req, res) => {
    try {
        const doctorId = req.user.id; // From JWT middleware

        // Get today's appointments
        const [todayAppointments] = await db.query(
            'SELECT COUNT(*) as count FROM appointments WHERE doctor_id = ? AND appointment_date = CURDATE()',
            [doctorId]
        );

        // Get total unique patients
        const [totalPatients] = await db.query(
            'SELECT COUNT(DISTINCT patient_id) as count FROM appointments WHERE doctor_id = ?',
            [doctorId]
        );

        // Get pending prescriptions
        const [pendingPrescriptions] = await db.query(
            'SELECT COUNT(*) as count FROM prescriptions WHERE doctor_id = ? AND status = "pending"',
            [doctorId]
        );

        // Get monthly revenue (simulated based on appointments and consultation fee)
        const [revenueData] = await db.query(
            `SELECT SUM(CAST(REPLACE(doc.consultationFee, 'LKR ', '') AS UNSIGNED)) as revenue 
             FROM appointments app 
             JOIN doctors doc ON app.doctor_id = doc.id 
             WHERE app.doctor_id = ? AND app.status = 'completed' AND MONTH(app.appointment_date) = MONTH(CURDATE())`,
            [doctorId]
        );

        res.json({
            todayAppointments: todayAppointments[0].count,
            totalPatients: totalPatients[0].count,
            pendingPrescriptions: pendingPrescriptions[0].count,
            satisfactionRate: 4.8,
            monthlyEarnings: revenueData[0].revenue || 0,
            availableSlots: 12 // This could be calculated from schedules
        });
    } catch (error) {
        console.error('Error fetching doctor dashboard stats:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get Doctor's Patients
export const getPatients = async (req, res) => {
    try {
        const doctorId = req.user.id;

        const [patients] = await db.query(`
      SELECT 
        p.id,
        CONCAT(p.firstName, ' ', p.lastName) as name,
        p.email,
        p.phone,
        p.dateOfBirth,
        p.gender,
        p.bloodGroup,
        p.allergies,
        TIMESTAMPDIFF(YEAR, p.dateOfBirth, CURDATE()) as age,
        (SELECT COUNT(*) FROM appointments WHERE patient_id = p.id AND doctor_id = ?) as visit_count,
        (SELECT MAX(appointment_date) FROM appointments WHERE patient_id = p.id AND doctor_id = ?) as last_visit,
        (SELECT reason FROM appointments WHERE patient_id = p.id AND doctor_id = ? ORDER BY appointment_date DESC LIMIT 1) as condition_text,
        (SELECT MIN(appointment_date) FROM appointments WHERE patient_id = p.id AND doctor_id = ? AND appointment_date > CURDATE()) as next_appointment
      FROM patients p
      ORDER BY p.created_at DESC
    `, [doctorId, doctorId, doctorId, doctorId]);

        res.json(patients.map(p => ({
            ...p,
            lastVisit: p.last_visit ? p.last_visit.toISOString().split('T')[0] : 'N/A',
            nextAppointment: p.next_appointment ? p.next_appointment.toISOString().split('T')[0] : 'None',
            condition: p.condition_text || 'General Checkup',
            status: 'Active'
        })));
    } catch (error) {
        console.error('Error fetching patients:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get Patient Details
export const getPatientDetails = async (req, res) => {
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
        console.error('Error fetching patient details:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get Patient Medical Records
export const getPatientMedicalRecords = async (req, res) => {
    try {
        const { id } = req.params;
        const [records] = await db.query(`
            SELECT 
                mr.*,
                d.name as doctor_name,
                d.specialization as doctor_specialization
            FROM medical_records mr
            JOIN doctors d ON mr.doctor_id = d.id
            WHERE mr.patient_id = ?
            ORDER BY mr.record_date DESC
        `, [id]);

        res.json(records);
    } catch (error) {
        console.error('Error fetching medical records:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get Doctor's Appointments
export const getAppointments = async (req, res) => {
    try {
        const doctorId = req.user.id;
        const { date, status } = req.query;

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
        p.email as patient_email
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      WHERE a.doctor_id = ?
    `;

        const params = [doctorId];

        if (date) {
            query += ' AND a.appointment_date = ?';
            params.push(date);
        }

        if (status) {
            query += ' AND a.status = ?';
            params.push(status);
        }

        query += ' ORDER BY a.appointment_date DESC, a.appointment_time DESC';

        const [appointments] = await db.query(query, params);

        res.json(appointments);
    } catch (error) {
        console.error('Error fetching appointments:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Create Appointment (from Doctor side)
export const createAppointment = async (req, res) => {
    try {
        const doctorId = req.user.id;
        const { patient_id, appointment_date, appointment_time, reason, notes } = req.body;

        if (!patient_id || !appointment_date || !appointment_time) {
            return res.status(400).json({ message: 'Required fields missing' });
        }

        let formattedTime = appointment_time;
        // Convert '11:00 AM' or '03:00 PM' to 24h format for MySQL if needed
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
        } else if (typeof appointment_time === 'string' && appointment_time.length === 5) {
            // Handle HH:mm format from input type="time"
            formattedTime = `${appointment_time}:00`;
        }

        const [result] = await db.query(
            'INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, reason, notes, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [patient_id, doctorId, appointment_date, formattedTime, reason || '', notes || '', 'confirmed']
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

// Update Appointment Status
export const updateAppointmentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, notes } = req.body;

        await db.query(
            'UPDATE appointments SET status = ?, notes = ? WHERE id = ?',
            [status, notes, id]
        );

        res.json({ message: 'Appointment updated successfully' });
    } catch (error) {
        console.error('Error updating appointment:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get Doctor's Prescriptions
export const getPrescriptions = async (req, res) => {
    try {
        const doctorId = req.user.id;

        const [prescriptions] = await db.query(`
      SELECT 
        pr.id,
        pr.medication_name,
        pr.dosage,
        pr.frequency,
        pr.duration,
        pr.instructions,
        pr.status,
        pr.prescribed_date,
        pr.patient_id,
        CONCAT(p.firstName, ' ', p.lastName) as patient_name,
        p.phone as patient_phone
      FROM prescriptions pr
      JOIN patients p ON pr.patient_id = p.id
      WHERE pr.doctor_id = ?
      ORDER BY pr.prescribed_date DESC
    `, [doctorId]);

        res.json(prescriptions);
    } catch (error) {
        console.error('Error fetching prescriptions:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Create Prescription
export const createPrescription = async (req, res) => {
    try {
        const doctorId = req.user.id;
        const { patient_id, appointment_id, medication_name, dosage, frequency, duration, instructions } = req.body;

        if (!patient_id || !medication_name) {
            return res.status(400).json({ message: 'Required fields missing' });
        }

        const [result] = await db.query(
            `INSERT INTO prescriptions 
       (patient_id, doctor_id, appointment_id, medication_name, dosage, frequency, duration, instructions, prescribed_date, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURDATE(), 'pending')`,
            [patient_id, doctorId, appointment_id, medication_name, dosage, frequency, duration, instructions]
        );

        res.status(201).json({
            message: 'Prescription created successfully',
            prescriptionId: result.insertId
        });
    } catch (error) {
        console.error('Error creating prescription:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update Prescription
export const updatePrescription = async (req, res) => {
    try {
        const { id } = req.params;
        const { medication_name, dosage, frequency, duration, instructions, status } = req.body;

        await db.query(
            'UPDATE prescriptions SET medication_name = ?, dosage = ?, frequency = ?, duration = ?, instructions = ?, status = ? WHERE id = ?',
            [medication_name, dosage, frequency, duration, instructions, status || 'pending', id]
        );

        res.json({ message: 'Prescription updated successfully' });
    } catch (error) {
        console.error('Error updating prescription:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete Prescription
export const deletePrescription = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM prescriptions WHERE id = ?', [id]);
        res.json({ message: 'Prescription deleted successfully' });
    } catch (error) {
        console.error('Error deleting prescription:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get Doctor Schedule
export const getSchedule = async (req, res) => {
    try {
        const doctorId = req.user.id;

        const [schedule] = await db.query(
            'SELECT * FROM doctor_schedules WHERE doctor_id = ? ORDER BY FIELD(day_of_week, "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday")',
            [doctorId]
        );

        res.json(schedule);
    } catch (error) {
        console.error('Error fetching schedule:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update Doctor Schedule
export const updateSchedule = async (req, res) => {
    try {
        const doctorId = req.user.id;
        const { schedules } = req.body; // Array of schedule objects

        // Delete existing schedules
        await db.query('DELETE FROM doctor_schedules WHERE doctor_id = ?', [doctorId]);

        // Insert new schedules
        if (schedules && schedules.length > 0) {
            const values = schedules.map(s => [doctorId, s.day_of_week, s.start_time, s.end_time, s.is_available]);
            await db.query(
                'INSERT INTO doctor_schedules (doctor_id, day_of_week, start_time, end_time, is_available) VALUES ?',
                [values]
            );
        }

        res.json({ message: 'Schedule updated successfully' });
    } catch (error) {
        console.error('Error updating schedule:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get Doctor Profile
export const getProfile = async (req, res) => {
    try {
        const doctorId = req.user.id;

        const [doctors] = await db.query(
            'SELECT id, email, name, department, specialization, phone, bio, experience, licenseNumber, consultationFee, address, education, certifications, languages, availability, hospital, created_at FROM doctors WHERE id = ?',
            [doctorId]
        );

        if (doctors.length === 0) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        const doctor = doctors[0];
        // Parse JSON fields
        if (typeof doctor.education === 'string') doctor.education = JSON.parse(doctor.education);
        if (typeof doctor.certifications === 'string') doctor.certifications = JSON.parse(doctor.certifications);
        if (typeof doctor.languages === 'string') doctor.languages = JSON.parse(doctor.languages);

        res.json(doctor);
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update Doctor Profile
export const updateProfile = async (req, res) => {
    try {
        const doctorId = req.user.id;
        const {
            name, department, specialization, phone, bio,
            experience, licenseNumber, consultationFee, address,
            education, certifications, languages, availability, hospital
        } = req.body;

        await db.query(
            `UPDATE doctors SET 
               name = ?, department = ?, specialization = ?, phone = ?, 
               bio = ?, experience = ?, licenseNumber = ?, consultationFee = ?, 
               address = ?, education = ?, certifications = ?, languages = ?,
               availability = ?, hospital = ? 
             WHERE id = ?`,
            [
                name, department, specialization, phone, bio,
                experience, licenseNumber, consultationFee, address,
                JSON.stringify(education || []),
                JSON.stringify(certifications || []),
                JSON.stringify(languages || []),
                availability,
                hospital,
                doctorId
            ]
        );

        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Register New Patient (from Doctor side)
export const registerPatient = async (req, res) => {
    try {
        const {
            email, password, firstName, lastName, dateOfBirth, gender, phone,
            address, bloodGroup, medicalHistory
        } = req.body;

        if (!firstName || !lastName || !phone) {
            return res.status(400).json({ message: 'Required fields missing' });
        }

        let hashedPassword = null;
        if (password) {
            hashedPassword = await bcrypt.hash(password, 10);
        } else {
            // Default password if none provided
            hashedPassword = await bcrypt.hash('patient123', 10);
        }

        const [result] = await db.query(
            `INSERT INTO patients 
       (email, password, firstName, lastName, dateOfBirth, gender, phone, address, bloodGroup, medicalHistory) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                email || null, hashedPassword, firstName, lastName, dateOfBirth || null,
                gender || 'Male', phone, address || null, bloodGroup || null, medicalHistory || null
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
