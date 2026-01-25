
import db from './src/config/db.js';

async function checkPrescriptionColumns() {
    try {
        const [columns] = await db.query("SHOW COLUMNS FROM prescriptions");
        console.log(columns.map(c => c.Field));
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

checkPrescriptionColumns();
