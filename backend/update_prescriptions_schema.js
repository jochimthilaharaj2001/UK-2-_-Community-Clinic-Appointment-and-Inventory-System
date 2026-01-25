
import db from './src/config/db.js';

async function updatePrescriptionItems() {
    try {
        const columnsToAdd = [
            "frequency VARCHAR(50)",
            "duration VARCHAR(50)"
        ];

        for (const colDef of columnsToAdd) {
            const colName = colDef.split(' ')[0];
            const [exists] = await db.query(`SHOW COLUMNS FROM prescription_items LIKE '${colName}'`);
            if (exists.length === 0) {
                console.log(`Adding column ${colName} to prescription_items...`);
                await db.query(`ALTER TABLE prescription_items ADD COLUMN ${colDef}`);
            } else {
                console.log(`Column ${colName} already exists in prescription_items.`);
            }
        }

        console.log('Prescription items schema updated.');
        process.exit();
    } catch (error) {
        console.error('Error updating schema:', error);
        process.exit(1);
    }
}

updatePrescriptionItems();
