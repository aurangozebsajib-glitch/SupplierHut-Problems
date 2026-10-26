import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(
    { status: 'ok', api_version: 'v1' },
    { headers: { 'Cache-Control': 'no-store' } }
  );
}
