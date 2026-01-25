import db from './src/config/db.js';
import bcrypt from 'bcryptjs';

const setupAdmin = async () => {
    try {
        const hashedPassword = await bcrypt.hash('123456', 10);
        const email = 'admin@clinic.com';

        console.log('Checking for admin user...');
        const [rows] = await db.query('SELECT * FROM admins WHERE email = ?', [email]);

        if (rows.length > 0) {
            console.log('Admin user found. Resetting password...');
            await db.query('UPDATE admins SET password = ? WHERE email = ?', [hashedPassword, email]);
            console.log('Password reset successfully.');
        } else {
            console.log('Admin user not found. Creating new admin...');
            await db.query('INSERT INTO admins (name, email, password) VALUES (?, ?, ?)', ['Super Admin', email, hashedPassword]);
            console.log('Admin user created successfully.');
        }

        console.log('Checking for receptionist user...');
        const recEmail = 'reception@example.com';
        const [recRows] = await db.query('SELECT * FROM receptionists WHERE email = ?', [recEmail]);
        if (recRows.length === 0) {
            console.log('Receptionist not found. Creating...');
            await db.query('INSERT INTO receptionists (name, email, password) VALUES (?, ?, ?)', ['Main Receptionist', recEmail, hashedPassword]);
            console.log('Receptionist created.');
        }

        console.log('Final Credentials:');
        console.log('Admin:', email, '/ 123456');
        console.log('Receptionist:', recEmail, '/ 123456');

        process.exit(0);
    } catch (err) {
        console.error('Error during admin setup:', err);
        process.exit(1);
    }
};

setupAdmin();
