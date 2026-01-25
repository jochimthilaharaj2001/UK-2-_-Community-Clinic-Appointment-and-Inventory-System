import db from './src/config/db.js';

async function checkSchema() {
    try {
        const [columns] = await db.query('SHOW COLUMNS FROM doctors');
        console.log('Doctors table columns (Full):');
        columns.forEach(col => {
            console.log(`- ${col.Field}: ${col.Type} | Null: ${col.Null} | Key: ${col.Key} | Default: ${col.Default}`);
        });
        process.exit(0);
    } catch (error) {
        console.error('Error checking schema:', error.message);
        process.exit(1);
    }
}

checkSchema();
