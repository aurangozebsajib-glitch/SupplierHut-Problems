import { NextRequest, NextResponse } from 'next/server';
import { authenticateHermesRequest } from '@/lib/hermes-auth';
import { getAllUsers } from '@/lib/data-store';

export async function GET(req: NextRequest) {
  const auth = authenticateHermesRequest(req);
  if (!auth.authorized) {
    return auth.errorResponse!;
  }

  const users = getAllUsers();

  // Sanitize fields: exclude private email addresses if user prefers, strictly strip any credentials
  const sanitizedUsers = users.map((u) => ({
    id: u.id,
    name: u.name,
    role: u.role,
    title: u.title,
    location: u.location,
    skills: u.skills,
    preferred_sectors: u.preferredSectors,
    bio: u.bio,
    portfolio_url: u.portfolioUrl || null,
  }));

  return NextResponse.json({
    total: sanitizedUsers.length,
    users: sanitizedUsers,
  });
}
