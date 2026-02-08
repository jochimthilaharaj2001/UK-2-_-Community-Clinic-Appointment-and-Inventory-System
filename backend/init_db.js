
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
};

const init = async () => {
    try {
        // 1. Create Connection to MySQL Server
        const connection = await mysql.createConnection(dbConfig);
        console.log('Connected to MySQL server.');

        // 2. Create Database
        await connection.query('CREATE DATABASE IF NOT EXISTS clinic_system');
        console.log('Database clinic_system created or exists.');

        // 3. Use Database
        await connection.changeUser({ database: 'clinic_system' });

        // 4. Create Tables (Drop existing to ensure schema update)
        await connection.query('SET FOREIGN_KEY_CHECKS = 0');

        const dropTables = [
            'DROP TABLE IF EXISTS admins',
            'DROP TABLE IF EXISTS pharmacists',
            'DROP TABLE IF EXISTS doctors',
            'DROP TABLE IF EXISTS receptionists',
            'DROP TABLE IF EXISTS patients'
        ];

        for (const sql of dropTables) {
            await connection.query(sql);
        }

        const tables = [
            `CREATE TABLE admins (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        department VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
            `CREATE TABLE pharmacists (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        department VARCHAR(255),
        licenseNumber VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
            `CREATE TABLE doctors (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        department VARCHAR(255),
        specialization VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
            `CREATE TABLE receptionists (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        department VARCHAR(255),
        location VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
            `CREATE TABLE patients (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE,
        password VARCHAR(255),
        firstName VARCHAR(255) NOT NULL,
        lastName VARCHAR(255) NOT NULL,
        dateOfBirth DATE,
        gender VARCHAR(50),
        phone VARCHAR(50),
        address TEXT,
        emergencyContact VARCHAR(255),
        emergencyPhone VARCHAR(50),
        bloodGroup VARCHAR(10),
        allergies TEXT,
        medicalHistory TEXT,
        currentMedications TEXT,
        insuranceProvider VARCHAR(255),
        insuranceId VARCHAR(255),
        policyNumber VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`
        ];

        for (const sql of tables) {
            await connection.query(sql);
        }
        await connection.query('SET FOREIGN_KEY_CHECKS = 1');
        console.log('Tables created successfully.');

        // 5. Seed Data
        const adminPass = await bcrypt.hash('admin123', 10);
        const pharmaPass = await bcrypt.hash('pharma123', 10);
        const doctorPass = await bcrypt.hash('doctor123', 10);
        const receptPass = await bcrypt.hash('reception123', 10);
        const patientPass = await bcrypt.hash('password123', 10);

        // Helper to insert if not exists (using ON DUPLICATE KEY UPDATE to avoid errors)
        // Actually, let's just DELETE and INSERT to reset demo data

        await connection.query('DELETE FROM admins WHERE email="admin@clinic.com"');
        await connection.query('INSERT INTO admins (email, password, name, department) VALUES (?, ?, ?, ?)',
            ['admin@clinic.com', adminPass, 'Admin User', 'Administration']);

        await connection.query('DELETE FROM pharmacists WHERE email="pharmacist@clinic.com"');
        await connection.query('INSERT INTO pharmacists (email, password, name, department, licenseNumber) VALUES (?, ?, ?, ?, ?)',
            ['pharmacist@clinic.com', pharmaPass, 'John Pharmacist', 'Pharmacy', 'PHARM12345']);

        await connection.query('DELETE FROM doctors WHERE email="doctor@clinic.com"');
        await connection.query('INSERT INTO doctors (email, password, name, department, specialization) VALUES (?, ?, ?, ?, ?)',
            ['doctor@clinic.com', doctorPass, 'Dr. Jane Smith', 'General Medicine', 'General Practitioner']);

        await connection.query('DELETE FROM receptionists WHERE email="reception@clinic.com"');
        await connection.query('INSERT INTO receptionists (email, password, name, department, location) VALUES (?, ?, ?, ?, ?)',
            ['reception@clinic.com', receptPass, 'Jessica Reception', 'Front Desk', 'Main Reception']);

        await connection.query('DELETE FROM patients WHERE email="patient@clinic.com"');
        await connection.query('INSERT INTO patients (email, password, firstName, lastName, phone, bloodGroup) VALUES (?, ?, ?, ?, ?, ?)',
            ['patient@clinic.com', patientPass, 'John', 'Doe', '1234567890', 'O+']);

        console.log('Database initialized and seeded successfully.');
        process.exit(0);

    } catch (error) {
        console.error('Initialization failed:', error);
        process.exit(1);
    }
};

init();
