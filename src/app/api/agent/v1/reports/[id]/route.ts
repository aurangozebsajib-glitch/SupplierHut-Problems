import { NextRequest, NextResponse } from 'next/server';
import { authenticateHermesRequest, logHermesAction } from '@/lib/hermes-auth';
import { getStoredReports, updateReportStatusRecord } from '@/lib/data-store';
import { getDb } from '@/lib/db';
import { ProblemReport } from '@/types';

const VALID_STATUSES: ProblemReport['status'][] = ['Open', 'Reviewed', 'Resolved', 'Dismissed'];

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = authenticateHermesRequest(req);
  if (!auth.authorized) {
    return auth.errorResponse!;
  }

  const { id } = await params;
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Malformed JSON payload' }, { status: 400 });
  }

  const { status, notes } = body;
  if (!status || !VALID_STATUSES.includes(status)) {
    return NextResponse.json(
      { error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}` },
      { status: 400 }
    );
  }

  const reports = getStoredReports();
  const report = reports.find((r) => r.id === id);

  if (!report) {
    return NextResponse.json({ error: `Report with ID "${id}" not found.` }, { status: 404 });
  }

  updateReportStatusRecord(id, status);

  const sql = getDb();
  if (sql) {
    try {
      await sql`
        UPDATE problem_reports 
        SET status = ${status} 
        WHERE id = ${id}
      `;
    } catch (err) {
      console.warn('Neon update report error:', err);
    }
  }

  await logHermesAction({
    action: 'REPORT_STATUS_UPDATED',
    targetType: 'Report',
    targetId: id,
    details: `Moderation report marked as ${status}. ${notes ? `Notes: ${notes}` : ''}`,
  });

  return NextResponse.json({
    success: true,
    message: `Report "${id}" status updated to "${status}".`,
    report_id: id,
    new_status: status,
  });
}
