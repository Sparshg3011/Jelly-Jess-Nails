import { sql } from "drizzle-orm";
import { pgTable, serial, text, integer, boolean, timestamp } from "drizzle-orm/pg-core";

export async function up(db: any): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "products" (
      "id" SERIAL PRIMARY KEY,
      "title" TEXT NOT NULL,
      "description" TEXT NOT NULL,
      "price" INTEGER NOT NULL,
      "image_url" TEXT NOT NULL,
      "category" TEXT NOT NULL,
      "in_stock" BOOLEAN DEFAULT TRUE,
      "featured" BOOLEAN DEFAULT FALSE,
      "created_at" TIMESTAMP DEFAULT NOW()
    );
  `);
  
  // Add emailSent column to bookings table
  await db.execute(sql`
    ALTER TABLE "bookings"
    ADD COLUMN IF NOT EXISTS "email_sent" BOOLEAN DEFAULT FALSE;
  `);
}

export async function down(db: any): Promise<void> {
  await db.execute(sql`DROP TABLE IF EXISTS "products";`);
  
  await db.execute(sql`
    ALTER TABLE "bookings"
    DROP COLUMN IF EXISTS "email_sent";
  `);
} 