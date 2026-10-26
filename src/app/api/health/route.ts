import { NextResponse } from 'next/server';
import { testDatabaseConnection, isDatabaseConfigured } from '@/lib/db';
import { getMaskedAdminEmail } from '@/lib/auth-server';

export async function GET() {
  const isClerkPubConfigured = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);
  const isClerkSecConfigured = Boolean(process.env.CLERK_SECRET_KEY);
  const isDatabaseSet = isDatabaseConfigured();
  const isAdminEmailSet = Boolean(process.env.ADMIN_EMAIL);

  let dbConnectionResult: { connected: boolean; latencyMs?: number; error?: string } = { 
    connected: false, 
    error: 'Database not configured' 
  };
  if (isDatabaseSet) {
    dbConnectionResult = await testDatabaseConnection();
  }

  return NextResponse.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: {
      clerk: {
        configured: isClerkPubConfigured && isClerkSecConfigured,
        hasPublishableKey: isClerkPubConfigured,
        hasSecretKey: isClerkSecConfigured,
        signInUrl: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL || '/sign-in',
        signUpUrl: process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL || '/sign-up',
        afterSignInUrl: process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL || '/',
        afterSignUpUrl: process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL || '/',
      },
      database: {
        configured: isDatabaseSet,
        hasPooledUrl: Boolean(process.env.DATABASE_URL),
        hasUnpooledUrl: Boolean(process.env.DATABASE_URL_UNPOOLED),
        liveCheck: dbConnectionResult,
      },
      admin: {
        configured: isAdminEmailSet,
        maskedEmail: getMaskedAdminEmail(),
      },
    },
  });
}
