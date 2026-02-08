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
            'DROP TABLE IF EXISTS doctor_schedules',
            'DROP TABLE IF EXISTS notifications',
            'DROP TABLE IF EXISTS invoices',
            'DROP TABLE IF EXISTS medical_records',
            'DROP TABLE IF EXISTS prescriptions',
            'DROP TABLE IF EXISTS appointments',
            'DROP TABLE IF EXISTS inventory',
            'DROP TABLE IF EXISTS admins',
            'DROP TABLE IF EXISTS pharmacists',
            'DROP TABLE IF EXISTS doctors',
            'DROP TABLE IF EXISTS receptionists',
            'DROP TABLE IF EXISTS patients'
        ];

        for (const sql of dropTables) {
            await connection.query(sql);
        }
        console.log('Old tables dropped.');

        // Create all tables
        const tables = [
            // User tables
            `CREATE TABLE admins (
                id INT AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                name VARCHAR(255) NOT NULL,
                department VARCHAR(255),
                status VARCHAR(50) DEFAULT 'active',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`,
            `CREATE TABLE pharmacists (
                id INT AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                name VARCHAR(255) NOT NULL,
                department VARCHAR(255),
                licenseNumber VARCHAR(255),
                status VARCHAR(50) DEFAULT 'active',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`,
            `CREATE TABLE doctors (
                id INT AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                name VARCHAR(255) NOT NULL,
                department VARCHAR(255),
                specialization VARCHAR(255),
                phone VARCHAR(50),
                status VARCHAR(50) DEFAULT 'active',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`,
            `CREATE TABLE receptionists (
                id INT AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                name VARCHAR(255) NOT NULL,
                department VARCHAR(255),
                location VARCHAR(255),
                phone VARCHAR(50),
                status VARCHAR(50) DEFAULT 'active',
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
                status VARCHAR(50) DEFAULT 'active',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`,
            // Appointments table
            `CREATE TABLE appointments (
                id INT AUTO_INCREMENT PRIMARY KEY,
                patient_id INT NOT NULL,
                doctor_id INT NOT NULL,
                appointment_date DATE NOT NULL,
                appointment_time TIME NOT NULL,
                status VARCHAR(50) DEFAULT 'scheduled',
                reason TEXT,
                notes TEXT,
                created_by INT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
                FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
            )`,
            // Medical Records table
            `CREATE TABLE medical_records (
                id INT AUTO_INCREMENT PRIMARY KEY,
                patient_id INT NOT NULL,
                doctor_id INT NOT NULL,
                appointment_id INT,
                record_type VARCHAR(50) DEFAULT 'visit',
                diagnosis TEXT,
                treatment TEXT,
                notes TEXT,
                file_path VARCHAR(255),
                record_date DATE NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
                FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE,
                FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE SET NULL
            )`,
            // Prescriptions table
            `CREATE TABLE prescriptions (
                id INT AUTO_INCREMENT PRIMARY KEY,
                patient_id INT NOT NULL,
                doctor_id INT NOT NULL,
                appointment_id INT,
                medication_name VARCHAR(255) NOT NULL,
                dosage VARCHAR(100),
                frequency VARCHAR(100),
                duration VARCHAR(100),
                instructions TEXT,
                status VARCHAR(50) DEFAULT 'pending',
                prescribed_date DATE NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
                FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE,
                FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE SET NULL
            )`,
            // Inventory table
            `CREATE TABLE inventory (
                id INT AUTO_INCREMENT PRIMARY KEY,
                generic_name VARCHAR(255) NOT NULL,
                brand_name VARCHAR(255),
                strength VARCHAR(100),
                batch_number VARCHAR(100),
                manufacturer VARCHAR(255),
                expiry_date DATE,
                quantity INT DEFAULT 0,
                selling_price DECIMAL(10, 2),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )`,
            // Invoices table
            `CREATE TABLE invoices (
                id INT AUTO_INCREMENT PRIMARY KEY,
                patient_id INT NOT NULL,
                appointment_id INT,
                total_amount DECIMAL(10, 2) NOT NULL,
                paid_amount DECIMAL(10, 2) DEFAULT 0,
                payment_status VARCHAR(50) DEFAULT 'pending',
                payment_method VARCHAR(50),
                invoice_date DATE NOT NULL,
                due_date DATE,
                notes TEXT,
                created_by INT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
                FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE SET NULL
            )`,
            // Notifications table
            `CREATE TABLE notifications (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                user_type VARCHAR(50) NOT NULL,
                title VARCHAR(255) NOT NULL,
                message TEXT NOT NULL,
                type VARCHAR(50) DEFAULT 'info',
                is_read BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`,
            // Doctor Schedules table
            `CREATE TABLE doctor_schedules (
                id INT AUTO_INCREMENT PRIMARY KEY,
                doctor_id INT NOT NULL,
                day_of_week VARCHAR(20) NOT NULL,
                start_time TIME NOT NULL,
                end_time TIME NOT NULL,
                is_available BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
            )`
        ];

        for (const sql of tables) {
            await connection.query(sql);
        }
        await connection.query('SET FOREIGN_KEY_CHECKS = 1');
        console.log('All tables created successfully.');

        // 5. Seed Data
        const adminPass = await bcrypt.hash('admin123', 10);
        const pharmaPass = await bcrypt.hash('pharma123', 10);
        const doctorPass = await bcrypt.hash('doctor123', 10);
        const receptPass = await bcrypt.hash('reception123', 10);
        const patientPass = await bcrypt.hash('password123', 10);

        // Insert demo users
        await connection.query('INSERT INTO admins (email, password, name, department, status) VALUES (?, ?, ?, ?, ?)',
            ['admin@clinic.com', adminPass, 'Admin User', 'Administration', 'active']);

        await connection.query('INSERT INTO pharmacists (email, password, name, department, licenseNumber, status) VALUES (?, ?, ?, ?, ?, ?)',
            ['pharmacist@clinic.com', pharmaPass, 'John Pharmacist', 'Pharmacy', 'PHARM12345', 'active']);

        await connection.query('INSERT INTO doctors (email, password, name, department, specialization, phone, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
            ['doctor@clinic.com', doctorPass, 'Dr. Jane Smith', 'General Medicine', 'General Practitioner', '1234567890', 'active']);

        await connection.query('INSERT INTO receptionists (email, password, name, department, location, phone, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
            ['reception@clinic.com', receptPass, 'Jessica Reception', 'Front Desk', 'Main Reception', '0987654321', 'active']);

        await connection.query('INSERT INTO patients (email, password, firstName, lastName, phone, bloodGroup, dateOfBirth, gender, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            ['patient@clinic.com', patientPass, 'John', 'Doe', '1234567890', 'O+', '1990-01-01', 'Male', 'active']);

        console.log('Demo users created successfully.');

        // Insert sample inventory items
        await connection.query(`INSERT INTO inventory (generic_name, brand_name, strength, batch_number, manufacturer, expiry_date, quantity, selling_price) VALUES 
            ('Paracetamol', 'Panadol', '500mg', 'BATCH001', 'GSK', '2025-12-31', 100, 5.50),
            ('Amoxicillin', 'Amoxil', '250mg', 'BATCH002', 'Pfizer', '2025-06-30', 50, 15.00),
            ('Ibuprofen', 'Advil', '200mg', 'BATCH003', 'Bayer', '2025-09-30', 75, 8.00)`);

        console.log('Sample inventory created.');

        console.log('\n✅ Database initialized successfully!');
        console.log('\n📋 Demo Login Credentials:');
        console.log('Admin: admin@clinic.com / admin123');
        console.log('Doctor: doctor@clinic.com / doctor123');
        console.log('Patient: patient@clinic.com / password123');
        console.log('Receptionist: reception@clinic.com / reception123');
        console.log('Pharmacist: pharmacist@clinic.com / pharma123\n');

        await connection.end();
        process.exit(0);

    } catch (error) {
        console.error('❌ Initialization failed:', error);
        process.exit(1);
    }
};

init();
