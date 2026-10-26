import { neon } from '@neondatabase/serverless';

// Safe Neon SQL client types
type NeonClient = ReturnType<typeof neon>;

/**
 * Returns the primary database client.
 * Prefers DATABASE_URL (pooled serverless endpoint),
 * falling back to DATABASE_URL_UNPOOLED or POSTGRES_URL if needed.
 */
export function getDb(): NeonClient | null {
  const url = process.env.DATABASE_URL || process.env.DATABASE_URL_UNPOOLED || process.env.POSTGRES_URL;
  if (!url) {
    return null;
  }
  try {
    return neon(url);
  } catch {
    console.error('Failed to initialize Neon database client');
    return null;
  }
}

/**
 * Returns an unpooled database client for direct connection or migrations.
 * Prefers DATABASE_URL_UNPOOLED, falling back to DATABASE_URL.
 */
export function getUnpooledDb(): NeonClient | null {
  const url = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!url) {
    return null;
  }
  try {
    return neon(url);
  } catch {
    console.error('Failed to initialize unpooled Neon client');
    return null;
  }
}

/**
 * Checks if database credentials are configured in the environment.
 */
export function isDatabaseConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL || process.env.DATABASE_URL_UNPOOLED || process.env.POSTGRES_URL);
}

/**
 * Safely verifies database connectivity without printing any connection secrets.
 */
export async function testDatabaseConnection(): Promise<{
  connected: boolean;
  latencyMs?: number;
  error?: string;
}> {
  const sql = getDb();
  if (!sql) {
    return {
      connected: false,
      error: 'DATABASE_URL is not set in environment variables',
    };
  }

  const start = Date.now();
  try {
    const result = await sql`SELECT 1 AS connected`;
    const latency = Date.now() - start;
    if (result && (Array.isArray(result) ? result.length > 0 : Boolean(result))) {
      return { connected: true, latencyMs: latency };
    }
    return { connected: false, error: 'Empty response from database' };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Database query execution failed';
    return { connected: false, error: errorMsg };
  }
}

/**
 * Creates database tables if they do not exist.
 * Uses CREATE TABLE IF NOT EXISTS to guarantee no data loss in production.
 */
export async function ensureDatabaseTables(): Promise<{ success: boolean; message: string }> {
  const sql = getUnpooledDb() || getDb();
  if (!sql) {
    return { success: false, message: 'Database client unavailable: DATABASE_URL not configured' };
  }

  try {
    // 1. Platform Problems table
    await sql`
      CREATE TABLE IF NOT EXISTS platform_problems (
        id TEXT PRIMARY KEY,
        slug TEXT UNIQUE NOT NULL,
        title TEXT NOT NULL,
        summary TEXT NOT NULL,
        full_description TEXT,
        sector TEXT NOT NULL,
        location TEXT NOT NULL,
        division TEXT DEFAULT 'National',
        affected_customer_type TEXT,
        validation_status TEXT DEFAULT 'Unverified',
        confidence_score_percent INTEGER DEFAULT 50,
        opportunity_type TEXT DEFAULT 'Open Problem',
        difficulty TEXT DEFAULT 'Moderate',
        estimated_startup_cost_min INTEGER DEFAULT 0,
        estimated_startup_cost_max INTEGER DEFAULT 0,
        time_to_first_test TEXT,
        featured BOOLEAN DEFAULT FALSE,
        reported_by_name TEXT,
        reported_by_role TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // 2. Solution Proposals table
    await sql`
      CREATE TABLE IF NOT EXISTS solution_proposals (
        id TEXT PRIMARY KEY,
        problem_id TEXT NOT NULL,
        problem_title TEXT NOT NULL,
        solver_id TEXT NOT NULL,
        solver_name TEXT NOT NULL,
        solver_email TEXT NOT NULL,
        title TEXT NOT NULL,
        approach TEXT NOT NULL,
        tech_stack TEXT,
        estimated_days INTEGER DEFAULT 14,
        requested_budget_bdt INTEGER,
        status TEXT DEFAULT 'Submitted',
        reviewer_notes TEXT,
        submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // 3. Problem Reports (Abuse & Flags)
    await sql`
      CREATE TABLE IF NOT EXISTS problem_reports (
        id TEXT PRIMARY KEY,
        problem_id TEXT NOT NULL,
        problem_title TEXT NOT NULL,
        reporter_email TEXT NOT NULL,
        reason TEXT NOT NULL,
        details TEXT,
        status TEXT DEFAULT 'Open',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // 4. Audit Log
    await sql`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id TEXT PRIMARY KEY,
        actor_email TEXT NOT NULL,
        actor_role TEXT NOT NULL,
        action TEXT NOT NULL,
        target_type TEXT NOT NULL,
        target_id TEXT NOT NULL,
        details TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // 5. Discussion comments
    await sql`
      CREATE TABLE IF NOT EXISTS discussion_comments (
        id TEXT PRIMARY KEY,
        problem_id TEXT NOT NULL,
        author_name TEXT NOT NULL,
        author_email TEXT NOT NULL,
        author_role TEXT DEFAULT 'visitor',
        comment TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

    return { success: true, message: 'All database tables verified and ensured successfully.' };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Database schema verification failed';
    return { success: false, message: errorMsg };
  }
}

// Backward-compatible default export
const defaultClient = getDb();
export default defaultClient;
