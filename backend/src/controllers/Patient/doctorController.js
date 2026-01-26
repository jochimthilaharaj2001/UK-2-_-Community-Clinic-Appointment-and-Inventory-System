import db from '../../config/db.js';

export const getDoctors = async (req, res) => {
    try {
        const [doctors] = await db.query('SELECT id, name, specialization, department FROM doctors WHERE status = "ACTIVE"');
        res.json(doctors);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export default { getDoctors };
