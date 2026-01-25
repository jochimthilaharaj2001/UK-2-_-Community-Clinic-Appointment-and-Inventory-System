import db from './src/config/db.js';
import fs from 'fs';

async function checkSchema() {
    try {
        const [columns] = await db.query('SHOW COLUMNS FROM doctors');
        let output = 'Doctors table columns (Full):\n';
        columns.forEach(col => {
            output += `- ${col.Field}: ${col.Type} | Null: ${col.Null} | Key: ${col.Key} | Default: ${col.Default}\n`;
        });
        fs.writeFileSync('schema_output.txt', output);
        process.exit(0);
    } catch (error) {
        fs.writeFileSync('schema_output.txt', 'Error: ' + error.message);
        process.exit(1);
    }
}

checkSchema();
