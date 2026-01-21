import db from '../../config/db.js';

export const getAllDoctors = async (req, res) => {
    try {
        const [doctors] = await db.query('SELECT * FROM doctors ORDER BY created_at DESC');
        res.json(doctors);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getDoctorById = async (req, res) => {
    const { id } = req.params;
    try {
        const [doctors] = await db.query('SELECT * FROM doctors WHERE id = ?', [id]);
        if (doctors.length === 0) {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        res.json(doctors[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const createDoctor = async (req, res) => {
    const { name, email, phone, specialization, department, experience, schedule, license, education, office, bio } = req.body;

    // Basic validation
    if (!name || !email || !specialization) {
        return res.status(400).json({ message: 'Please provide required fields' });
    }

    try {
        const [result] = await db.query(
            `INSERT INTO doctors (name, email, phone, specialization, department, experience, schedule, license, education, office, bio) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [name, email, phone, specialization, department, experience, schedule, license, education, office, bio]
        );

        res.status(201).json({ id: result.insertId, ...req.body });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'Email already exists' });
        }
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateDoctor = async (req, res) => {
    const { id } = req.params;
    const { name, email, phone, specialization, department, experience, schedule, license, education, office, bio, status, available } = req.body;

    try {
        // If status is updated, it might affect "available" field if we had one explicit,
        // but in schema we used 'status' enum. Frontend might send 'available' boolean.
        // For now just update fields present.

        await db.query(
            `UPDATE doctors SET 
        name = ?, email = ?, phone = ?, specialization = ?, department = ?, 
        experience = ?, schedule = ?, license = ?, education = ?, office = ?, bio = ?, status = ?
       WHERE id = ?`,
            [name, email, phone, specialization, department, experience, schedule, license, education, office, bio, status, id]
        );

        res.json({ message: 'Doctor updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const deleteDoctor = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM doctors WHERE id = ?', [id]);
        res.json({ message: 'Doctor deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
