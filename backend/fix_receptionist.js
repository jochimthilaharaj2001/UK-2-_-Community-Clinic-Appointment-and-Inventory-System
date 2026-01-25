import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

async function fixReceptionistTable() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        console.log('Checking for phone column...');
        const [columns] = await connection.query('DESCRIBE receptionists');
        const hasPhone = columns.some(col => col.Field === 'phone');

        if (!hasPhone) {
            console.log('Adding phone column...');
            await connection.query('ALTER TABLE receptionists ADD COLUMN phone VARCHAR(20) AFTER password');
        }

        console.log('Seeding receptionist...');
        const hashedPassword = await bcrypt.hash('reception123', 10);

        // Use INSERT IGNORE or check existence
        const [existing] = await connection.query('SELECT id FROM receptionists WHERE email = ?', ['reception@clinic.com']);

        if (existing.length === 0) {
            await connection.query(
                'INSERT INTO receptionists (name, email, password, phone, status) VALUES (?, ?, ?, ?, ?)',
                ['Jessica Reception', 'reception@clinic.com', hashedPassword, '123-456-7890', 'active']
            );
            console.log('Receptionist created successfully.');
        } else {
            console.log('Receptionist already exists, updating password...');
            await connection.query(
                'UPDATE receptionists SET password = ?, phone = ?, status = ? WHERE email = ?',
                [hashedPassword, '123-456-7890', 'active', 'reception@clinic.com']
            );
            console.log('Receptionist updated successfully.');
        }

        await connection.end();
    } catch (error) {
        console.error('Error:', error);
    }
}

fixReceptionistTable();
