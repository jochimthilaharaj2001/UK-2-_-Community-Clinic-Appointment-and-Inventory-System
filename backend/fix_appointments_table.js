import db from './src/config/db.js';

const addColumns = async () => {
    const columns = [
        { name: 'doctor_name', type: 'VARCHAR(100)' },
        { name: 'reason', type: 'TEXT' },
        { name: 'type', type: 'VARCHAR(50)' },
        { name: 'notes', type: 'TEXT' },
        { name: 'patient_name', type: 'VARCHAR(100)' },
        { name: 'duration', type: 'INT DEFAULT 30' },
        { name: 'contact', type: 'VARCHAR(20)' },
        { name: 'email', type: 'VARCHAR(100)' },
        { name: 'room', type: 'VARCHAR(20)' },
        { name: 'appointment_date', type: 'DATE' }, // already exists but for safety
        { name: 'appointment_time', type: 'TIME' }  // already exists but for safety
    ];

    const [existingColumns] = await db.query("SHOW COLUMNS FROM appointments");
    const existingNames = existingColumns.map(c => c.Field);

    for (const col of columns) {
        if (!existingNames.includes(col.name)) {
            console.log(`Adding column ${col.name}...`);
            try {
                await db.query(`ALTER TABLE appointments ADD COLUMN ${col.name} ${col.type}`);
            } catch (err) {
                console.error(`Error adding ${col.name}:`, err.message);
            }
        }
    }

    // Also fix any controllers using 'date' or 'time' instead of 'appointment_date' / 'appointment_time'
    // but first let's add legacy columns to avoid breaks if they are already being used.
    if (!existingNames.includes('date')) {
        await db.query(`ALTER TABLE appointments ADD COLUMN date DATE`);
    }
    if (!existingNames.includes('time')) {
        await db.query(`ALTER TABLE appointments ADD COLUMN time TIME`);
    }

    console.log('Done.');
    process.exit(0);
};

addColumns();
