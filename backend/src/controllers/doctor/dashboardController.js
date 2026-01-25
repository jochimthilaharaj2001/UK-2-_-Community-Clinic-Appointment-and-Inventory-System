import db from '../../config/db.js';

export const getDoctorStats = async (req, res) => {
    const doctorId = req.user.id; // From auth middleware

    try {
        const stats = {
            todayAppointments: 0,
            totalPatients: 0,
            pendingPrescriptions: 0,
            satisfactionRate: 4.8, // Hardcoded for now or fetch from reviews table if exists
            monthlyEarnings: 0,
            availableSlots: 0 // logic to calculate remaining slots
        };

        // Today's Appointments
        const today = new Date().toISOString().split('T')[0];
        const [todayApps] = await db.query(
            'SELECT COUNT(*) as count FROM appointments WHERE doctor_id = ? AND date = ?',
            [doctorId, today]
        );
        stats.todayAppointments = todayApps[0].count;

        // Total Unique Patients
        const [patients] = await db.query(
            'SELECT COUNT(DISTINCT patient_id) as count FROM appointments WHERE doctor_id = ?',
            [doctorId]
        );
        stats.totalPatients = patients[0].count;

        // Pending Prescriptions (assuming we have a status column or counting un-dispensed)
        // For now, let's count appointments that are 'completed' but maybe don't have a linked prescription?
        // Or just query prescriptions table if we added doctor_id
        const [prescriptions] = await db.query(
            'SELECT COUNT(*) as count FROM prescriptions WHERE doctor_id = ? AND status = ?',
            [doctorId, 'PENDING']
        );
        stats.pendingPrescriptions = prescriptions[0].count;

        // Monthly Earnings (sum of consultation fees for completed appointments this month)
        const [fees] = await db.query('SELECT consultation_fee FROM doctors WHERE id = ?', [doctorId]);
        const fee = fees.length ? parseFloat(fees[0].consultation_fee) || 0 : 0;

        const [monthApps] = await db.query(
            'SELECT COUNT(*) as count FROM appointments WHERE doctor_id = ? AND MONTH(date) = MONTH(CURRENT_DATE()) AND YEAR(date) = YEAR(CURRENT_DATE()) AND status = ?',
            [doctorId, 'completed']
        );
        stats.monthlyEarnings = fee * monthApps[0].count;

        // Available Slots calculation
        // Assuming 10 slots per day maximum per doctor
        const MAX_SLOTS_PER_DAY = 10;
        const [slotsCount] = await db.query(
            'SELECT COUNT(*) as count FROM appointments WHERE doctor_id = ? AND date = ? AND status != ?',
            [doctorId, today, 'cancelled']
        );
        stats.availableSlots = Math.max(0, MAX_SLOTS_PER_DAY - slotsCount[0].count);

        res.json(stats);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
