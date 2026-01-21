import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

// Load env vars from .env file in backend root
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });

async function runMigration() {
    try {
        console.log('Running receptionist migration...');

        // Read SQL file
        const sqlPath = path.join(__dirname, 'receptionist_migration.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            multipleStatements: true
        });

        await connection.query(sql);

        console.log('Schema updated successfully.');

        // Seed Default Receptionist
        const hashedPassword = await bcrypt.hash('reception123', 10);

        const [users] = await connection.query('SELECT * FROM receptionists WHERE email = ?', ['reception@clinic.com']);
        if (users.length === 0) {
            await connection.query(`
                INSERT INTO receptionists (name, email, password, phone)
                VALUES (?, ?, ?, ?)
            `, [
                'Jessica Reception',
                'reception@clinic.com',
                hashedPassword,
                '123-456-7890'
            ]);
            console.log('Created default receptionist account.');
        } else {
            // Optional: update password if needed
            // await connection.query('UPDATE receptionists SET password = ? WHERE id = ?', [hashedPassword, users[0].id]);
            console.log('Receptionist account already exists.');
        }

        await connection.end();
        console.log('Migration complete.');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

runMigration();
