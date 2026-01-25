import db from '../../config/db.js';

const getDoctors = async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT id, name, specialization, availability, rating FROM doctors');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export default {
    getDoctors
};
