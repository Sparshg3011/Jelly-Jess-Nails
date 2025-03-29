import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import pkg from 'pg';
const { Pool } = pkg;
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import * as fs from 'fs/promises';
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

// Initialize drizzle with the pool
const db = drizzle(pool);

// Drop all existing tables
async function dropAllTables() {
  try {
    console.log('Dropping existing tables...');
    const tablesToDrop = await pool.query(`
      SELECT tablename FROM pg_tables WHERE schemaname = 'public';
    `);
    
    console.log('Found tables:', tablesToDrop.rows.map(r => r.tablename).join(', '));
    
    const result = await pool.query(`
      DO $$ DECLARE
        r RECORD;
      BEGIN
        FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
          EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
          RAISE NOTICE 'Dropped table %', r.tablename;
        END LOOP;
      END $$;
    `);
    console.log('All tables dropped successfully');
  } catch (err) {
    console.error('Error dropping tables:', err);
    throw err;
  }
}

// Ensure migrations directory exists
async function ensureMigrationsDir() {
  const migrationsDir = path.join(__dirname, '..', 'migrations');
  const metaDir = path.join(migrationsDir, 'meta');
  
  try {
    await fs.mkdir(metaDir, { recursive: true });
    
    // Create _journal.json if it doesn't exist
    const journalPath = path.join(metaDir, '_journal.json');
    try {
      await fs.access(journalPath);
    } catch {
      await fs.writeFile(journalPath, JSON.stringify({ entries: [] }));
    }
  } catch (err) {
    console.error('Error creating migrations directory:', err);
    throw err;
  }
}

// Run migrations
async function main() {
  console.log('Ensuring migrations directory exists...');
  await ensureMigrationsDir();
  
  console.log('Checking for existing tables...');
  const tablesResult = await pool.query(`
    SELECT tablename FROM pg_tables WHERE schemaname = 'public';
  `);
  console.log('Existing tables:', tablesResult.rows.map(r => r.tablename).join(', '));
  
  if (tablesResult.rows.length > 0) {
    console.log('Tables already exist - migration may have been run previously');
    // We'll skip dropping tables to avoid migration issues
    // await dropAllTables();
  }
  
  console.log('Running migrations...');
  await migrate(db, {
    migrationsFolder: path.join(__dirname, '..', 'migrations'),
  });
  
  console.log('Migrations completed successfully');
  console.log('Checking tables after migration...');
  const afterTablesResult = await pool.query(`
    SELECT tablename FROM pg_tables WHERE schemaname = 'public';
  `);
  console.log('Tables after migration:', afterTablesResult.rows.map(r => r.tablename).join(', '));
  
  await pool.end();
  process.exit(0);
}

main().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
}); 