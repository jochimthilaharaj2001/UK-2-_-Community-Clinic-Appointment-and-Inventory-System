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

import db from '../config/db.js';

async function runMigration() {
    try {
        console.log('Running doctor migration...');

        // Read SQL file
        const sqlPath = path.join(__dirname, 'doctor_migration.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        // Split queries (simple split by semicolon, might need more robust parsing if queries contain semicolons)
        // For this simple script, we'll try to execute one by one or as a whole if the driver supports multiple statements.
        // mysql2 supports multipleStatements: true in connection config, but our db.js might not have it.
        // Let's try running statement by statement.

        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            multipleStatements: true
        });

        await connection.query(sql);

        console.log('Schema updated successfully.');

        // Now seeded data: Update Doctor Password
        const hashedPassword = await bcrypt.hash('doctor123', 10);

        // Update first doctor or create if not exists
        const [doctors] = await connection.query('SELECT * FROM doctors LIMIT 1');
        if (doctors.length > 0) {
            await connection.query('UPDATE doctors SET password = ? WHERE id = ?', [hashedPassword, doctors[0].id]);
            console.log('Updated default doctor password.');
        } else {
            await connection.query(`
                INSERT INTO doctors (name, email, password, specialization, department, experience, schedule, license, education, office, bio)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [
                'Dr. Jane Smith',
                'doctor@clinic.com',
                hashedPassword,
                'General Practitioner',
                'General Medicine',
                '8 years',
                'Mon-Fri 9-5',
                'LIC-12345',
                'MBBS',
                'Room 101',
                'Experienced GP.'
            ]);
            console.log('Created default doctor account.');
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
