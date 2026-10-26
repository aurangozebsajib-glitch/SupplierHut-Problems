import { NextResponse } from 'next/server';
import { verifyServerAdmin, getMaskedAdminEmail } from '@/lib/auth-server';

export async function GET() {
  const result = await verifyServerAdmin();
  const maskedEmail = getMaskedAdminEmail();

  return NextResponse.json({
    ...result,
    maskedAdminEmail: maskedEmail,
  });
}
