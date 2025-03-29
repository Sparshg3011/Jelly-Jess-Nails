import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '@shared/schema';

// Database connection URL
const DATABASE_URL = "postgresql://neondb_owner:npg_agf8xD2voZHw@ep-square-credit-a5zfpd08-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require";

console.log("Connecting to PostgreSQL database...");

// Create the postgres client
const queryClient = postgres(DATABASE_URL);

// Create the drizzle client using postgres-js
export const db = drizzle(queryClient, { schema }); 