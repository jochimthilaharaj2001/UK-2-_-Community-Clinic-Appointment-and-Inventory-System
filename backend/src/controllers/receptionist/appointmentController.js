import db from '../../config/db.js';

export const bookAppointment = async (req, res) => {
    const { patientId, doctorName, date, time, type, notes } = req.body;
    // Frontend sends doctorName usually, need to resolve doctor_id if possible

    try {
        // Resolve Doctor ID
        let doctorId = null;
        if (req.body.doctor) {
            // Frontend might send "Dr. Name - Spec", need to parse or loose match
            // OR frontend sends ID? The 'BookAppointment.jsx' sends `doctor: "Dr. Name..."` string.
            // We should try to find.
            const docName = req.body.doctor.split(' - ')[0]; // Basic split attempt
            const [docs] = await db.query('SELECT id FROM doctors WHERE name LIKE ?', [`%${docName}%`]);
            if (docs.length > 0) doctorId = docs[0].id;
        }

        const [result] = await db.query(
            'INSERT INTO appointments (patient_id, doctor_id, doctor_name, date, time, type, status, reason) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [patientId, doctorId, req.body.doctor, date, time, type, 'scheduled', notes]
        );

        res.status(201).json({ message: 'Appointment booked', id: result.insertId });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const checkInPatient = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('UPDATE appointments SET status = ? WHERE id = ?', ['checked-in', id]);
        res.json({ message: 'Patient checked in' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
