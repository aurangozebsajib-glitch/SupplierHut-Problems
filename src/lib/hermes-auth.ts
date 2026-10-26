import { timingSafeEqual } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { addAuditLog } from '@/lib/data-store';
import { AuditLogItem } from '@/types';

export interface AuthResult {
  authorized: boolean;
  actor: string;
  errorResponse?: NextResponse;
}

// In-memory rate limiting (sliding 60-second window)
// 60 requests per minute per IP / token
interface RateLimitRecord {
  count: number;
  resetAt: number;
}
const rateLimitMap = new Map<string, RateLimitRecord>();
const RATE_LIMIT_MAX = 60;
const RATE_LIMIT_WINDOW_MS = 60 * 1000;

function checkRateLimit(identifier: string): { allowed: boolean; remaining: number; resetSeconds: number } {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);

  // Clean up stale entries periodically
  if (rateLimitMap.size > 1000) {
    for (const [key, val] of rateLimitMap.entries()) {
      if (val.resetAt < now) rateLimitMap.delete(key);
    }
  }

  if (!record || record.resetAt < now) {
    rateLimitMap.set(identifier, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return {
      allowed: true,
      remaining: RATE_LIMIT_MAX - 1,
      resetSeconds: Math.ceil(RATE_LIMIT_WINDOW_MS / 1000),
    };
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return {
      allowed: false,
      remaining: 0,
      resetSeconds: Math.ceil((record.resetAt - now) / 1000),
    };
  }

  record.count += 1;
  return {
    allowed: true,
    remaining: RATE_LIMIT_MAX - record.count,
    resetSeconds: Math.ceil((record.resetAt - now) / 1000),
  };
}

/**
 * Validates the HERMES_API_TOKEN from the Authorization: Bearer header
 * using constant-time comparison to prevent timing attacks.
 */
export function authenticateHermesRequest(req: NextRequest): AuthResult {
  const serverToken = process.env.HERMES_API_TOKEN?.trim();

  // Rate-limiting check based on IP or client identifier
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown-client';
  const rateLimit = checkRateLimit(ip);

  if (!rateLimit.allowed) {
    return {
      authorized: false,
      actor: 'anonymous',
      errorResponse: NextResponse.json(
        {
          error: 'Rate limit exceeded. Too many requests to Hermes Agent API.',
          retry_after_seconds: rateLimit.resetSeconds,
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(rateLimit.resetSeconds),
            'X-RateLimit-Limit': String(RATE_LIMIT_MAX),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(rateLimit.resetSeconds),
          },
        }
      ),
    };
  }

  if (!serverToken) {
    return {
      authorized: false,
      actor: 'anonymous',
      errorResponse: NextResponse.json(
        {
          error: 'Server configuration error: HERMES_API_TOKEN is not configured in Vercel / server environment.',
          code: 'AUTH_TOKEN_NOT_CONFIGURED',
        },
        { status: 503 }
      ),
    };
  }

  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return {
      authorized: false,
      actor: 'anonymous',
      errorResponse: NextResponse.json(
        {
          error: 'Unauthorized: Missing or malformed Authorization header. Expected: Bearer <HERMES_API_TOKEN>',
          code: 'MISSING_AUTHORIZATION_HEADER',
        },
        { status: 401 }
      ),
    };
  }

  const providedToken = authHeader.slice(7).trim();

  // Constant-time comparison
  const serverBuffer = Buffer.from(serverToken);
  const clientBuffer = Buffer.from(providedToken);

  if (serverBuffer.length !== clientBuffer.length || !timingSafeEqual(serverBuffer, clientBuffer)) {
    return {
      authorized: false,
      actor: 'anonymous',
      errorResponse: NextResponse.json(
        {
          error: 'Unauthorized: Invalid HERMES_API_TOKEN provided.',
          code: 'INVALID_TOKEN',
        },
        { status: 401 }
      ),
    };
  }

  return {
    authorized: true,
    actor: 'hermes-agent',
  };
}

/**
 * Records an audit log for an action performed by the Hermes Agent.
 * Persists to Neon database if configured, and into the local audit trail.
 */
export async function logHermesAction(params: {
  action: string;
  targetType: AuditLogItem['targetType'];
  targetId: string;
  details: string;
}): Promise<void> {
  const { action, targetType, targetId, details } = params;

  // 1. Record in data-store
  try {
    addAuditLog({
      actorEmail: 'hermes-agent@supplierhut.internal',
      actorRole: 'admin',
      action,
      targetType,
      targetId,
      details: `[Hermes v0.22.5 API] ${details}`,
    });
  } catch {
    // Non-fatal
  }

  // 2. Record in Neon Database if live
  try {
    const sql = getDb();
    if (sql) {
      const id = `audit_${Date.now()}_${Math.floor(Math.random() * 9999)}`;
      await sql`
        INSERT INTO audit_logs (id, actor_email, actor_role, action, target_type, target_id, details)
        VALUES (
          ${id},
          ${'hermes-agent@supplierhut.internal'},
          ${'admin'},
          ${action},
          ${targetType},
          ${targetId},
          ${`[Hermes v0.22.5 API] ${details}`}
        )
      `;
    }
  } catch (err) {
    console.warn('Neon audit log insertion error (Hermes action recorded in memory fallback):', err);
  }
}
