import { neon } from '@neondatabase/serverless';

// Safe Neon SQL client with fallback for demo environments without DATABASE_URL
type NeonClient = ReturnType<typeof neon> | null;

let sql: NeonClient = null;

try {
  if (process.env.DATABASE_URL) {
    sql = neon(process.env.DATABASE_URL);
  }
} catch (e) {
  console.warn('Neon database connection not initialized - running in demo memory mode', e);
}

export async function ensureTables(): Promise<void> {
  if (!sql) return;
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS platform_problems (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        summary TEXT NOT NULL,
        sector TEXT NOT NULL,
        location TEXT NOT NULL,
        status TEXT DEFAULT 'Unverified',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
  } catch (err) {
    console.warn('Database table check skipped', err);
  }
}

export default sql;
