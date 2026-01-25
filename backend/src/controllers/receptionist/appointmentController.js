import db from '../../config/db.js';

export const bookAppointment = async (req, res) => {
    const { patientId, patientName, doctor, department, date, time, duration, type, contact, notes } = req.body;

    try {
        // Resolve Doctor ID if possible
        let doctorId = null;
        if (doctor) {
            const docName = doctor.split(' - ')[0];
            const [docs] = await db.query('SELECT id FROM doctors WHERE name LIKE ?', [`%${docName}%`]);
            if (docs.length > 0) doctorId = docs[0].id;
        }

        const [result] = await db.query(
            `INSERT INTO appointments (
                patient_id, patient_name, doctor_id, doctor_name, 
                appointment_date, appointment_time, date, time, 
                duration, type, status, contact, notes
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                patientId, patientName, doctorId, doctor,
                date, time, date, time,
                duration, type, 'pending', contact, notes
            ]
        );

        res.status(201).json({ message: 'Appointment booked', id: result.insertId });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const checkInPatient = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('UPDATE appointments SET status = ? WHERE id = ?', ['checked-in', id]);
        res.json({ message: 'Patient checked in' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getTodayAppointments = async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];
        const [rows] = await db.query(`
            SELECT a.*, p.name as patient_name
            FROM appointments a 
            LEFT JOIN patients p ON a.patient_id = p.id
            WHERE a.appointment_date = ? 
            ORDER BY a.appointment_time ASC
        `, [today]);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getAllAppointments = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT a.*, p.name as patient_name
            FROM appointments a 
            LEFT JOIN patients p ON a.patient_id = p.id
            ORDER BY a.appointment_date DESC, a.appointment_time DESC
        `);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateAppointmentStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        await db.query('UPDATE appointments SET status = ? WHERE id = ?', [status, id]);
        res.json({ message: 'Appointment status updated' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
