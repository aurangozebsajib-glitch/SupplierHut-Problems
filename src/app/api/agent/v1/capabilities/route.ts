import { NextRequest, NextResponse } from 'next/server';
import { authenticateHermesRequest } from '@/lib/hermes-auth';

export async function GET(req: NextRequest) {
  const auth = authenticateHermesRequest(req);
  if (!auth.authorized) return auth.errorResponse;

  return NextResponse.json(
    {
      api_version: 'v1',
      operations: [
        {
          method: 'GET',
          path: '/health',
          authentication: 'public',
          permission: 'Read public API status only.',
        },
        {
          method: 'GET',
          path: '/capabilities',
          authentication: 'bearer_token',
          permission: 'Read this capability inventory.',
        },
        {
          method: 'GET',
          path: '/problems',
          authentication: 'bearer_token',
          permission: 'Read approved problem records; statuses are restricted below.',
        },
        {
          method: 'GET',
          path: '/problems/{id}',
          authentication: 'bearer_token',
          permission: 'Read one approved problem record.',
        },
        {
          method: 'GET',
          path: '/analytics',
          authentication: 'bearer_token',
          permission: 'Read aggregate counts for approved problem statuses.',
        },
        {
          method: 'GET',
          path: '/openapi.json',
          authentication: 'public',
          permission: 'Read the machine-readable API contract.',
        },
      ],
      access_mode: 'read_only',
      writes_enabled: false,
      problem_statuses: ['Evidence Supported', 'Validated'],
      unsupported_operations: [
        {
          resource: 'problems',
          operations: ['create', 'edit', 'delete', 'publish', 'unpublish', 'archive', 'moderate'],
          reason: 'No shared authoritative website/database persistence layer is established.',
        },
        {
          resource: 'proposals, reports, comments, users, categories, audit logs',
          operations: ['read', 'create', 'edit', 'delete', 'moderate'],
          reason: 'These application features do not currently have supported Hermes API routes.',
        },
      ],
      known_data_limits: [
        'The website uses browser localStorage and server seed/in-memory data for problem records.',
        'When database credentials are configured, Hermes problem reads query Neon platform_problems.',
        'data_source: database means the response came from a Neon query; it does not prove synchronization with all website data. data_source: seed_data means server seed fallback data, not verified live or authoritative website data. List and analytics may use seed fallback when the database is unconfigured or a query fails; detail may also use a matching seed record when a successful database lookup finds no matching record.',
        'Website submissions and admin changes are not synchronized to Neon.',
        'The current problem schema has no draft or publication state.',
      ],
    },
    { headers: { 'Cache-Control': 'private, no-store' } }
  );
}
