import { NextRequest, NextResponse } from 'next/server';
import { authenticateHermesRequest } from '@/lib/hermes-auth';
import { getStoredReports } from '@/lib/data-store';
import { getDb } from '@/lib/db';
import { ProblemReport } from '@/types';

export async function GET(req: NextRequest) {
  const auth = authenticateHermesRequest(req);
  if (!auth.authorized) {
    return auth.errorResponse!;
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status') as ProblemReport['status'] | null;

  const sql = getDb();
  if (sql) {
    try {
      const rows = (status
        ? await sql`SELECT * FROM problem_reports WHERE status = ${status} ORDER BY created_at DESC`
        : await sql`SELECT * FROM problem_reports ORDER BY created_at DESC`) as unknown as Record<string, unknown>[];
      if (rows) {
        return NextResponse.json({
          source: 'neon_postgresql',
          total: rows.length,
          reports: rows,
        });
      }
    } catch {
      // Fallback
    }
  }

  let reports = getStoredReports();
  if (status) {
    reports = reports.filter((r) => r.status.toLowerCase() === status.toLowerCase());
  }

  return NextResponse.json({
    source: 'data_store',
    total: reports.length,
    reports,
  });
}
