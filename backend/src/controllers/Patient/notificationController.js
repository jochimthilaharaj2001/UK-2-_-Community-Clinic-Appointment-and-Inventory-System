import db from '../../config/db.js';

const getNotifications = async (req, res) => {
    try {
        const [rows] = await db.execute(
            'SELECT * FROM notifications WHERE user_type = "PATIENT" AND user_id = ? ORDER BY created_at DESC',
            [req.user.id]
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const markAsRead = async (req, res) => {
    try {
        await db.execute('UPDATE notifications SET is_read = TRUE WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
        res.json({ message: 'Marked as read' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteNotification = async (req, res) => {
    try {
        await db.execute('DELETE FROM notifications WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
        res.json({ message: 'Deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export default {
    getNotifications,
    markAsRead,
    deleteNotification
};
