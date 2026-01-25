import db from '../../config/db.js';

const bookAppointment = async (req, res) => {
    const { doctorId, date, time } = req.body;
    try {
        // Validation: Check if doctor already has an appointment at this time
        const [existing] = await db.execute(
            'SELECT id FROM appointments WHERE doctor_id = ? AND appointment_date = ? AND appointment_time = ? AND status != "CANCELLED"',
            [doctorId, date, time]
        );

        if (existing.length > 0) {
            return res.status(400).json({ message: 'Doctor is already booked for this time slot' });
        }

        await db.execute(
            'INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, status) VALUES (?, ?, ?, ?, "PENDING")',
            [req.user.id, doctorId, date, time]
        );

        // Add a notification for the patient
        await db.execute(
            'INSERT INTO notifications (user_id, user_type, title, message) VALUES (?, "PATIENT", "Appointment Booked", ?)',
            [req.user.id, `Your appointment request for ${date} at ${time} has been submitted.`]
        );

        res.status(201).json({ message: 'Appointment booked successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getPatientAppointments = async (req, res) => {
    try {
        const [rows] = await db.execute(`
            SELECT a.id, a.appointment_date as date, a.appointment_time as time, a.status, 
            d.name as doctor, d.specialization as type
            FROM appointments a 
            JOIN doctors d ON a.doctor_id = d.id 
            WHERE a.patient_id = ? 
            ORDER BY a.appointment_date DESC, a.appointment_time DESC
        `, [req.user.id]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const cancelAppointment = async (req, res) => {
    const { id } = req.params;
    try {
        // Check if appointment exists and is in a state that can be cancelled
        const [rows] = await db.execute('SELECT status FROM appointments WHERE id = ? AND patient_id = ?', [id, req.user.id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        if (rows[0].status === 'COMPLETED' || rows[0].status === 'REJECTED') {
            return res.status(400).json({ message: `Cannot cancel an appointment that is already ${rows[0].status}` });
        }

        await db.execute('UPDATE appointments SET status = "CANCELLED" WHERE id = ? AND patient_id = ?', [id, req.user.id]);

        // Add a notification
        await db.execute(
            'INSERT INTO notifications (user_id, user_type, title, message) VALUES (?, "PATIENT", "Appointment Cancelled", ?)',
            [req.user.id, `Your appointment ID ${id} has been cancelled successfully.`]
        );

        res.json({ message: 'Appointment cancelled successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export default {
    bookAppointment,
    getPatientAppointments,
    cancelAppointment
};
