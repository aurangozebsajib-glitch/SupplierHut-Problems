import { NextRequest, NextResponse } from 'next/server';
import { authenticateHermesRequest } from '@/lib/hermes-auth';

export async function GET(req: NextRequest) {
  const auth = authenticateHermesRequest(req);
  if (!auth.authorized) {
    return auth.errorResponse!;
  }

  return NextResponse.json({
    api_version: 'v1',
    agent_operator: 'Hermes Agent v0.22.5',
    supported_capabilities: [
      {
        resource: 'health',
        operations: ['GET'],
        description: 'Check platform status, database connectivity, and auth state.',
        requires_confirmation: false,
      },
      {
        resource: 'capabilities',
        operations: ['GET'],
        description: 'Introspect supported schemas and permission limits.',
        requires_confirmation: false,
      },
      {
        resource: 'problems',
        operations: ['GET', 'POST', 'PATCH', 'DELETE'],
        description: 'Search, read, create, edit, draft, publish, unpublish, and archive problems. Supports dry_run.',
        requires_confirmation: true,
        confirmation_rules: 'DELETE requires confirm_destructive=true query param and X-Owner-Confirmation: confirmed header. Recommended to use archive instead.',
      },
      {
        resource: 'categories',
        operations: ['GET'],
        description: 'List Bangladesh problem sectors, opportunity types, difficulty levels, and divisions.',
        requires_confirmation: false,
      },
      {
        resource: 'reports',
        operations: ['GET', 'PATCH'],
        description: 'Inspect and moderate user-reported content/abuse tickets (Open, Reviewed, Resolved, Dismissed).',
        requires_confirmation: false,
      },
      {
        resource: 'proposals',
        operations: ['GET', 'PATCH'],
        description: 'Read and update technical solution proposals submitted by solvers.',
        requires_confirmation: false,
      },
      {
        resource: 'analytics',
        operations: ['GET'],
        description: 'Retrieve real platform aggregates: counts by sector, validation status, and moderation queues.',
        requires_confirmation: false,
      },
      {
        resource: 'settings',
        operations: ['GET'],
        description: 'Inspect public platform configuration (currency: BDT, timezone: Asia/Dhaka).',
        requires_confirmation: false,
      },
      {
        resource: 'users',
        operations: ['GET'],
        description: 'Read public sanitized user profiles. Passwords and credentials never exposed.',
        requires_confirmation: false,
      },
      {
        resource: 'audit-logs',
        operations: ['GET'],
        description: 'Read audit log entries for all user and agent activities.',
        requires_confirmation: false,
      },
    ],
    unsupported_capabilities: [
      {
        feature: 'direct_escrow_payout',
        reason: 'Payment gateway integration not finalized. Escrow funds must not be disbursed automatically.',
      },
      {
        feature: 'user_account_deletion',
        reason: 'Clerk user accounts and identities must be managed directly by platform owner in Clerk Dashboard.',
      },
      {
        feature: 'database_drop_or_truncate',
        reason: 'Destructive database schema changes are strictly prohibited via API to prevent accidental data loss.',
      },
      {
        feature: 'bulk_destructive_delete',
        reason: 'Bulk deletion without itemized review is disabled by security policy.',
      },
    ],
    guardrails: {
      rate_limit: '60 requests per minute',
      confirmation_header: 'X-Owner-Confirmation: confirmed (for DELETE operations)',
      audit_logging: 'All write/update/delete operations automatically logged with actor hermes-agent',
      dry_run_support: 'Available on POST /problems and PATCH /problems/[id] with { "dry_run": true }',
    },
  });
}
