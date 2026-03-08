
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
    console.log('Successfully connected to the database.');
    const [rows] = await connection.query('SHOW TABLES');
    console.log('Tables:', rows);
    await connection.end();
  } catch (err) {
    console.error('Database connection failed:', err.message);
  }
}

test();
