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
        const [patientCount] = await db.query('SELECT COUNT(*) as count FROM patients');
        const [appointmentCount] = await db.query('SELECT COUNT(*) as count FROM appointments');
        const [todayAppCount] = await db.query('SELECT COUNT(*) as count FROM appointments WHERE appointment_date = CURDATE()');
        const [receptionistCount] = await db.query('SELECT COUNT(*) as count FROM receptionists');
        const [adminCount] = await db.query('SELECT COUNT(*) as count FROM admins');
        const [pharmacistCount] = await db.query('SELECT COUNT(*) as count FROM pharmacists');

        res.json({
            totalDoctors: doctorCount[0].count,
            totalPatients: patientCount[0].count,
            totalAppointments: appointmentCount[0].count,
            todayAppointments: todayAppCount[0].count,
            totalUsers: doctorCount[0].count + patientCount[0].count + receptionistCount[0].count + adminCount[0].count + pharmacistCount[0].count,
            lowStockItems: 12,
            monthlyRevenue: 15400,
            satisfactionRate: 4.8
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
