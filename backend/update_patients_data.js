
import db from './src/config/db.js';

async function updatePatientsData() {
    try {
        await db.query("UPDATE patients SET email='john@example.com', phone='123-456-7890' WHERE name='John Doe' AND (email IS NULL OR email='')");
        console.log('Patient data updated.');
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

updatePatientsData();
