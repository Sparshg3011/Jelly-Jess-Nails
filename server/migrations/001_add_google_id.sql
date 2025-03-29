-- Add googleId column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS google_id TEXT UNIQUE; 