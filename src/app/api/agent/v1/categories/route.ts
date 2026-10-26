import { NextRequest, NextResponse } from 'next/server';
import { authenticateHermesRequest } from '@/lib/hermes-auth';
import { Sector, OpportunityType, DifficultyLevel, ValidationStatus } from '@/types';

export async function GET(req: NextRequest) {
  const auth = authenticateHermesRequest(req);
  if (!auth.authorized) {
    return auth.errorResponse!;
  }

  const sectors: Sector[] = [
    'Agriculture',
    'Education',
    'Healthcare',
    'Logistics',
    'Retail & SMEs',
    'Technology',
    'Environment',
    'Employment',
    'Finance',
    'Public Services',
    'Other',
  ];

  const opportunityTypes: OpportunityType[] = [
    'Open Problem',
    'Paid Challenge',
    'Client Request',
    'Collaboration',
    'Marketplace',
  ];

  const difficultyLevels: DifficultyLevel[] = [
    'Low-Cost / Fast Entry',
    'Moderate',
    'High Technical',
    'Systemic / Capital Intensive',
  ];

  const validationStatuses: ValidationStatus[] = [
    'Unverified',
    'Researching',
    'Evidence Supported',
    'Validated',
    'Archived',
  ];

  const divisions = [
    'Dhaka',
    'Chittagong',
    'Rajshahi',
    'Khulna',
    'Sylhet',
    'Barishal',
    'Rangpur',
    'Mymensingh',
    'National',
  ];

  return NextResponse.json({
    sectors,
    opportunity_types: opportunityTypes,
    difficulty_levels: difficultyLevels,
    validation_statuses: validationStatuses,
    divisions,
  });
}
