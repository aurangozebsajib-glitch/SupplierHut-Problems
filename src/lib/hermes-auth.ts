import { createHash, timingSafeEqual } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';

export type AuthResult =
  | { authorized: true }
  | { authorized: false; errorResponse: NextResponse };

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const rateLimitMap = new Map<string, RateLimitRecord>();
const RATE_LIMIT_MAX = 60;
const RATE_LIMIT_WINDOW_MS = 60_000;

function checkRateLimit(): { allowed: boolean; resetSeconds: number } {
  const now = Date.now();
  const key = 'hermes-agent';
  const record = rateLimitMap.get(key);

  if (!record || record.resetAt <= now) {
    rateLimitMap.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true, resetSeconds: RATE_LIMIT_WINDOW_MS / 1000 };
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return {
      allowed: false,
      resetSeconds: Math.max(1, Math.ceil((record.resetAt - now) / 1000)),
    };
  }

  record.count += 1;
  return {
    allowed: true,
    resetSeconds: Math.max(1, Math.ceil((record.resetAt - now) / 1000)),
  };
}

function tokensMatch(expected: string, provided: string): boolean {
  const expectedDigest = createHash('sha256').update(expected).digest();
  const providedDigest = createHash('sha256').update(provided).digest();
  return timingSafeEqual(expectedDigest, providedDigest);
}

export function authenticateHermesRequest(req: NextRequest): AuthResult {
  const serverToken = process.env.HERMES_API_TOKEN?.trim();
  if (!serverToken) {
    return {
      authorized: false,
      errorResponse: NextResponse.json(
        { error: 'API authentication is unavailable.' },
        { status: 503, headers: { 'Cache-Control': 'private, no-store' } }
      ),
    };
  }

  const authHeader = req.headers.get('authorization');
  const providedToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
  if (!providedToken || !tokensMatch(serverToken, providedToken)) {
    return {
      authorized: false,
      errorResponse: NextResponse.json(
        { error: 'Unauthorized.' },
        { status: 401, headers: { 'Cache-Control': 'private, no-store' } }
      ),
    };
  }

  const rateLimit = checkRateLimit();
  if (!rateLimit.allowed) {
    return {
      authorized: false,
      errorResponse: NextResponse.json(
        { error: 'Rate limit exceeded.' },
        {
          status: 429,
          headers: {
            'Cache-Control': 'private, no-store',
            'Retry-After': String(rateLimit.resetSeconds),
          },
        }
      ),
    };
  }

  return { authorized: true };
}
