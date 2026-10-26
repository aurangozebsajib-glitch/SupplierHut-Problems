import { NextRequest, NextResponse } from 'next/server';
import { authenticateHermesRequest, logHermesAction } from '@/lib/hermes-auth';
import { getStoredProblems, saveProblemRecord } from '@/lib/data-store';
import { getDb } from '@/lib/db';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = authenticateHermesRequest(req);
  if (!auth.authorized) {
    return auth.errorResponse!;
  }

  const { id } = await params;
  const problems = getStoredProblems();
  const problem = problems.find((p) => p.id === id || p.slug === id);

  if (!problem) {
    return NextResponse.json({ error: `Problem with ID or slug "${id}" not found.` }, { status: 404 });
  }

  let body: { status?: 'Validated' | 'Evidence Supported' } = {};
  try {
    body = await req.json();
  } catch {
    // Empty body is acceptable, defaults to 'Validated'
  }

  const targetStatus = body.status === 'Evidence Supported' ? 'Evidence Supported' : 'Validated';
  problem.validationStatus = targetStatus;
  problem.confidenceScorePercent = targetStatus === 'Validated' ? 95 : 80;
  problem.updatedAt = new Date().toISOString().split('T')[0];

  saveProblemRecord(problem);

  const sql = getDb();
  if (sql) {
    try {
      await sql`
        UPDATE platform_problems 
        SET 
          validation_status = ${problem.validationStatus},
          confidence_score_percent = ${problem.confidenceScorePercent},
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ${problem.id}
      `;
    } catch (err) {
      console.warn('Neon database publish problem error:', err);
    }
  }

  await logHermesAction({
    action: 'PROBLEM_PUBLISHED',
    targetType: 'Problem',
    targetId: problem.id,
    details: `Published problem "${problem.title}" with status "${targetStatus}".`,
  });

  return NextResponse.json({
    success: true,
    message: `Problem "${problem.id}" published with status "${targetStatus}".`,
    problem,
  });
}
