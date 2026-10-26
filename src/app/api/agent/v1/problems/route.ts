import { NextRequest, NextResponse } from 'next/server';
import { listAgentProblems, parseProblemFilters } from '@/lib/agent-api';
import { authenticateHermesRequest } from '@/lib/hermes-auth';

export async function GET(req: NextRequest) {
  const auth = authenticateHermesRequest(req);
  if (!auth.authorized) return auth.errorResponse;

  const parsed = parseProblemFilters(req.nextUrl.searchParams);
  if ('error' in parsed) {
    return NextResponse.json(
      { error: parsed.error },
      { status: 400, headers: { 'Cache-Control': 'private, no-store' } }
    );
  }

  try {
    const result = await listAgentProblems(parsed.filters);
    return NextResponse.json(result, {
      headers: { 'Cache-Control': 'private, no-store' },
    });
  } catch {
    console.error('Hermes API problem listing failed.');
    return NextResponse.json(
      { error: 'Problem data is temporarily unavailable.' },
      { status: 503, headers: { 'Cache-Control': 'private, no-store' } }
    );
  }
}
