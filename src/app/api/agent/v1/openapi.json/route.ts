import { NextResponse } from 'next/server';
import { openApiSpecification } from '@/lib/openapi-spec';

export async function GET() {
  return NextResponse.json(openApiSpecification, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
