
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'clinic_system',
    multipleStatements: true
};

async function restoreDatabase() {
    let connection;
    try {
        console.log('Connecting to database...');
        connection = await mysql.createConnection(dbConfig);
        console.log('Connected.');

        const schema = `
            SET FOREIGN_KEY_CHECKS = 0;
            
            DROP TABLE IF EXISTS notifications;
            DROP TABLE IF EXISTS medical_reports;
            DROP TABLE IF EXISTS prescription_items;
            DROP TABLE IF EXISTS prescriptions;
            DROP TABLE IF EXISTS appointments;
            DROP TABLE IF EXISTS doctors;
            DROP TABLE IF EXISTS patients;

            CREATE TABLE patients (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                phone VARCHAR(20),
                address TEXT,
                dob DATE,
                gender VARCHAR(20),
                blood_type VARCHAR(10),
                profile_image LONGTEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE doctors (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                specialization VARCHAR(100),
                availability VARCHAR(100),
                rating DECIMAL(3,1) DEFAULT 4.5
            );

            CREATE TABLE appointments (
                id INT AUTO_INCREMENT PRIMARY KEY,
                patient_id INT,
                doctor_id INT,
                appointment_date DATE,
                appointment_time TIME,
                status VARCHAR(20) DEFAULT 'Pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
                FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE SET NULL
            );

            CREATE TABLE prescriptions (
                id INT AUTO_INCREMENT PRIMARY KEY,
                patient_id INT,
                doctor_id INT,
                diagnostic VARCHAR(255),
                status VARCHAR(50) DEFAULT 'Active',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
                FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE SET NULL
            );

            CREATE TABLE prescription_items (
                id INT AUTO_INCREMENT PRIMARY KEY,
                prescription_id INT,
                medicine_name VARCHAR(255),
                strength VARCHAR(50),
                quantity VARCHAR(50),
                FOREIGN KEY (prescription_id) REFERENCES prescriptions(id) ON DELETE CASCADE
            );

            CREATE TABLE medical_reports (
                id INT AUTO_INCREMENT PRIMARY KEY,
                patient_id INT,
                title VARCHAR(255),
                clinic VARCHAR(255),
                type VARCHAR(50),
                report_date DATE,
                file_url VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
            );

            CREATE TABLE notifications (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT,
                user_type VARCHAR(20),
                title VARCHAR(255),
                message TEXT,
                is_read BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
            
            SET FOREIGN_KEY_CHECKS = 1;
        `;

        console.log('Recreating tables...');
        await connection.query(schema);
        console.log('Tables recreated.');

        // SEED DATA
        console.log('Seeding data...');

        // 1. Patient
        const hashedPassword = await bcrypt.hash('123456', 10);
        const [patientResult] = await connection.execute(
            `INSERT INTO patients (name, email, password, phone, address, dob, gender, blood_type) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            ['John Doe', 'patient@example.com', hashedPassword, '0771234567', '123 Main St, Colombo', '1990-01-01', 'Male', 'O+']
        );
        const patientId = patientResult.insertId;
        console.log(`Patient created with ID: ${patientId}`);

        // 2. Doctors
        const doctorsData = [
            ['Dr. Sarah Silva', 'Cardiology', 'Mon-Fri 9am-5pm', 4.8],
            ['Dr. Amal Perera', 'Dermatology', 'Tue-Thu 10am-4pm', 4.5],
            ['Dr. Kamal Gunaratne', 'General Medicine', 'Mon-Sat 8am-8pm', 4.9],
            ['Dr. Nimali Fernando', 'Pediatrics', 'Mon-Wed 9am-1pm', 4.7]
        ];

        for (const doc of doctorsData) {
            await connection.execute('INSERT INTO doctors (name, specialization, availability, rating) VALUES (?, ?, ?, ?)', doc);
        }
        console.log('Doctors seeded.');

        // 3. Appointments
        // Fetch doctor IDs
        const [doctors] = await connection.query('SELECT id FROM doctors');

        await connection.execute(
            'INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, status) VALUES (?, ?, CURDATE() + INTERVAL 2 DAY, "10:00:00", "Confirmed")',
            [patientId, doctors[0].id]
        );

        await connection.execute(
            'INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, status) VALUES (?, ?, CURDATE() - INTERVAL 5 DAY, "14:30:00", "Completed")',
            [patientId, doctors[1].id]
        );

        await connection.execute(
            'INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, status) VALUES (?, ?, CURDATE() + INTERVAL 1 DAY, "09:00:00", "Pending")',
            [patientId, doctors[2].id]
        );
        console.log('Appointments seeded.');

        // 4. Prescriptions
        const [rxResult] = await connection.execute(
            'INSERT INTO prescriptions (patient_id, doctor_id, diagnostic, status, created_at) VALUES (?, ?, ?, "Active", NOW())',
            [patientId, doctors[1].id, 'Mild Eczema']
        );
        const rxId = rxResult.insertId;

        await connection.execute(
            'INSERT INTO prescription_items (prescription_id, medicine_name, strength, quantity) VALUES (?, ?, ?, ?)',
            [rxId, 'Hydrocortisone Cream', '1%', '1 Tube']
        );
        console.log('Prescriptions seeded.');

        // 5. Notifications
        await connection.execute(
            'INSERT INTO notifications (user_id, user_type, title, message) VALUES (?, ?, ?, ?)',
            [patientId, 'PATIENT', 'Welcome', 'Welcome to the Community Clinic Portal! update your profile to get started.']
        );

        await connection.execute(
            'INSERT INTO notifications (user_id, user_type, title, message) VALUES (?, ?, ?, ?)',
            [patientId, 'PATIENT', 'Appointment Confirmed', 'Your appointment with Dr. Sarah Silva has been confirmed.']
        );
        console.log('Notifications seeded.');

    } catch (error) {
        console.error('Error restoring database:', error);
    } finally {
        if (connection) await connection.end();
    }
}

restoreDatabase();
