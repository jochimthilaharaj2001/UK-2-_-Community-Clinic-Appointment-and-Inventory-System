import db from './src/config/db.js';
import bcrypt from 'bcryptjs';

const fixSchema = async () => {
    try {
        const hashedPassword = await bcrypt.hash('123456', 10);

        console.log('Creating admins table...');
        await db.query(`
            CREATE TABLE IF NOT EXISTS admins (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        console.log('Creating receptionists table...');
        await db.query(`
            CREATE TABLE IF NOT EXISTS receptionists (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Seed an admin if none exists
        const [admins] = await db.query('SELECT * FROM admins WHERE email = ?', ['admin@example.com']);
        if (admins.length === 0) {
            await db.query('INSERT INTO admins (name, email, password) VALUES (?, ?, ?)', ['Admin User', 'admin@example.com', hashedPassword]);
        }

        console.log('Schema fixed and seeded.');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

fixSchema();
