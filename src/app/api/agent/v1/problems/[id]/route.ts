import { NextRequest, NextResponse } from 'next/server';
import { getAgentProblem, isValidProblemId } from '@/lib/agent-api';
import { authenticateHermesRequest } from '@/lib/hermes-auth';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = authenticateHermesRequest(req);
  if (!auth.authorized) return auth.errorResponse;

  const { id } = await params;
  if (!isValidProblemId(id)) {
    return NextResponse.json(
      { error: 'Invalid problem ID.' },
      { status: 400, headers: { 'Cache-Control': 'private, no-store' } }
    );
  }

  try {
    const result = await getAgentProblem(id);
    if (!result) {
      return NextResponse.json(
        { error: 'Problem not found.' },
        { status: 404, headers: { 'Cache-Control': 'private, no-store' } }
      );
    }

    return NextResponse.json(result, {
      headers: { 'Cache-Control': 'private, no-store' },
    });
  } catch {
    console.error('Hermes API problem detail read failed.');
    return NextResponse.json(
      { error: 'Problem data is temporarily unavailable.' },
      { status: 503, headers: { 'Cache-Control': 'private, no-store' } }
    );
  }
}
