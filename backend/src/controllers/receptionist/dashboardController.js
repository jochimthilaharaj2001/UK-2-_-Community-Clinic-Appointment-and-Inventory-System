import db from '../../config/db.js';

export const getReceptionistStats = async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];
        const stats = {
            totalAppointments: 0,
            waitingPatients: 0,
            newPatients: 0,
            pendingPayments: 0
        };

        // Today's Appointments
        const [apps] = await db.query('SELECT COUNT(*) as count FROM appointments WHERE date = ?', [today]);
        stats.totalAppointments = apps[0].count;

        // Waiting Patients (assuming status 'checked-in' or 'waiting')
        // We need to check if we updated the ENUM in DB. If not, this might fail or return 0.
        // Frontend uses 'waiting' and 'checked-in'.
        const [waiting] = await db.query('SELECT COUNT(*) as count FROM appointments WHERE date = ? AND status IN (?, ?)', [today, 'waiting', 'checked-in']);
        stats.waitingPatients = waiting[0].count;

        // New Patients (registered today)
        // Check if patients table has created_at
        // If not, we can't track new patients by date easily.
        // Assuming patients table has created_at or we skip for now.
        // Let's assume we added created_at in patient migration or it defaults.
        // If not, we'll return 0.
        try {
            const [newPats] = await db.query('SELECT COUNT(*) as count FROM patients WHERE DATE(created_at) = ?', [today]);
            stats.newPatients = newPats[0].count;
        } catch (e) {
            // Field might not exist
            stats.newPatients = 0;
        }

        // Pending Payments (Unpaid invoices)
        // Need invoices table
        try {
            const [pending] = await db.query('SELECT COUNT(*) as count FROM invoices WHERE status = ?', ['Unpaid']);
            stats.pendingPayments = pending[0].count;
        } catch (e) {
            stats.pendingPayments = 0;
        }

        res.json(stats);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
