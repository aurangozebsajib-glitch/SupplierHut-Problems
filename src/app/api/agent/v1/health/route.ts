import { NextResponse } from 'next/server';
import { testDatabaseConnection, isDatabaseConfigured } from '@/lib/db';

export async function GET() {
  const isDbConfigured = isDatabaseConfigured();
  let dbStatus = 'not_configured';

  if (isDbConfigured) {
    const check = await testDatabaseConnection();
    dbStatus = check.connected ? 'connected' : 'connection_error';
  }

  const isClerkConfigured = Boolean(
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY
  );
  const isHermesTokenConfigured = Boolean(process.env.HERMES_API_TOKEN);

  return NextResponse.json({
    status: 'ok',
    api_version: 'v1',
    agent_operator: 'Hermes Agent v0.22.5',
    timestamp: new Date().toISOString(),
    services: {
      neon_database: dbStatus,
      clerk_authentication: isClerkConfigured ? 'configured' : 'pending_keys',
      hermes_token: isHermesTokenConfigured ? 'configured' : 'missing',
    },
    documentation_url: '/api/agent/v1/openapi.json',
  });
}
