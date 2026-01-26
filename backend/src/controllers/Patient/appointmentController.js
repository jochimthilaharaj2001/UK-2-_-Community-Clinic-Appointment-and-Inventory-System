import db from '../../config/db.js';

export const bookAppointment = async (req, res) => {
    const { doctor_id, appointment_date, appointment_time, reason } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, reason, status) VALUES (?, ?, ?, ?, ?, ?)',
            [req.user.id, doctor_id, appointment_date, appointment_time, reason, 'PENDING']
        );
        res.status(201).json({ message: 'Appointment booked successfully', appointmentId: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getPatientAppointments = async (req, res) => {
    try {
        const [appointments] = await db.query(`
            SELECT a.*, d.name as doctor_name 
            FROM appointments a 
            JOIN doctors d ON a.doctor_id = d.id 
            WHERE a.patient_id = ? 
            ORDER BY a.appointment_date DESC, a.appointment_time DESC
        `, [req.user.id]);
        res.json(appointments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const cancelAppointment = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('UPDATE appointments SET status = ? WHERE id = ? AND patient_id = ?', ['CANCELLED', id, req.user.id]);
        res.json({ message: 'Appointment cancelled successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export default { bookAppointment, getPatientAppointments, cancelAppointment };
