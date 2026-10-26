import { NextRequest, NextResponse } from 'next/server';
import { authenticateHermesRequest, logHermesAction } from '@/lib/hermes-auth';
import { getStoredProposals, updateProposalStatusRecord } from '@/lib/data-store';
import { getDb } from '@/lib/db';
import { ProposalStatus } from '@/types';

const VALID_PROPOSAL_STATUSES: ProposalStatus[] = [
  'Draft',
  'Submitted',
  'Under Review',
  'Shortlisted',
  'Accepted',
  'Rejected',
  'Completed',
];

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

  const { status, reviewerNotes } = body;
  if (!status || !VALID_PROPOSAL_STATUSES.includes(status)) {
    return NextResponse.json(
      { error: `Invalid status. Must be one of: ${VALID_PROPOSAL_STATUSES.join(', ')}` },
      { status: 400 }
    );
  }

  const proposals = getStoredProposals();
  const proposal = proposals.find((pr) => pr.id === id);

  if (!proposal) {
    return NextResponse.json({ error: `Proposal with ID "${id}" not found.` }, { status: 404 });
  }

  updateProposalStatusRecord(id, status, reviewerNotes);

  const sql = getDb();
  if (sql) {
    try {
      await sql`
        UPDATE solution_proposals 
        SET 
          status = ${status},
          reviewer_notes = ${reviewerNotes || null},
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ${id}
      `;
    } catch (err) {
      console.warn('Neon update proposal error:', err);
    }
  }

  await logHermesAction({
    action: 'PROPOSAL_STATUS_UPDATED',
    targetType: 'Proposal',
    targetId: id,
    details: `Proposal marked as "${status}". Reviewer note: ${reviewerNotes || 'Reviewed by Hermes Agent'}`,
  });

  return NextResponse.json({
    success: true,
    message: `Proposal "${id}" updated to status "${status}".`,
    proposal_id: id,
    new_status: status,
  });
}
