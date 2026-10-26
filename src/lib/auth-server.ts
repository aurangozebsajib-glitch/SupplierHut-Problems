import { currentUser } from '@clerk/nextjs/server';

export interface AdminVerificationResult {
  authorized: boolean;
  reason?: string;
  adminEmailConfigured: boolean;
  isClerkConfigured: boolean;
  authenticatedUserEmail?: string;
  adminUser?: {
    id: string;
    email: string;
    name: string;
  };
}

/**
 * Server-side administrator verification.
 * 
 * CRITICAL SECURITY GUARANTEES:
 * 1. Never trusts client-side storage, cookies, or parameters for admin role.
 * 2. Authenticates through Clerk server-side session (currentUser).
 * 3. Enforces that the authenticated user possesses a VERIFIED email matching ADMIN_EMAIL.
 * 4. Denies access by default if unauthenticated, email unverified, or ADMIN_EMAIL is unset.
 */
export async function verifyServerAdmin(): Promise<AdminVerificationResult> {
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const hasClerkSecret = Boolean(process.env.CLERK_SECRET_KEY);
  const hasClerkPub = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

  if (!adminEmail) {
    return {
      authorized: false,
      reason: 'ADMIN_EMAIL is not configured in environment variables.',
      adminEmailConfigured: false,
      isClerkConfigured: hasClerkSecret && hasClerkPub,
    };
  }

  if (!hasClerkSecret) {
    return {
      authorized: false,
      reason: 'CLERK_SECRET_KEY is not configured on the server.',
      adminEmailConfigured: true,
      isClerkConfigured: false,
    };
  }

  try {
    const user = await currentUser();

    if (!user) {
      return {
        authorized: false,
        reason: 'Unauthenticated. You must be signed in with your administrator account.',
        adminEmailConfigured: true,
        isClerkConfigured: true,
      };
    }

    const primaryEmail = user.primaryEmailAddress?.emailAddress || user.emailAddresses[0]?.emailAddress;

    // Check all verified email addresses associated with this Clerk account
    const matchedEmail = user.emailAddresses.find((e) => {
      const isMatch = e.emailAddress.trim().toLowerCase() === adminEmail;
      const isVerified = e.verification?.status === 'verified';
      return isMatch && isVerified;
    });

    if (matchedEmail) {
      return {
        authorized: true,
        adminEmailConfigured: true,
        isClerkConfigured: true,
        authenticatedUserEmail: matchedEmail.emailAddress,
        adminUser: {
          id: user.id,
          email: matchedEmail.emailAddress,
          name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username || 'Administrator',
        },
      };
    }

    // Found user, but email does not match or is unverified
    return {
      authorized: false,
      reason: `Authenticated as ${primaryEmail || 'user'}, but this account is not authorized as administrator or email is unverified.`,
      adminEmailConfigured: true,
      isClerkConfigured: true,
      authenticatedUserEmail: primaryEmail,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error checking Clerk session';
    return {
      authorized: false,
      reason: `Server auth check error: ${message}`,
      adminEmailConfigured: true,
      isClerkConfigured: true,
    };
  }
}

/**
 * Returns a masked representation of ADMIN_EMAIL for UI guidance (e.g. ad***n@supplierhut.bd)
 */
export function getMaskedAdminEmail(): string | null {
  const raw = process.env.ADMIN_EMAIL?.trim();
  if (!raw) return null;
  const parts = raw.split('@');
  if (parts.length !== 2) return null;
  const [name, domain] = parts;
  if (name.length <= 2) {
    return `${name[0]}*@${domain}`;
  }
  return `${name.slice(0, 2)}***${name.slice(-1)}@${domain}`;
}
