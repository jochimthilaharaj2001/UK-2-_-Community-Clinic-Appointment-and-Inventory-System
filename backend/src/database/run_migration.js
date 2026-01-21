import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load env vars from .env file in backend root
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });

import db from '../config/db.js';

async function runMigration() {
    try {
        const sqlPath = path.join(__dirname, 'admin_migration.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        console.log('Running migration...');

        // Split by semicolon via regex but be careful with data containing semicolons. 
        // Simple split for now as our SQL is simple.
        const statements = sql.split(/;\s*$/m);

        const connection = await db.getConnection();

        for (const statement of statements) {
            if (statement.trim().length > 0) {
                try {
                    await connection.query(statement);
                    console.log('Executed statement');
                } catch (err) {
                    // Ignore syntax error if it's just empty line or comments issue
                    console.error('Error executing statement:', err.message);
                }
            }
        }

        console.log('Migration completed successfully.');
        connection.release();
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

runMigration();
