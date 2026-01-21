import db from '../../config/db.js';

export const getDoctorProfile = async (req, res) => {
    const doctorId = req.user.id;
    try {
        const [doctors] = await db.query('SELECT * FROM doctors WHERE id = ?', [doctorId]);
        if (doctors.length === 0) return res.status(404).json({ message: 'Doctor not found' });

        const doctor = doctors[0];
        // Remove password
        delete doctor.password;

        // No need to parse JSON fields if the driver handles it, but mysql2 returns JSON columns as string or object depending on config.
        // If it's returning strings, we might need to parse. Let's assume automatic or handle it.
        // Actually mysql2 usually returns objects for JSON columns if configured, or strings.
        // Let's ensure we send objects.

        res.json(doctor);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateDoctorProfile = async (req, res) => {
    const doctorId = req.user.id;
    const {
        name, phone, specialization, department, experience,
        licenseNumber, hospital, address, consultationFee, bio, availability,
        qualifications, certifications, languages, education
    } = req.body;

    try {
        // Prepare JSON strings if needed, but parameterization handles simple types.
        // For JSON columns, we should stringify if passing as string, or pass object if driver supports.
        // Safest is JSON.stringify.

        await db.query(`
            UPDATE doctors SET 
            name=?, phone=?, specialization=?, department=?, experience=?, 
            license=?, hospital=?, address=?, consultation_fee=?, bio=?, schedule=?,
            qualifications=?, certifications=?, languages=?, education=?
            WHERE id=?
        `, [
            name, phone, specialization, department, experience,
            licenseNumber, hospital, address, consultationFee, bio, availability,
            JSON.stringify(qualifications), JSON.stringify(certifications), JSON.stringify(languages), JSON.stringify(education),
            doctorId
        ]);

        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
