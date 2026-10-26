import { NextRequest, NextResponse } from 'next/server';
import { authenticateHermesRequest } from '@/lib/hermes-auth';
import { getStoredProblems, getStoredProposals, getStoredReports, getStoredAuditLogs } from '@/lib/data-store';
import { getDb } from '@/lib/db';

export async function GET(req: NextRequest) {
  const auth = authenticateHermesRequest(req);
  if (!auth.authorized) {
    return auth.errorResponse!;
  }

  const sql = getDb();

  // If live Neon SQL is connected, query aggregates directly
  if (sql) {
    try {
      const problemStats = (await sql`
        SELECT 
          count(*)::int as total,
          count(*) FILTER (WHERE validation_status = 'Validated')::int as validated,
          count(*) FILTER (WHERE validation_status = 'Evidence Supported')::int as evidence_supported,
          count(*) FILTER (WHERE validation_status = 'Researching')::int as researching,
          count(*) FILTER (WHERE validation_status = 'Unverified')::int as unverified,
          count(*) FILTER (WHERE validation_status = 'Archived')::int as archived,
          count(*) FILTER (WHERE opportunity_type = 'Paid Challenge')::int as paid_challenges
        FROM platform_problems
      `) as unknown as Record<string, unknown>[];

      const proposalStats = (await sql`
        SELECT
          count(*)::int as total,
          count(*) FILTER (WHERE status = 'Submitted')::int as pending_review,
          count(*) FILTER (WHERE status = 'Accepted')::int as accepted,
          count(*) FILTER (WHERE status = 'Rejected')::int as rejected
        FROM solution_proposals
      `) as unknown as Record<string, unknown>[];

      const reportStats = (await sql`
        SELECT
          count(*)::int as total,
          count(*) FILTER (WHERE status = 'Open')::int as open_tickets
        FROM problem_reports
      `) as unknown as Record<string, unknown>[];

      return NextResponse.json({
        source: 'neon_postgresql',
        problems: problemStats[0] || {},
        proposals: proposalStats[0] || {},
        reports: reportStats[0] || {},
        timestamp: new Date().toISOString(),
      });
    } catch {
      // Fallback to data-store
    }
  }

  // Fallback to in-memory / data-store records
  const problems = getStoredProblems();
  const proposals = getStoredProposals();
  const reports = getStoredReports();
  const auditLogs = getStoredAuditLogs();

  const sectorCounts: Record<string, number> = {};
  const statusCounts: Record<string, number> = {};

  problems.forEach((p) => {
    sectorCounts[p.sector] = (sectorCounts[p.sector] || 0) + 1;
    statusCounts[p.validationStatus] = (statusCounts[p.validationStatus] || 0) + 1;
  });

  return NextResponse.json({
    source: 'data_store',
    problems: {
      total: problems.length,
      by_status: statusCounts,
      by_sector: sectorCounts,
      paid_challenges: problems.filter((p) => p.opportunityType === 'Paid Challenge').length,
    },
    proposals: {
      total: proposals.length,
      pending_review: proposals.filter((pr) => pr.status === 'Submitted').length,
      accepted: proposals.filter((pr) => pr.status === 'Accepted').length,
      shortlisted: proposals.filter((pr) => pr.status === 'Shortlisted').length,
    },
    moderation: {
      total_reports: reports.length,
      open_reports: reports.filter((r) => r.status === 'Open').length,
      resolved_reports: reports.filter((r) => r.status === 'Resolved').length,
    },
    audit: {
      total_logged_events: auditLogs.length,
      latest_event_at: auditLogs[0]?.timestamp || null,
    },
    timestamp: new Date().toISOString(),
  });
}
