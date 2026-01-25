
import db from './src/config/db.js';

async function checkColumns() {
    try {
        const [columns] = await db.query("SHOW COLUMNS FROM doctors");
        console.log(columns.map(c => c.Field));
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

checkColumns();
