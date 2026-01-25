import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, 'backend', '.env') });

import db from './backend/src/config/db.js';

async function checkTable() {
    try {
        const [columns] = await db.query('SHOW COLUMNS FROM doctors');
        console.log('Columns in doctors table:');
        columns.forEach(col => console.log(`- ${col.Field} (${col.Type})`));
        process.exit(0);
    } catch (error) {
        console.error('Error checking table:', error.message);
        process.exit(1);
    }
}

checkTable();
