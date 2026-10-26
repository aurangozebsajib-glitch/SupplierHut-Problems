import { NextRequest, NextResponse } from 'next/server';
import { authenticateHermesRequest } from '@/lib/hermes-auth';
import { isDatabaseConfigured } from '@/lib/db';

export async function GET(req: NextRequest) {
  const auth = authenticateHermesRequest(req);
  if (!auth.authorized) {
    return auth.errorResponse!;
  }

  return NextResponse.json({
    platform_name: 'SupplierHut Solutions - Bangladesh Problem & Income Platform',
    currency: 'BDT (৳)',
    timezone: 'Asia/Dhaka (UTC+6)',
    default_language: 'en-US (Architecture ready for bn-BD localization)',
    features: {
      problem_listings: true,
      evidence_auditing: true,
      solution_proposals: true,
      paid_challenges: true,
      abuse_moderation: true,
      database_persistence: isDatabaseConfigured(),
      clerk_authentication: Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY),
    },
    operational_rules: {
      guaranteed_income_forbidden: true,
      dry_run_supported: true,
      destructive_action_guardrails: true,
    },
  });
}
