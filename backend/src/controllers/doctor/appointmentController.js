import db from '../../config/db.js';

export const getDoctorAppointments = async (req, res) => {
    const doctorId = req.user.id;
    try {
        const [appointments] = await db.query(`
            SELECT a.*, p.name as patientName 
            FROM appointments a
            JOIN patients p ON a.patient_id = p.id
            WHERE a.doctor_id = ? 
            ORDER BY a.appointment_date DESC, a.appointment_time ASC
        `, [doctorId]);
        res.json(appointments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateAppointmentStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body; // confirmed, cancelled, completed
    const doctorId = req.user.id;

    try {
        // Verify appointment belongs to doctor
        const [app] = await db.query('SELECT * FROM appointments WHERE id = ? AND doctor_id = ?', [id, doctorId]);
        if (app.length === 0) return res.status(404).json({ message: 'Appointment not found or unauthorized' });

        await db.query('UPDATE appointments SET status = ? WHERE id = ?', [status, id]);
        res.json({ message: 'Appointment updated' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
