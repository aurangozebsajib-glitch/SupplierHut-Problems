import { NextRequest, NextResponse } from 'next/server';
import { authenticateHermesRequest } from '@/lib/hermes-auth';

export async function GET(req: NextRequest) {
  const auth = authenticateHermesRequest(req);
  if (!auth.authorized) return auth.errorResponse;

  return NextResponse.json(
    {
      api_version: 'v1',
      operations: [
        { method: 'GET', path: '/health', authentication: 'public' },
        { method: 'GET', path: '/capabilities', authentication: 'bearer_token' },
        { method: 'GET', path: '/problems', authentication: 'bearer_token' },
        { method: 'GET', path: '/problems/{id}', authentication: 'bearer_token' },
        { method: 'GET', path: '/analytics', authentication: 'bearer_token' },
      ],
      writes_enabled: false,
      problem_statuses: ['Evidence Supported', 'Validated'],
    },
    { headers: { 'Cache-Control': 'private, no-store' } }
  );
}
