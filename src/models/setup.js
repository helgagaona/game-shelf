// Creates database tables and populates them with initial course, faculty, and catalog data.

import db from './db.js';
import fs from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Sets up the database and safely reapplies seed data.
 * Seed statements use conflict handling, so startup remains safe to rerun.
 */
const setupDatabase = async () => {
    console.log('Seeding database...');
    const seedPath = join(__dirname, 'sql', 'seed.sql');
    const seedSQL = fs.readFileSync(seedPath, 'utf8');
    await db.query(seedSQL);
    console.log('Database seeded successfully');
    
    return true;
};

/**
 * Tests the database connection by executing a simple query.
 */
const testConnection = async () => {
    const result = await db.query('SELECT NOW() as current_time');
    console.log('Database connection successful:', result.rows[0].current_time);
    return true;
};

export { setupDatabase, testConnection };