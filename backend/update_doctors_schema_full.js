
import db from './src/config/db.js';

async function addMissingColumns() {
    try {
        const columnsToAdd = [
            "phone VARCHAR(20)",
            "department VARCHAR(100)",
            "experience VARCHAR(50)",
            "license VARCHAR(100)",
            "hospital VARCHAR(100)",
            "address TEXT",
            "bio TEXT",
            "qualifications JSON",
            "certifications JSON",
            "languages JSON",
            "education JSON"
        ];

        for (const colDef of columnsToAdd) {
            const colName = colDef.split(' ')[0];
            const [exists] = await db.query(`SHOW COLUMNS FROM doctors LIKE '${colName}'`);
            if (exists.length === 0) {
                console.log(`Adding column ${colName}...`);
                await db.query(`ALTER TABLE doctors ADD COLUMN ${colDef}`);
            } else {
                console.log(`Column ${colName} already exists.`);
            }
        }

        console.log('All columns checked/added.');
        process.exit();
    } catch (error) {
        console.error('Error adding columns:', error);
        process.exit(1);
    }
}

addMissingColumns();
