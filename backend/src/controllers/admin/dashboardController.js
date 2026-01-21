import db from '../../config/db.js';

export const getDashboardStats = async (req, res) => {
    try {
        const stats = {
            doctors: 0,
            patients: 0,
            appointments: 0,
            users: 0,
            revenue: 0 // Placeholder
        };

        const [doctorCount] = await db.query('SELECT COUNT(*) as count FROM doctors');
        stats.doctors = doctorCount[0].count;

        const [patientCount] = await db.query('SELECT COUNT(*) as count FROM patients');
        stats.patients = patientCount[0].count;

        const [appointmentCount] = await db.query('SELECT COUNT(*) as count FROM appointments');
        stats.appointments = appointmentCount[0].count;

        const [userCount] = await db.query('SELECT COUNT(*) as count FROM admins'); // Only admins + others
        stats.users = userCount[0].count + stats.doctors + stats.patients; // Approximate total users

        res.json(stats);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
