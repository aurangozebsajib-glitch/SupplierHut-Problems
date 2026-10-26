import { NextRequest, NextResponse } from 'next/server';
import { authenticateHermesRequest } from '@/lib/hermes-auth';
import { getStoredAuditLogs } from '@/lib/data-store';
import { getDb } from '@/lib/db';

export async function GET(req: NextRequest) {
  const auth = authenticateHermesRequest(req);
  if (!auth.authorized) {
    return auth.errorResponse!;
  }

  const { searchParams } = new URL(req.url);
  const limit = Math.min(parseInt(searchParams.get('limit') || '50', 10), 100);

  const sql = getDb();
  if (sql) {
    try {
      const dbLogs = (await sql`
        SELECT * FROM audit_logs 
        ORDER BY created_at DESC 
        LIMIT ${limit}
      `) as unknown as Record<string, unknown>[];
      return NextResponse.json({
        total: dbLogs.length,
        logs: dbLogs,
      });
    } catch {
      // Fallback
    }
  }

  const logs = getStoredAuditLogs();
  return NextResponse.json({
    total: logs.length,
    logs: logs.slice(0, limit),
  });
}
