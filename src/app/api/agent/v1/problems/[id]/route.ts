import { NextRequest, NextResponse } from 'next/server';
import { authenticateHermesRequest, logHermesAction } from '@/lib/hermes-auth';
import { getStoredProblems, saveProblemRecord, deleteProblemRecord } from '@/lib/data-store';
import { getDb } from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = authenticateHermesRequest(req);
  if (!auth.authorized) {
    return auth.errorResponse!;
  }

  const { id } = await params;

  // Search by ID or slug
  const problems = getStoredProblems();
  const problem = problems.find((p) => p.id === id || p.slug === id);

  if (!problem) {
    return NextResponse.json({ error: `Problem with ID or slug "${id}" not found.` }, { status: 404 });
  }

  return NextResponse.json({ problem });
}

export async function PATCH(
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

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Malformed JSON payload' }, { status: 400 });
  }

  const { dry_run = false, ...updates } = body;

  if (dry_run) {
    return NextResponse.json({
      dry_run: true,
      valid: true,
      message: `Payload for updating problem "${problem.id}" is valid. No changes were written.`,
      target_id: problem.id,
      fields_to_update: Object.keys(updates),
    });
  }

  // Apply updates safely
  if (updates.title && typeof updates.title === 'string') problem.title = updates.title.trim();
  if (updates.summary && typeof updates.summary === 'string') problem.summary = updates.summary.trim();
  if (updates.fullDescription && typeof updates.fullDescription === 'string')
    problem.fullDescription = updates.fullDescription.trim();
  if (updates.sector) problem.sector = updates.sector;
  if (updates.location) problem.location = updates.location;
  if (updates.division) problem.division = updates.division;
  if (updates.validationStatus) problem.validationStatus = updates.validationStatus;
  if (updates.opportunityType) problem.opportunityType = updates.opportunityType;
  if (updates.difficulty) problem.difficulty = updates.difficulty;
  if (updates.timeToFirstTest) problem.timeToFirstTest = updates.timeToFirstTest;
  if (typeof updates.featured === 'boolean') problem.featured = updates.featured;
  if (typeof updates.confidenceScorePercent === 'number')
    problem.confidenceScorePercent = updates.confidenceScorePercent;

  problem.updatedAt = new Date().toISOString().split('T')[0];

  // 1. Save in local/server data-store
  saveProblemRecord(problem);

  // 2. Save in Neon SQL if connected
  const sql = getDb();
  if (sql) {
    try {
      await sql`
        UPDATE platform_problems
        SET
          title = ${problem.title},
          summary = ${problem.summary},
          full_description = ${problem.fullDescription},
          sector = ${problem.sector},
          location = ${problem.location},
          division = ${problem.division},
          validation_status = ${problem.validationStatus},
          confidence_score_percent = ${problem.confidenceScorePercent},
          opportunity_type = ${problem.opportunityType},
          difficulty = ${problem.difficulty},
          featured = ${problem.featured},
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ${problem.id}
      `;
    } catch (err) {
      console.warn('Neon database update problem error:', err);
    }
  }

  // 3. Log audit action
  await logHermesAction({
    action: 'PROBLEM_UPDATED',
    targetType: 'Problem',
    targetId: problem.id,
    details: `Updated fields: ${Object.keys(updates).join(', ')}`,
  });

  return NextResponse.json({
    success: true,
    message: 'Problem updated successfully',
    problem,
  });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = authenticateHermesRequest(req);
  if (!auth.authorized) {
    return auth.errorResponse!;
  }

  const { id } = await params;
  const { searchParams } = new URL(req.url);

  const confirmDestructive = searchParams.get('confirm_destructive') === 'true';
  const confirmationHeader = req.headers.get('x-owner-confirmation');

  // Enforce security guardrail: explicit owner approval required for destructive changes
  if (!confirmDestructive || confirmationHeader !== 'confirmed') {
    return NextResponse.json(
      {
        error:
          'Security Guardrail: Permanent deletion of problem records requires explicit confirmation. Please consider archiving instead via POST /api/agent/v1/problems/[id]/archive. To permanently delete, provide query param "confirm_destructive=true" and header "X-Owner-Confirmation: confirmed".',
        code: 'CONFIRMATION_REQUIRED',
      },
      { status: 403 }
    );
  }

  const problems = getStoredProblems();
  const problem = problems.find((p) => p.id === id || p.slug === id);

  if (!problem) {
    return NextResponse.json({ error: `Problem with ID or slug "${id}" not found.` }, { status: 404 });
  }

  // Delete from data-store
  deleteProblemRecord(problem.id);

  // Delete from Neon SQL if connected
  const sql = getDb();
  if (sql) {
    try {
      await sql`DELETE FROM platform_problems WHERE id = ${problem.id}`;
    } catch (err) {
      console.warn('Neon database delete problem error:', err);
    }
  }

  // Log audit action
  await logHermesAction({
    action: 'PROBLEM_DELETED',
    targetType: 'Problem',
    targetId: problem.id,
    details: `Permanently deleted problem "${problem.title}" with confirmed authorization.`,
  });

  return NextResponse.json({
    success: true,
    message: `Problem "${problem.id}" was permanently deleted.`,
    deleted_id: problem.id,
  });
}
