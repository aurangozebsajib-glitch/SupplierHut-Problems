import { NextRequest, NextResponse } from 'next/server';
import { authenticateHermesRequest, logHermesAction } from '@/lib/hermes-auth';
import { getStoredProblems, saveProblemRecord } from '@/lib/data-store';
import { getDb } from '@/lib/db';
import { Problem, Sector, OpportunityType, DifficultyLevel, ValidationStatus } from '@/types';

const VALID_SECTORS: Sector[] = [
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

export async function GET(req: NextRequest) {
  const auth = authenticateHermesRequest(req);
  if (!auth.authorized) {
    return auth.errorResponse!;
  }

  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q')?.toLowerCase();
  const sector = searchParams.get('sector');
  const status = searchParams.get('status');
  const division = searchParams.get('division');
  const opportunityType = searchParams.get('opportunityType');
  const limit = Math.min(parseInt(searchParams.get('limit') || '20', 10), 100);
  const offset = Math.max(parseInt(searchParams.get('offset') || '0', 10), 0);

  const sql = getDb();
  if (sql) {
    try {
      const rows = (await sql`
        SELECT * FROM platform_problems
        ORDER BY created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `) as unknown as Record<string, unknown>[];
      if (rows && rows.length > 0) {
        return NextResponse.json({
          source: 'neon_postgresql',
          total: rows.length,
          limit,
          offset,
          problems: rows,
        });
      }
    } catch {
      // Fallback
    }
  }

  let problems = getStoredProblems();

  if (q) {
    problems = problems.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.summary.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q)
    );
  }
  if (sector) {
    problems = problems.filter((p) => p.sector.toLowerCase() === sector.toLowerCase());
  }
  if (status) {
    problems = problems.filter((p) => p.validationStatus.toLowerCase() === status.toLowerCase());
  }
  if (division) {
    problems = problems.filter((p) => p.division.toLowerCase() === division.toLowerCase());
  }
  if (opportunityType) {
    problems = problems.filter(
      (p) => p.opportunityType.toLowerCase() === opportunityType.toLowerCase()
    );
  }

  const paginated = problems.slice(offset, offset + limit);

  return NextResponse.json({
    source: 'data_store',
    total: problems.length,
    limit,
    offset,
    problems: paginated,
  });
}

export async function POST(req: NextRequest) {
  const auth = authenticateHermesRequest(req);
  if (!auth.authorized) {
    return auth.errorResponse!;
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Malformed JSON payload' }, { status: 400 });
  }

  const {
    dry_run = false,
    title,
    summary,
    fullDescription,
    sector,
    location = 'All Bangladesh',
    division = 'National',
    affectedCustomerType = 'Local businesses and consumers',
    frequency = 'Regular occurrences',
    existingAlternatives = 'Informal manual workarounds',
    whyAlternativesFail = 'High cost, poor quality or inaccessibility',
    validationStatus = 'Unverified',
    opportunityType = 'Open Problem',
    difficulty = 'Moderate',
    timeToFirstTest = '14 to 30 days',
    skillsRequired = ['Market Research', 'Problem Solving'],
    estimatedStartupCostMinBDT = 25000,
    estimatedStartupCostMaxBDT = 80000,
    featured = false,
  } = body;

  // Validation
  if (!title || typeof title !== 'string' || title.trim().length < 5) {
    return NextResponse.json(
      { error: 'Field "title" is required and must be at least 5 characters long.' },
      { status: 400 }
    );
  }

  if (!summary || typeof summary !== 'string' || summary.trim().length < 10) {
    return NextResponse.json(
      { error: 'Field "summary" is required and must be at least 10 characters long.' },
      { status: 400 }
    );
  }

  if (!sector || !VALID_SECTORS.includes(sector as Sector)) {
    return NextResponse.json(
      { error: `Invalid sector "${sector}". Must be one of: ${VALID_SECTORS.join(', ')}` },
      { status: 400 }
    );
  }

  // Dry-run mode
  if (dry_run) {
    return NextResponse.json({
      dry_run: true,
      valid: true,
      message: 'Payload is valid and conforms to platform schema. No changes were written.',
      preview: {
        title: title.trim(),
        summary: summary.trim(),
        sector,
        location,
        division,
        validationStatus,
        opportunityType,
        difficulty,
      },
    });
  }

  const id = `prob-${Date.now()}`;
  const slug =
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '') + `-${Math.floor(Math.random() * 899 + 100)}`;

  const problem: Problem = {
    id,
    slug,
    title: title.trim(),
    summary: summary.trim(),
    fullDescription: fullDescription?.trim() || summary.trim(),
    sector: sector as Sector,
    location,
    division,
    affectedCustomerType,
    frequency,
    existingAlternatives,
    whyAlternativesFail,
    validationStatus: validationStatus as ValidationStatus,
    confidenceScorePercent: validationStatus === 'Validated' ? 90 : 40,
    opportunityType: opportunityType as OpportunityType,
    difficulty: difficulty as DifficultyLevel,
    estimatedStartupCostBDT: {
      min: Number(estimatedStartupCostMinBDT) || 25000,
      max: Number(estimatedStartupCostMaxBDT) || 80000,
      displayLabel: `৳${Number(estimatedStartupCostMinBDT).toLocaleString()} - ৳${Number(
        estimatedStartupCostMaxBDT
      ).toLocaleString()} BDT (Estimated)`,
    },
    skillsRequired,
    timeToFirstTest,
    featured: Boolean(featured),
    dateReported: new Date().toISOString().split('T')[0],
    updatedAt: new Date().toISOString().split('T')[0],
    reportedBy: {
      name: 'Hermes Agent Administrator',
      role: 'Automated Operations Agent (v0.22.5)',
      organization: 'SupplierHut Platform Governance',
    },
    imageUrl: '/images/hero_bangladesh_innovation_1792999684164.jpg',
    imageAlt: title.trim(),
    evidenceSources: [],
    marketAnalysis: {
      targetCustomerProfile: affectedCustomerType,
      estimatedTAMBDT: 'Needs Field Validation (Hypothesis)',
      estimatedSAMBDT: 'Needs Divisional Survey',
      marketSizingMethodology: 'Curated via Hermes Agent API; requires secondary documentation audit.',
      demandSignals: ['Documented sector friction in Bangladesh'],
      competitorsAndSubstitutes: ['Existing informal substitutes'],
      currentPricingExamples: ['Unstructured cash payments'],
      marketGaps: ['Affordable scalable solution for local market'],
    },
    potentialSolutions: [
      {
        id: `sol-${Date.now()}`,
        title: 'Initial Solution Outline',
        description: 'Solution framework ready for multidisciplinary solvers.',
        techStackOrMethod: 'To be determined by solvers',
        estimatedBuildTime: '3-4 weeks',
        upfrontCostEstimateBDT: `৳${Number(estimatedStartupCostMinBDT).toLocaleString()} estimated test`,
        pros: ['Addresses identified problem pain point'],
        cons: ['Requires early customer interviews'],
      },
    ],
    businessModels: ['Direct Service / Hardware Sale', 'Micro-fee per transaction'],
    validationPlan: {
      interviewQuestions: [
        'How often do you experience this problem each month?',
        'What current workaround do you use, and how much does it cost you?',
      ],
      landingPageExperiment: 'Interview 10 potential customers in the target division.',
      prototypeMVP: 'Create a minimum prototype or manual concierge test.',
      successCriteria: 'At least 5 potential customers confirm willingness to test.',
      first30DaysSteps: [
        'Day 1-7: Conduct field customer interviews.',
        'Day 8-15: Document unit economics and failure modes.',
        'Day 16-30: Draft prototype blueprint.',
      ],
    },
    potentialBuyers: ['Target SME and consumer segment in Bangladesh'],
    customerAcquisitionChannels: ['Word of mouth', 'Direct merchant outreach'],
    risksAndDependencies: ['Requires user willingness to adopt new method'],
    followerCount: 0,
    solverCount: 0,
    discussionsCount: 0,
  };

  // 1. Save in local/server data-store
  saveProblemRecord(problem);

  // 2. Save in Neon SQL if connected
  const sql = getDb();
  if (sql) {
    try {
      await sql`
        INSERT INTO platform_problems (
          id, slug, title, summary, full_description, sector, location, division,
          affected_customer_type, validation_status, confidence_score_percent,
          opportunity_type, difficulty, estimated_startup_cost_min, estimated_startup_cost_max,
          time_to_first_test, featured, reported_by_name, reported_by_role
        ) VALUES (
          ${problem.id}, ${problem.slug}, ${problem.title}, ${problem.summary},
          ${problem.fullDescription}, ${problem.sector}, ${problem.location}, ${problem.division},
          ${problem.affectedCustomerType}, ${problem.validationStatus}, ${problem.confidenceScorePercent},
          ${problem.opportunityType}, ${problem.difficulty}, ${problem.estimatedStartupCostBDT.min},
          ${problem.estimatedStartupCostBDT.max}, ${problem.timeToFirstTest}, ${problem.featured},
          ${problem.reportedBy.name}, ${problem.reportedBy.role}
        )
      `;
    } catch (err) {
      console.warn('Neon database insert problem error:', err);
    }
  }

  // 3. Log audit action
  await logHermesAction({
    action: 'PROBLEM_CREATED',
    targetType: 'Problem',
    targetId: problem.id,
    details: `Created problem "${problem.title}" (Status: ${problem.validationStatus})`,
  });

  return NextResponse.json(
    {
      success: true,
      message: 'Problem listing created successfully',
      problem,
    },
    { status: 201 }
  );
}
