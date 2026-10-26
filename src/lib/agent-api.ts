import { getStoredProblems } from '@/lib/data-store';
import { getDb, isDatabaseConfigured } from '@/lib/db';
import { OpportunityType, Problem, Sector, ValidationStatus } from '@/types';

export const AGENT_SECTORS: readonly Sector[] = [
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

export const AGENT_ALLOWED_STATUSES = [
  'Evidence Supported',
  'Validated',
] as const satisfies readonly ValidationStatus[];

export const AGENT_DIVISIONS = [
  'Dhaka',
  'Chittagong',
  'Rajshahi',
  'Khulna',
  'Sylhet',
  'Barishal',
  'Rangpur',
  'Mymensingh',
  'National',
] as const;

export const AGENT_OPPORTUNITY_TYPES: readonly OpportunityType[] = [
  'Open Problem',
  'Paid Challenge',
  'Client Request',
  'Collaboration',
  'Marketplace',
];

export interface AgentProblem {
  id: string;
  slug: string;
  title: string;
  summary: string;
  fullDescription: string | null;
  sector: string;
  location: string;
  division: string | null;
  affectedCustomerType: string | null;
  validationStatus: string | null;
  confidenceScorePercent: number | null;
  opportunityType: string | null;
  difficulty: string | null;
  estimatedStartupCostBDT: { min: number; max: number };
  timeToFirstTest: string | null;
  featured: boolean;
  dateReported: string | null;
  updatedAt: string | null;
}

export interface ProblemFilters {
  q?: string;
  sector?: Sector;
  status?: (typeof AGENT_ALLOWED_STATUSES)[number];
  division?: (typeof AGENT_DIVISIONS)[number];
  opportunityType?: OpportunityType;
  limit: number;
  offset: number;
}

interface ProblemRow {
  id: unknown;
  slug: unknown;
  title: unknown;
  summary: unknown;
  full_description: unknown;
  sector: unknown;
  location: unknown;
  division: unknown;
  affected_customer_type: unknown;
  validation_status: unknown;
  confidence_score_percent: unknown;
  opportunity_type: unknown;
  difficulty: unknown;
  estimated_startup_cost_min: unknown;
  estimated_startup_cost_max: unknown;
  time_to_first_test: unknown;
  featured: unknown;
  created_at: unknown;
  updated_at: unknown;
}

interface CountRow {
  total: unknown;
}

interface StatusCountRow {
  status: unknown;
  count: unknown;
}

function isOneOf<T extends string>(value: string, values: readonly T[]): value is T {
  return values.some((candidate) => candidate === value);
}

function parseInteger(value: string | null, fallback: number): number | null {
  if (value === null) return fallback;
  if (!/^(0|[1-9]\d*)$/.test(value)) return null;
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) ? parsed : null;
}

export function parseProblemFilters(params: URLSearchParams):
  | { filters: ProblemFilters }
  | { error: string } {
  const supportedNames = new Set([
    'q',
    'sector',
    'status',
    'division',
    'opportunityType',
    'limit',
    'offset',
  ]);
  for (const name of params.keys()) {
    if (!supportedNames.has(name)) return { error: 'Unsupported query parameter.' };
  }

  for (const name of ['q', 'sector', 'status', 'division', 'opportunityType', 'limit', 'offset']) {
    if (params.getAll(name).length > 1) return { error: `Provide only one "${name}" value.` };
  }

  const q = params.get('q')?.trim();
  if (q && q.length > 100) return { error: 'Search query must be 100 characters or fewer.' };

  const sector = params.get('sector');
  const selectedSector = sector && isOneOf(sector, AGENT_SECTORS) ? sector : undefined;
  if (sector && !selectedSector) return { error: 'Invalid sector.' };

  const status = params.get('status');
  const selectedStatus =
    status && isOneOf(status, AGENT_ALLOWED_STATUSES) ? status : undefined;
  if (status && !selectedStatus) {
    return { error: 'Status is not available through this API.' };
  }

  const division = params.get('division');
  const selectedDivision = division && isOneOf(division, AGENT_DIVISIONS) ? division : undefined;
  if (division && !selectedDivision) return { error: 'Invalid division.' };

  const opportunityType = params.get('opportunityType');
  const selectedOpportunityType =
    opportunityType && isOneOf(opportunityType, AGENT_OPPORTUNITY_TYPES) ? opportunityType : undefined;
  if (opportunityType && !selectedOpportunityType) {
    return { error: 'Invalid opportunity type.' };
  }

  const limit = parseInteger(params.get('limit'), 20);
  if (limit === null || limit < 1 || limit > 100) {
    return { error: 'Limit must be an integer between 1 and 100.' };
  }

  const offset = parseInteger(params.get('offset'), 0);
  if (offset === null || offset > 100_000) {
    return { error: 'Offset must be an integer between 0 and 100000.' };
  }

  return {
    filters: {
      ...(q ? { q } : {}),
      ...(selectedSector ? { sector: selectedSector } : {}),
      ...(selectedStatus ? { status: selectedStatus } : {}),
      ...(selectedDivision ? { division: selectedDivision } : {}),
      ...(selectedOpportunityType ? { opportunityType: selectedOpportunityType } : {}),
      limit,
      offset,
    },
  };
}

export function isValidProblemId(id: string): boolean {
  return /^[A-Za-z0-9][A-Za-z0-9_-]{0,127}$/.test(id);
}

function boundedString(value: unknown, maxLength: number): string {
  return typeof value === 'string' ? value.slice(0, maxLength) : '';
}

function boundedOptionalString(value: unknown, maxLength: number): string | null {
  const result = boundedString(value, maxLength);
  return result.length > 0 ? result : null;
}

function optionalNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim() !== '') {
    const number = Number(value);
    return Number.isFinite(number) ? number : null;
  }
  return null;
}

function toDateString(value: unknown): string | null {
  if (typeof value !== 'string' && !(value instanceof Date)) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function toAgentProblem(problem: Problem): AgentProblem {
  return {
    id: boundedString(problem.id, 128),
    slug: boundedString(problem.slug, 128),
    title: boundedString(problem.title, 200),
    summary: boundedString(problem.summary, 2_000),
    fullDescription: boundedOptionalString(problem.fullDescription, 5_000),
    sector: boundedString(problem.sector, 100),
    location: boundedString(problem.location, 200),
    division: boundedOptionalString(problem.division, 100),
    affectedCustomerType: boundedOptionalString(problem.affectedCustomerType, 500),
    validationStatus: boundedOptionalString(problem.validationStatus, 64),
    confidenceScorePercent: problem.confidenceScorePercent,
    opportunityType: boundedOptionalString(problem.opportunityType, 64),
    difficulty: boundedOptionalString(problem.difficulty, 100),
    estimatedStartupCostBDT: {
      min: problem.estimatedStartupCostBDT.min,
      max: problem.estimatedStartupCostBDT.max,
    },
    timeToFirstTest: boundedOptionalString(problem.timeToFirstTest, 200),
    featured: problem.featured,
    dateReported: problem.dateReported || null,
    updatedAt: problem.updatedAt || null,
  };
}

function rowToAgentProblem(row: ProblemRow): AgentProblem {
  return {
    id: boundedString(row.id, 128),
    slug: boundedString(row.slug, 128),
    title: boundedString(row.title, 200),
    summary: boundedString(row.summary, 2_000),
    fullDescription: boundedOptionalString(row.full_description, 5_000),
    sector: boundedString(row.sector, 100),
    location: boundedString(row.location, 200),
    division: boundedOptionalString(row.division, 100),
    affectedCustomerType: boundedOptionalString(row.affected_customer_type, 500),
    validationStatus: boundedOptionalString(row.validation_status, 64),
    confidenceScorePercent: optionalNumber(row.confidence_score_percent),
    opportunityType: boundedOptionalString(row.opportunity_type, 64),
    difficulty: boundedOptionalString(row.difficulty, 100),
    estimatedStartupCostBDT: {
      min: optionalNumber(row.estimated_startup_cost_min) ?? 0,
      max: optionalNumber(row.estimated_startup_cost_max) ?? 0,
    },
    timeToFirstTest: boundedOptionalString(row.time_to_first_test, 200),
    featured: row.featured === true,
    dateReported: toDateString(row.created_at),
    updatedAt: toDateString(row.updated_at),
  };
}

function matchesFilters(problem: Problem, filters: ProblemFilters): boolean {
  const query = filters.q?.toLocaleLowerCase();
  return (
    isOneOf(problem.validationStatus, AGENT_ALLOWED_STATUSES) &&
    (!query ||
      problem.title.toLocaleLowerCase().includes(query) ||
      problem.summary.toLocaleLowerCase().includes(query) ||
      problem.location.toLocaleLowerCase().includes(query)) &&
    (!filters.sector || problem.sector === filters.sector) &&
    (!filters.status || problem.validationStatus === filters.status) &&
    (!filters.division || problem.division === filters.division) &&
    (!filters.opportunityType || problem.opportunityType === filters.opportunityType)
  );
}

function getConfiguredDb() {
  if (!isDatabaseConfigured()) return null;
  const sql = getDb();
  if (!sql) throw new Error('Database client unavailable.');
  return sql;
}

export async function listAgentProblems(filters: ProblemFilters): Promise<{
  total: number;
  limit: number;
  offset: number;
  problems: AgentProblem[];
}> {
  const sql = getConfiguredDb();
  if (sql) {
    const totalRows = (await sql`
      SELECT count(*)::int AS total
      FROM platform_problems
      WHERE (${filters.q ?? null}::text IS NULL
        OR title ILIKE ${filters.q ? `%${filters.q}%` : null}
        OR summary ILIKE ${filters.q ? `%${filters.q}%` : null}
        OR location ILIKE ${filters.q ? `%${filters.q}%` : null})
        AND validation_status IN ('Evidence Supported', 'Validated')
        AND (${filters.sector ?? null}::text IS NULL OR sector = ${filters.sector ?? null})
        AND (${filters.status ?? null}::text IS NULL OR validation_status = ${filters.status ?? null})
        AND (${filters.division ?? null}::text IS NULL OR division = ${filters.division ?? null})
        AND (${filters.opportunityType ?? null}::text IS NULL OR opportunity_type = ${filters.opportunityType ?? null})
    `) as unknown as CountRow[];
    const rows = (await sql`
      SELECT id, slug, title, summary, full_description, sector, location, division,
        affected_customer_type, validation_status, confidence_score_percent,
        opportunity_type, difficulty, estimated_startup_cost_min,
        estimated_startup_cost_max, time_to_first_test, featured, created_at, updated_at
      FROM platform_problems
      WHERE (${filters.q ?? null}::text IS NULL
        OR title ILIKE ${filters.q ? `%${filters.q}%` : null}
        OR summary ILIKE ${filters.q ? `%${filters.q}%` : null}
        OR location ILIKE ${filters.q ? `%${filters.q}%` : null})
        AND validation_status IN ('Evidence Supported', 'Validated')
        AND (${filters.sector ?? null}::text IS NULL OR sector = ${filters.sector ?? null})
        AND (${filters.status ?? null}::text IS NULL OR validation_status = ${filters.status ?? null})
        AND (${filters.division ?? null}::text IS NULL OR division = ${filters.division ?? null})
        AND (${filters.opportunityType ?? null}::text IS NULL OR opportunity_type = ${filters.opportunityType ?? null})
      ORDER BY created_at DESC, id ASC
      LIMIT ${filters.limit} OFFSET ${filters.offset}
    `) as unknown as ProblemRow[];

    return {
      total: optionalNumber(totalRows[0]?.total) ?? 0,
      limit: filters.limit,
      offset: filters.offset,
      problems: rows.map(rowToAgentProblem),
    };
  }

  const matches = getStoredProblems().filter((problem) => matchesFilters(problem, filters));
  return {
    total: matches.length,
    limit: filters.limit,
    offset: filters.offset,
    problems: matches.slice(filters.offset, filters.offset + filters.limit).map(toAgentProblem),
  };
}

export async function getAgentProblem(id: string): Promise<AgentProblem | null> {
  const sql = getConfiguredDb();
  if (sql) {
    const rows = (await sql`
      SELECT id, slug, title, summary, full_description, sector, location, division,
        affected_customer_type, validation_status, confidence_score_percent,
        opportunity_type, difficulty, estimated_startup_cost_min,
        estimated_startup_cost_max, time_to_first_test, featured, created_at, updated_at
      FROM platform_problems
      WHERE (id = ${id} OR slug = ${id})
        AND validation_status IN ('Evidence Supported', 'Validated')
      ORDER BY CASE WHEN id = ${id} THEN 0 ELSE 1 END
      LIMIT 1
    `) as unknown as ProblemRow[];
    return rows[0] ? rowToAgentProblem(rows[0]) : null;
  }

  const problem = getStoredProblems().find(
    (record) =>
      (record.id === id || record.slug === id) &&
      isOneOf(record.validationStatus, AGENT_ALLOWED_STATUSES)
  );
  return problem ? toAgentProblem(problem) : null;
}

export async function getAgentAnalytics(): Promise<{
  total: number;
  by_validation_status: Record<string, number>;
}> {
  const sql = getConfiguredDb();
  if (sql) {
    const rows = (await sql`
      SELECT validation_status AS status,
        count(*)::int AS count
      FROM platform_problems
      WHERE validation_status IN ('Evidence Supported', 'Validated')
      GROUP BY validation_status
      ORDER BY status
    `) as unknown as StatusCountRow[];

    const byValidationStatus: Record<string, number> = {
      'Evidence Supported': 0,
      Validated: 0,
    };
    for (const row of rows) {
      const status = String(row.status);
      if (isOneOf(status, AGENT_ALLOWED_STATUSES)) {
        byValidationStatus[status] = optionalNumber(row.count) ?? 0;
      }
    }
    return {
      total: Object.values(byValidationStatus).reduce((total, count) => total + count, 0),
      by_validation_status: byValidationStatus,
    };
  }

  const byValidationStatus: Record<string, number> = {
    'Evidence Supported': 0,
    Validated: 0,
  };
  for (const problem of getStoredProblems()) {
    if (isOneOf(problem.validationStatus, AGENT_ALLOWED_STATUSES)) {
      byValidationStatus[problem.validationStatus] += 1;
    }
  }
  return {
    total: Object.values(byValidationStatus).reduce((total, count) => total + count, 0),
    by_validation_status: byValidationStatus,
  };
}
