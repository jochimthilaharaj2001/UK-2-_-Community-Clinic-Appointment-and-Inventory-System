import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, 'backend', '.env') });

const db = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'clinic_system'
});

async function fixTable() {
    try {
        console.log('Adding missing columns to doctors table...');

        // Add schedule if missing
        try {
            await db.query('ALTER TABLE doctors ADD COLUMN schedule VARCHAR(100) AFTER experience');
            console.log('- Added schedule column');
        } catch (e) {
            console.log('- schedule column already exists or error:', e.message);
        }

        // Add office if missing
        try {
            await db.query('ALTER TABLE doctors ADD COLUMN office VARCHAR(100) AFTER education');
            console.log('- Added office column');
        } catch (e) {
            console.log('- office column already exists or error:', e.message);
        }

        // Change education from JSON to VARCHAR if it's JSON to match the code's string input
        try {
            await db.query('ALTER TABLE doctors MODIFY COLUMN education VARCHAR(200)');
            console.log('- Modified education column to VARCHAR');
        } catch (e) {
            console.log('- Error modifying education column:', e.message);
        }

        console.log('Table fix completed.');
        process.exit(0);
    } catch (error) {
        console.error('Fix failed:', error.message);
        process.exit(1);
    }
}

fixTable();
