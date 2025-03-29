import pkg from 'pg';
const { Pool } = pkg;
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function runMigrationDirectly() {
  try {
    console.log('Checking existing tables...');
    const tablesResult = await pool.query(`
      SELECT tablename FROM pg_tables WHERE schemaname = 'public';
    `);
    console.log('Existing tables:', tablesResult.rows.map(r => r.tablename).join(', '));

    console.log('Reading migration SQL file...');
    const sqlFilePath = path.join(__dirname, '..', 'migrations', '0000_careless_frank_castle.sql');
    const sqlContent = await fs.readFile(sqlFilePath, 'utf8');
    
    console.log('Executing SQL directly...');
    // Remove "statement-breakpoint" lines and split into separate statements
    const statements = sqlContent
      .split('--> statement-breakpoint')
      .filter(stmt => stmt.trim() !== '')
      .map(stmt => stmt.trim());
    
    console.log(`Found ${statements.length} SQL statements to execute`);
    
    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i];
      console.log(`Executing statement ${i + 1}/${statements.length}`);
      try {
        await pool.query(stmt);
        console.log(`Statement ${i + 1} executed successfully`);
      } catch (err) {
        console.error(`Error executing statement ${i + 1}:`, err.message);
        // Continue with next statement instead of aborting
      }
    }
    
    console.log('Checking tables after execution...');
    const afterTablesResult = await pool.query(`
      SELECT tablename FROM pg_tables WHERE schemaname = 'public';
    `);
    console.log('Tables after execution:', afterTablesResult.rows.map(r => r.tablename).join(', '));
    
  } catch (err) {
    console.error('Error running migration directly:', err);
  } finally {
    await pool.end();
  }
}

runMigrationDirectly().catch(console.error); 