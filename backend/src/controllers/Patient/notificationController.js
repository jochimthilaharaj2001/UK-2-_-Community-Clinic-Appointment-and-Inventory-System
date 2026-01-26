import db from '../../config/db.js';

export const getNotifications = async (req, res) => {
    try {
        const [notifications] = await db.query('SELECT * FROM notifications WHERE patient_id = ? ORDER BY created_at DESC', [req.user.id]);
        res.json(notifications);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const markAsRead = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('UPDATE notifications SET is_read = 1 WHERE id = ? AND patient_id = ?', [id, req.user.id]);
        res.json({ message: 'Notification marked as read' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const deleteNotification = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM notifications WHERE id = ? AND patient_id = ?', [id, req.user.id]);
        res.json({ message: 'Notification deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export default { getNotifications, markAsRead, deleteNotification };
