
import db from './src/config/db.js';
import bcrypt from 'bcryptjs';

async function updateDoctorsSchema() {
    try {
        console.log('Checking if email column exists in doctors table...');

        // Check columns
        const [columns] = await db.query("SHOW COLUMNS FROM doctors LIKE 'email'");

        if (columns.length === 0) {
            console.log('Adding email and password columns...');
            await db.query("ALTER TABLE doctors ADD COLUMN email VARCHAR(100) UNIQUE AFTER name");
            await db.query("ALTER TABLE doctors ADD COLUMN password VARCHAR(255) AFTER email");

            // Add consultation_fee if missing (frontend dashboard expects it)
            const [feeCol] = await db.query("SHOW COLUMNS FROM doctors LIKE 'consultation_fee'");
            if (feeCol.length === 0) {
                await db.query("ALTER TABLE doctors ADD COLUMN consultation_fee DECIMAL(10,2) DEFAULT 1500.00 AFTER specialization");
            }

            console.log('Columns added.');
        } else {
            console.log('Columns already exist.');
        }

        // Update existing doctors with default credentials
        const passwordHash = '$2a$10$Hj2tTKwmC2xTOHBPod.aBupZ19GVvjunCJmWI8F/qZc7Zr6FmR12C'; // 123456

        const doctors = [
            { id: 1, email: 'sarah@example.com' },
            { id: 2, email: 'amal@example.com' },
            { id: 3, email: 'kamal@example.com' },
            { id: 4, email: 'nimali@example.com' }
        ];

        for (const doc of doctors) {
            await db.query(
                "UPDATE doctors SET email = ?, password = ? WHERE id = ?",
                [doc.email, passwordHash, doc.id]
            );
            console.log(`Updated doctor ${doc.id} with email ${doc.email}`);
        }

        console.log('Doctors updated successfully.');
        process.exit();

    } catch (error) {
        console.error('Error updating doctors schema:', error);
        process.exit(1);
    }
}

updateDoctorsSchema();
