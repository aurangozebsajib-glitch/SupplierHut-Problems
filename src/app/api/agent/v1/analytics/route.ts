import { NextRequest, NextResponse } from 'next/server';
import { getAgentAnalytics } from '@/lib/agent-api';
import { authenticateHermesRequest } from '@/lib/hermes-auth';

export async function GET(req: NextRequest) {
  const auth = authenticateHermesRequest(req);
  if (!auth.authorized) return auth.errorResponse;

  try {
    const analytics = await getAgentAnalytics();
    return NextResponse.json(analytics, {
      headers: { 'Cache-Control': 'private, no-store' },
    });
  } catch {
    console.error('Hermes API analytics read failed.');
    return NextResponse.json(
      { error: 'Analytics are temporarily unavailable.' },
      { status: 503, headers: { 'Cache-Control': 'private, no-store' } }
    );
  }
}
