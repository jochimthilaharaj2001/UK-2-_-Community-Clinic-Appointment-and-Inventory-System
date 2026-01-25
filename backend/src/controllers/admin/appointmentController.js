import db from '../../config/db.js';

export const getAllAppointments = async (req, res) => {
    try {
        const [appointments] = await db.query('SELECT * FROM appointments ORDER BY appointment_date DESC, appointment_time ASC');
        res.json(appointments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const createAppointment = async (req, res) => {
    const {
        patientName, patientId, patientAge, patientGender,
        doctorId, doctorName, doctorSpecialization,
        date, time, duration, type, reason, notes, contact, email, room
    } = req.body;

    // Extract numeric ID if prefixed (e.g., "P1" -> 1)
    const numericPatientId = patientId ? parseInt(patientId.toString().replace(/[^\d]/g, '')) : null;

    try {
        const [result] = await db.query(
            `INSERT INTO appointments (
        patient_name, patient_id, doctor_id, doctor_name, appointment_date, appointment_time, 
        duration, type, reason, notes, contact, email, room, status, date, time
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'scheduled', ?, ?)`,
            [
                patientName, numericPatientId, doctorId, doctorName, date, time,
                duration, type, reason, notes, contact, email, room, date, time
            ]
        );

        res.status(201).json({ id: result.insertId, message: 'Appointment created successfully' });
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

export const deleteAppointment = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM appointments WHERE id = ?', [id]);
        res.json({ message: 'Appointment deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
