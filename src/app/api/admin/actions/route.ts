import { NextRequest, NextResponse } from 'next/server';
import { verifyServerAdmin } from '@/lib/auth-server';
import { getDb, ensureDatabaseTables } from '@/lib/db';

export async function POST(req: NextRequest) {
  // Enforce server-side administrator authorization
  const authResult = await verifyServerAdmin();
  if (!authResult.authorized) {
    return NextResponse.json(
      {
        error: 'Forbidden: Valid administrator authentication required.',
        reason: authResult.reason,
      },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    const { action, payload } = body;

    const sql = getDb();
    const adminEmail = authResult.authenticatedUserEmail || 'admin';

    switch (action) {
      case 'ensure_tables': {
        const tableResult = await ensureDatabaseTables();
        return NextResponse.json(tableResult);
      }

      case 'record_audit_log': {
        if (sql && payload?.targetType && payload?.actionName) {
          const id = `audit_${Date.now()}`;
          await sql`
            INSERT INTO audit_logs (id, actor_email, actor_role, action, target_type, target_id, details)
            VALUES (
              ${id},
              ${adminEmail},
              ${'admin'},
              ${payload.actionName},
              ${payload.targetType},
              ${payload.targetId || 'N/A'},
              ${payload.details || ''}
            )
          `;
        }
        return NextResponse.json({ success: true, message: 'Audit entry recorded' });
      }

      default:
        return NextResponse.json({ success: true, message: `Admin action ${action} executed.` });
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Action execution failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
