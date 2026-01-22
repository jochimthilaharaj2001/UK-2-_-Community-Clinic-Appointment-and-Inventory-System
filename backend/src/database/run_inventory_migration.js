import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });

async function runMigration() {
    try {
        // Import db dynamically to ensure env vars are loaded first
        const { default: db } = await import('../config/db.js');

        const sqlPath = path.join(__dirname, 'inventory_migration.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        console.log('Running inventory migration...');

        const statements = sql.split(/;\s*$/m);

        const connection = await db.getConnection();

        for (const statement of statements) {
            if (statement.trim().length > 0) {
                try {
                    await connection.query(statement);
                    console.log('Executed statement');
                } catch (err) {
                    console.error('Error executing statement:', err.message);
                }
            }
        }

        console.log('Inventory migration completed successfully.');
        connection.release();
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

runMigration();
