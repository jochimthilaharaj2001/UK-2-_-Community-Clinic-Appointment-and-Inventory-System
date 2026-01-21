import db from '../../config/db.js';

export const getAllAppointments = async (req, res) => {
    try {
        const [appointments] = await db.query('SELECT * FROM appointments ORDER BY date DESC, time ASC');
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

    try {
        const [result] = await db.query(
            `INSERT INTO appointments (
        patient_name, patient_id, patient_age, patient_gender,
        doctor_id, date, time, duration, type, reason, notes, contact, email, room, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
            [
                patientName, patientId, patientAge, patientGender,
                doctorId, date, time, duration, type, reason, notes, contact, email, room
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
