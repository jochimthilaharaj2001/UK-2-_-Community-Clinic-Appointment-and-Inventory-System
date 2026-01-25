import db from './src/config/db.js';
import bcrypt from 'bcryptjs';

const resetPassword = async () => {
    try {
        const hashedPassword = await bcrypt.hash('123456', 10);

        // Check if Sarah exists
        const [doctors] = await db.query('SELECT * FROM doctors WHERE email = ?', ['sarah@example.com']);

        if (doctors.length === 0) {
            console.log('Sarah not found, creating her...');
            await db.query(
                'INSERT INTO doctors (name, email, password, specialization, department) VALUES (?, ?, ?, ?, ?)',
                ['Dr. Sarah Silva', 'sarah@example.com', hashedPassword, 'General Practitioner', 'General Medicine']
            );
        } else {
            console.log('Updating Sarah\'s password...');
            await db.query('UPDATE doctors SET password = ? WHERE email = ?', [hashedPassword, 'sarah@example.com']);
        }

        // Also check admin while we are at it
        const [admins] = await db.query('SELECT * FROM admins WHERE email = ?', ['admin@example.com']);
        if (admins.length > 0) {
            console.log('Updating Admin\'s password...');
            await db.query('UPDATE admins SET password = ? WHERE email = ?', [hashedPassword, 'admin@example.com']);
        }

        console.log('Passwords reset successfully to 123456');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

resetPassword();
