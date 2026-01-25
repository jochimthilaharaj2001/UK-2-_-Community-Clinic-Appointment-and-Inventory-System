
import db from './src/config/db.js';

async function updatePatientsSchema() {
    try {
        const columnsToAdd = [
            "email VARCHAR(100)",
            "phone VARCHAR(20)",
            "address TEXT"
        ];

        for (const colDef of columnsToAdd) {
            const colName = colDef.split(' ')[0];
            const [exists] = await db.query(`SHOW COLUMNS FROM patients LIKE '${colName}'`);
            if (exists.length === 0) {
                console.log(`Adding column ${colName} to patients...`);
                await db.query(`ALTER TABLE patients ADD COLUMN ${colDef}`);
            } else {
                console.log(`Column ${colName} already exists in patients.`);
            }
        }

        console.log('Patients schema updated.');
        process.exit();
    } catch (error) {
        console.error('Error updating schema:', error);
        process.exit(1);
    }
}

updatePatientsSchema();
