
import db from './src/config/db.js';
import bcrypt from 'bcryptjs';

const seed = async () => {
    try {
        console.log('Seeding database...');

        // Hash passwords
        const adminPass = await bcrypt.hash('admin123', 10);
        const pharmaPass = await bcrypt.hash('pharma123', 10);
        const doctorPass = await bcrypt.hash('doctor123', 10);
        const receptPass = await bcrypt.hash('reception123', 10);
        const patientPass = await bcrypt.hash('password123', 10);

        // Admins
        await db.query('DELETE FROM admins');
        await db.query(`INSERT INTO admins (email, password, name, department) VALUES 
            ('admin@clinic.com', ?, 'Admin User', 'Administration')`, [adminPass]);

        // Pharmacists
        await db.query('DELETE FROM pharmacists');
        await db.query(`INSERT INTO pharmacists (email, password, name, department, licenseNumber) VALUES 
            ('pharmacist@clinic.com', ?, 'John Pharmacist', 'Pharmacy', 'PHARM12345')`, [pharmaPass]);

        // Doctors
        await db.query('DELETE FROM doctors');
        await db.query(`INSERT INTO doctors (email, password, name, department, specialization) VALUES 
            ('doctor@clinic.com', ?, 'Dr. Jane Smith', 'General Medicine', 'General Practitioner')`, [doctorPass]);

        // Receptionists
        await db.query('DELETE FROM receptionists');
        await db.query(`INSERT INTO receptionists (email, password, name, department, location) VALUES 
            ('reception@clinic.com', ?, 'Jessica Reception', 'Front Desk', 'Main Reception')`, [receptPass]);

        // Patients (Demo)
        await db.query('DELETE FROM patients');
        await db.query(`INSERT INTO patients (email, password, firstName, lastName, phone, bloodGroup) VALUES 
            ('patient@clinic.com', ?, 'John', 'Doe', '1234567890', 'O+')`, [patientPass]);

        console.log('Database seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Seeding error:', error);
        process.exit(1);
    }
};

seed();
