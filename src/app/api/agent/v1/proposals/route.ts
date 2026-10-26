import { NextRequest, NextResponse } from 'next/server';
import { authenticateHermesRequest } from '@/lib/hermes-auth';
import { getStoredProposals } from '@/lib/data-store';
import { getDb } from '@/lib/db';
import { ProposalStatus } from '@/types';

export async function GET(req: NextRequest) {
  const auth = authenticateHermesRequest(req);
  if (!auth.authorized) {
    return auth.errorResponse!;
  }

  const { searchParams } = new URL(req.url);
  const problemId = searchParams.get('problemId');
  const status = searchParams.get('status') as ProposalStatus | null;

  const sql = getDb();
  if (sql) {
    try {
      let rows: Record<string, unknown>[] | null = null;
      if (problemId && status) {
        rows = (await sql`SELECT * FROM solution_proposals WHERE problem_id = ${problemId} AND status = ${status} ORDER BY submitted_at DESC`) as unknown as Record<string, unknown>[];
      } else if (problemId) {
        rows = (await sql`SELECT * FROM solution_proposals WHERE problem_id = ${problemId} ORDER BY submitted_at DESC`) as unknown as Record<string, unknown>[];
      } else if (status) {
        rows = (await sql`SELECT * FROM solution_proposals WHERE status = ${status} ORDER BY submitted_at DESC`) as unknown as Record<string, unknown>[];
      } else {
        rows = (await sql`SELECT * FROM solution_proposals ORDER BY submitted_at DESC`) as unknown as Record<string, unknown>[];
      }

      if (rows) {
        return NextResponse.json({
          source: 'neon_postgresql',
          total: rows.length,
          proposals: rows,
        });
      }
    } catch {
      // Fallback
    }
  }

  let proposals = getStoredProposals();
  if (problemId) {
    proposals = proposals.filter((p) => p.problemId === problemId);
  }
  if (status) {
    proposals = proposals.filter((p) => p.status.toLowerCase() === status.toLowerCase());
  }

  return NextResponse.json({
    source: 'data_store',
    total: proposals.length,
    proposals,
  });
}
