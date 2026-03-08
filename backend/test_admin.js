
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'narasimha',
    database: process.env.DB_NAME || 'clinic_system',
};

async function test() {
    try {
        const connection = await mysql.createConnection(dbConfig);
        console.log('Successfully connected.');
        const [rows] = await connection.query('SELECT * FROM inventory WHERE generic_name = ?', ['sanchevini']);
        console.log('Inventory item:', rows);
        await connection.end();
    } catch (err) {
        console.error('Error:', err.message);
    }
}

test();
