
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'clinic_system'
};

async function seedPatientData() {
    let connection;
    try {
        console.log('Connecting to database...');
        connection = await mysql.createConnection(dbConfig);
        console.log('Connected.');

        const email = 'patient@example.com';

        // 1. Get Patient ID
        const [patients] = await connection.execute('SELECT id FROM patients WHERE email = ?', [email]);

        if (patients.length === 0) {
            console.log('Patient not found! Creating one...');
            const hashedPassword = await bcrypt.hash('123456', 10);
            const [res] = await connection.execute(
                `INSERT INTO patients (name, email, password, phone, gender) 
                 VALUES ('John Doe', ?, ?, '0771234567', 'Male')`,
                [email, hashedPassword]
            );
            var patientId = res.insertId;
        } else {
            var patientId = patients[0].id;
            console.log(`Found Patient ID: ${patientId}`);
        }

        // 2. Get Doctor IDs
        const [doctors] = await connection.execute('SELECT id FROM doctors LIMIT 3');
        if (doctors.length === 0) {
            console.log('No doctors found. Seeding doctors...');
            await connection.execute("INSERT INTO doctors (name, specialization) VALUES ('Dr. Test', 'General')");
            // fetch again
            const [newDocs] = await connection.execute('SELECT id FROM doctors LIMIT 1');
            var doctorId = newDocs[0].id;
        } else {
            var doctorId = doctors[0].id;
        }

        console.log('Inserting Appointments...');
        // 3. Insert Appointments
        await connection.execute(`
            INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, status)
            VALUES 
            (?, ?, CURDATE() + INTERVAL 1 DAY, '10:00:00', 'Confirmed'),
            (?, ?, CURDATE() + INTERVAL 3 DAY, '14:00:00', 'Pending')
        `, [patientId, doctorId, patientId, doctorId]);

        console.log('Inserting Prescriptions...');
        // 4. Insert Prescriptions
        const [rxRes] = await connection.execute(`
            INSERT INTO prescriptions (patient_id, doctor_id, diagnostic, status, created_at)
            VALUES (?, ?, 'Seasonal Flu', 'Active', NOW())
        `, [patientId, doctorId]);

        const rxId = rxRes.insertId;

        await connection.execute(`
            INSERT INTO prescription_items (prescription_id, medicine_name, strength, quantity)
            VALUES (?, 'Paracetamol', '500mg', '20 Tablets')
        `, [rxId]);

        console.log('Inserting Notifications...');
        // 5. Insert Notifications
        await connection.execute(`
            INSERT INTO notifications (user_id, user_type, title, message)
            VALUES (?, 'PATIENT', 'Welcome Back', 'This is a test notification injected directly.')
        `, [patientId]);

        console.log('✅ Data seeding complete!');

    } catch (error) {
        console.error('Error seeding data:', error);
    } finally {
        if (connection) await connection.end();
    }
}

seedPatientData();
