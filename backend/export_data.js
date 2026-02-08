import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'clinic_system',
};

const tables = [
    'admins',
    'pharmacists',
    'doctors',
    'receptionists',
    'patients',
    'appointments',
    'medical_records',
    'prescriptions',
    'inventory',
    'invoices',
    'notifications',
    'doctor_schedules'
];

async function exportData() {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log('Connected to database...');

        const exportData = {};

        for (const table of tables) {
            console.log(`Fetching data from ${table}...`);
            try {
                const [rows] = await connection.query(`SELECT * FROM ${table}`);
                exportData[table] = rows;
            } catch (err) {
                console.warn(`Could not fetch data from ${table}: ${err.message}`);
                exportData[table] = [];
            }
        }

        const outputPath = path.join(__dirname, '..', 'database', 'data_export.json');

        // Ensure directory exists
        await fs.mkdir(path.dirname(outputPath), { recursive: true });

        await fs.writeFile(outputPath, JSON.stringify(exportData, null, 2));
        console.log(`\n✅ All data exported successfully to: ${outputPath}`);

    } catch (error) {
        console.error('❌ Export failed:', error);
    } finally {
        if (connection) await connection.end();
    }
}

exportData();
