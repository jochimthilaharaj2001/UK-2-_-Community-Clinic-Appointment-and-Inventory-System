import db from './src/config/db.js';

async function fixDoctorsTable() {
    try {
        console.log('Fixing doctors table schema...');

        // Add missing columns if they don't exist
        const columnsToAdd = [
            { name: 'phone', type: 'VARCHAR(20)' },
            { name: 'department', type: 'VARCHAR(100)' },
            { name: 'experience', type: 'VARCHAR(50)' },
            { name: 'schedule', type: 'VARCHAR(100)' },
            { name: 'license', type: 'VARCHAR(50)' },
            { name: 'education', type: 'VARCHAR(200)' },
            { name: 'office', type: 'VARCHAR(100)' },
            { name: 'bio', type: 'TEXT' },
            { name: 'status', type: "ENUM('active', 'on-leave', 'inactive') DEFAULT 'active'" },
            { name: 'rating', type: 'DECIMAL(2,1) DEFAULT 0.0' },
            { name: 'appointments_count', type: 'INT DEFAULT 0' }
        ];

        const [existingColumns] = await db.query('SHOW COLUMNS FROM doctors');
        const columnNames = existingColumns.map(c => c.Field.toLowerCase());

        for (const col of columnsToAdd) {
            if (!columnNames.includes(col.name.toLowerCase())) {
                console.log(`Adding column: ${col.name}`);
                await db.query(`ALTER TABLE doctors ADD COLUMN ${col.name} ${col.type}`);
            } else {
                console.log(`Column ${col.name} already exists.`);
            }
        }

        // Also ensure password column exists (it should, but just in case)
        if (!columnNames.includes('password')) {
            console.log('Adding column: password');
            await db.query('ALTER TABLE doctors ADD COLUMN password VARCHAR(255) AFTER email');
        }

        console.log('Doctors table fixed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error fixing doctors table:', error.message);
        process.exit(1);
    }
}

fixDoctorsTable();
