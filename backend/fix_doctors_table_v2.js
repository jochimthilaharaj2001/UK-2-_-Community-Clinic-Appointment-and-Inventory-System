import db from './src/config/db.js';

async function fixDoctorsTable() {
    try {
        console.log('Fixing doctors table schema (Phase 2)...');

        const [existingColumns] = await db.query('SHOW COLUMNS FROM doctors');
        const columnNames = existingColumns.map(c => c.Field.toLowerCase());

        const missing = [
            { name: 'schedule', type: 'VARCHAR(100)' },
            { name: 'office', type: 'VARCHAR(100)' },
            { name: 'appointments_count', type: 'INT DEFAULT 0' }
        ];

        for (const col of missing) {
            if (!columnNames.includes(col.name.toLowerCase())) {
                console.log(`Adding column: ${col.name}`);
                await db.query(`ALTER TABLE doctors ADD COLUMN ${col.name} ${col.type}`);
            }
        }

        console.log('Doctors table fixed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error fixing doctors table:', error.message);
        process.exit(1);
    }
}

fixDoctorsTable();
