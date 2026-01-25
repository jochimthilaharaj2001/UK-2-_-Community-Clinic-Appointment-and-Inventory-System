
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'clinic_system'
};

async function checkLogin() {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log('Connected to DB.');

        const email = 'patient@example.com';
        const rawPassword = '123456';

        // 1. Check if user exists
        const [rows] = await connection.execute('SELECT * FROM patients WHERE email = ?', [email]);

        if (rows.length === 0) {
            console.log('❌ User NOT FOUND in database.');
        } else {
            console.log('✅ User FOUND:', rows[0].email);
            const storedHash = rows[0].password;
            console.log('Stored Hash:', storedHash);

            // 2. Compare password
            const isMatch = await bcrypt.compare(rawPassword, storedHash);
            if (isMatch) {
                console.log('✅ Password MATCHES!');
            } else {
                console.log('❌ Password DOES NOT MATCH.');

                // FORCE UPDATE
                console.log('⚠️ Updating password to ensure it works...');
                const newHash = await bcrypt.hash(rawPassword, 10);
                await connection.execute('UPDATE patients SET password = ? WHERE email = ?', [newHash, email]);
                console.log('✅ Password updated to 123456');
            }
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        if (connection) await connection.end();
    }
}

checkLogin();
