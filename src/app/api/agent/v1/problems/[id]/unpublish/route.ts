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

  problem.validationStatus = 'Unverified';
  problem.confidenceScorePercent = 40;
  problem.updatedAt = new Date().toISOString().split('T')[0];

  saveProblemRecord(problem);

  const sql = getDb();
  if (sql) {
    try {
      await sql`
        UPDATE platform_problems 
        SET 
          validation_status = 'Unverified',
          confidence_score_percent = 40,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ${problem.id}
      `;
    } catch (err) {
      console.warn('Neon database unpublish problem error:', err);
    }
  }

  await logHermesAction({
    action: 'PROBLEM_UNPUBLISHED',
    targetType: 'Problem',
    targetId: problem.id,
    details: `Reverted problem "${problem.title}" to Unverified draft status.`,
  });

  return NextResponse.json({
    success: true,
    message: `Problem "${problem.id}" unpublished (reverted to Unverified draft).`,
    problem,
  });
}
