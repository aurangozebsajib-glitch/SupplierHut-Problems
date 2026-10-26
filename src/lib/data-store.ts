import { 
  Problem, 
  SolutionProposal, 
  DiscussionComment, 
  UserProfile, 
  AuditLogItem, 
  ProblemReport,
  ValidationStatus,
  ProposalStatus,
  Sector
} from '@/types';
import { 
  INITIAL_PROBLEMS, 
  INITIAL_PROPOSALS, 
  INITIAL_COMMENTS, 
  INITIAL_USERS, 
  INITIAL_AUDIT_LOGS, 
  INITIAL_REPORTS 
} from './seed-data';

// Storage keys
const STORAGE_KEYS = {
  PROBLEMS: 'supplierhut_problems_v1',
  PROPOSALS: 'supplierhut_proposals_v1',
  COMMENTS: 'supplierhut_comments_v1',
  CURRENT_USER: 'supplierhut_current_user_v1',
  AUDIT_LOGS: 'supplierhut_audit_logs_v1',
  REPORTS: 'supplierhut_reports_v1',
};

// In-memory memory fallback for SSR / server side
let serverProblems: Problem[] = [...INITIAL_PROBLEMS];
let serverProposals: SolutionProposal[] = [...INITIAL_PROPOSALS];
let serverComments: DiscussionComment[] = [...INITIAL_COMMENTS];
let serverAuditLogs: AuditLogItem[] = [...INITIAL_AUDIT_LOGS];
let serverReports: ProblemReport[] = [...INITIAL_REPORTS];
let serverCurrentUser: UserProfile = INITIAL_USERS[1]; // Default to Solver Tariqul Hasan for testing

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

function getItem<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch (e) {
    console.warn('Storage read failed', e);
    return fallback;
  }
}

function setItem<T>(key: string, value: T): void {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('Storage write failed', e);
  }
}

// ----------------- PROBLEMS -----------------

export function getStoredProblems(): Problem[] {
  if (isBrowser()) {
    const fromStorage = getItem<Problem[] | null>(STORAGE_KEYS.PROBLEMS, null);
    if (fromStorage && Array.isArray(fromStorage) && fromStorage.length > 0) {
      return fromStorage;
    }
    // initialize storage
    setItem(STORAGE_KEYS.PROBLEMS, INITIAL_PROBLEMS);
    return INITIAL_PROBLEMS;
  }
  return serverProblems;
}

export function getProblemBySlug(slug: string): Problem | undefined {
  const problems = getStoredProblems();
  return problems.find(p => p.slug === slug);
}

export function getProblemById(id: string): Problem | undefined {
  const problems = getStoredProblems();
  return problems.find(p => p.id === id);
}

export function saveProblemRecord(problem: Problem): void {
  const current = getStoredProblems();
  const index = current.findIndex(p => p.id === problem.id);
  let updated: Problem[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = problem;
  } else {
    updated = [problem, ...current];
  }
  if (isBrowser()) {
    setItem(STORAGE_KEYS.PROBLEMS, updated);
  } else {
    serverProblems = updated;
  }
}

export function createProblemSubmission(newProblemData: Partial<Problem> & { title: string; summary: string; sector: Sector }): Problem {
  const id = `prob-${Date.now()}`;
  const slug = newProblemData.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '') + `-${Math.floor(Math.random() * 899 + 100)}`;

  const currentUser = getCurrentUser();

  const problem: Problem = {
    id,
    slug,
    title: newProblemData.title,
    summary: newProblemData.summary,
    fullDescription: newProblemData.fullDescription || newProblemData.summary,
    sector: newProblemData.sector,
    location: newProblemData.location || 'All Bangladesh',
    division: newProblemData.division || 'National',
    affectedCustomerType: newProblemData.affectedCustomerType || 'Local businesses and citizens',
    frequency: newProblemData.frequency || 'Regular occurrences',
    existingAlternatives: newProblemData.existingAlternatives || 'Informal ad-hoc approaches',
    whyAlternativesFail: newProblemData.whyAlternativesFail || 'High cost, poor quality or inaccessibility',
    validationStatus: 'Unverified',
    confidenceScorePercent: 40,
    opportunityType: newProblemData.opportunityType || 'Open Problem',
    difficulty: newProblemData.difficulty || 'Moderate',
    estimatedStartupCostBDT: newProblemData.estimatedStartupCostBDT || {
      min: 25000,
      max: 80000,
      displayLabel: '৳25,000 - ৳80,000 BDT (Estimated)'
    },
    skillsRequired: newProblemData.skillsRequired?.length ? newProblemData.skillsRequired : ['Research', 'Product Development'],
    timeToFirstTest: newProblemData.timeToFirstTest || '14 to 30 days',
    featured: false,
    dateReported: new Date().toISOString().split('T')[0],
    updatedAt: new Date().toISOString().split('T')[0],
    reportedBy: {
      name: currentUser.name,
      role: currentUser.role === 'submitter' ? 'Problem Submitter' : currentUser.title,
      organization: currentUser.location
    },
    imageUrl: newProblemData.imageUrl || '/images/hero_bangladesh_innovation_1792999684164.jpg',
    imageAlt: newProblemData.title,
    evidenceSources: newProblemData.evidenceSources || [],
    marketAnalysis: newProblemData.marketAnalysis || {
      targetCustomerProfile: newProblemData.affectedCustomerType || 'Target demographic',
      estimatedTAMBDT: 'Needs Field Validation (Hypothesis)',
      estimatedSAMBDT: 'Needs Divisional Survey',
      marketSizingMethodology: 'Initial submission estimate; requires secondary documentation audit.',
      demandSignals: ['Reported pain point by local community'],
      competitorsAndSubstitutes: ['Existing manual workarounds'],
      currentPricingExamples: ['Unstructured informal payments'],
      marketGaps: ['Affordable local solution tailored to Bangladesh context']
    },
    potentialSolutions: newProblemData.potentialSolutions || [
      {
        id: `sol-${Date.now()}`,
        title: 'Initial Community Solution Hypothesis',
        description: 'Open for multidisciplinary builders and solvers to formulate approaches.',
        techStackOrMethod: 'To be determined by solvers',
        estimatedBuildTime: '3-4 weeks',
        upfrontCostEstimateBDT: '৳30,000 estimated initial test',
        pros: ['Directly addresses user reported friction'],
        cons: ['Requires early customer interviews']
      }
    ],
    businessModels: newProblemData.businessModels || ['Direct Service / Hardware Sale', 'Micro-fee per transaction'],
    validationPlan: newProblemData.validationPlan || {
      interviewQuestions: [
        'How often do you experience this problem each month?',
        'What current workaround do you use, and how much does it cost you?'
      ],
      landingPageExperiment: 'Interview 10 potential customers in the designated location.',
      prototypeMVP: 'Create a minimum prototype or manual concierge test.',
      successCriteria: 'At least 5 potential customers confirm willingness to test.',
      first30DaysSteps: [
        'Day 1-7: Conduct field customer interviews.',
        'Day 8-15: Document unit economics and failure modes.',
        'Day 16-30: Draft prototype blueprint.'
      ]
    },
    potentialBuyers: newProblemData.potentialBuyers || ['Affected community members', 'SMEs in sector'],
    customerAcquisitionChannels: newProblemData.customerAcquisitionChannels || ['Word of mouth', 'Local community groups'],
    risksAndDependencies: newProblemData.risksAndDependencies || ['Requires customer willingness to change habit'],
    paidChallenge: newProblemData.paidChallenge,
    followerCount: 1,
    solverCount: 0,
    discussionsCount: 0
  };

  saveProblemRecord(problem);
  addAuditLog({
    actorEmail: currentUser.email,
    actorRole: currentUser.role,
    action: 'PROBLEM_SUBMITTED',
    targetType: 'Problem',
    targetId: problem.id,
    details: `User submitted "${problem.title}" for admin review (Status: Unverified).`
  });

  return problem;
}

export function updateProblemStatus(
  problemId: string, 
  newStatus: ValidationStatus, 
  confidenceScore?: number,
  notes?: string
): Problem | null {
  const problems = getStoredProblems();
  const problem = problems.find(p => p.id === problemId);
  if (!problem) return null;

  const actor = getCurrentUser();
  problem.validationStatus = newStatus;
  if (confidenceScore !== undefined) {
    problem.confidenceScorePercent = confidenceScore;
  }
  problem.updatedAt = new Date().toISOString().split('T')[0];

  saveProblemRecord(problem);

  addAuditLog({
    actorEmail: actor.email,
    actorRole: actor.role,
    action: 'STATUS_CHANGE',
    targetType: 'Problem',
    targetId: problem.id,
    details: `Status set to ${newStatus}${confidenceScore ? ` (${confidenceScore}%)` : ''}. Notes: ${notes || 'Verified by admin'}`
  });

  return problem;
}

export function deleteProblemRecord(problemId: string): boolean {
  const problems = getStoredProblems();
  const filtered = problems.filter(p => p.id !== problemId);
  if (filtered.length === problems.length) return false;

  const actor = getCurrentUser();
  if (isBrowser()) {
    setItem(STORAGE_KEYS.PROBLEMS, filtered);
  } else {
    serverProblems = filtered;
  }

  addAuditLog({
    actorEmail: actor.email,
    actorRole: actor.role,
    action: 'PROBLEM_DELETED',
    targetType: 'Problem',
    targetId: problemId,
    details: `Problem ${problemId} deleted from database.`
  });

  return true;
}

// ----------------- PROPOSALS -----------------

export function getStoredProposals(): SolutionProposal[] {
  if (isBrowser()) {
    const fromStorage = getItem<SolutionProposal[] | null>(STORAGE_KEYS.PROPOSALS, null);
    if (fromStorage && Array.isArray(fromStorage) && fromStorage.length > 0) {
      return fromStorage;
    }
    setItem(STORAGE_KEYS.PROPOSALS, INITIAL_PROPOSALS);
    return INITIAL_PROPOSALS;
  }
  return serverProposals;
}

export function submitProposalRecord(data: {
  problemId: string;
  problemTitle: string;
  title: string;
  approach: string;
  techStack: string;
  estimatedDays: number;
  requestedBudgetBDT?: number;
}): SolutionProposal {
  const currentUser = getCurrentUser();
  const proposal: SolutionProposal = {
    id: `prop-${Date.now()}`,
    problemId: data.problemId,
    problemTitle: data.problemTitle,
    solverId: currentUser.id,
    solverName: currentUser.name,
    solverEmail: currentUser.email,
    solverSkills: currentUser.skills,
    title: data.title,
    approach: data.approach,
    techStack: data.techStack,
    estimatedDays: data.estimatedDays,
    requestedBudgetBDT: data.requestedBudgetBDT,
    status: 'Submitted',
    submittedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const current = getStoredProposals();
  const updated = [proposal, ...current];
  if (isBrowser()) {
    setItem(STORAGE_KEYS.PROPOSALS, updated);
  } else {
    serverProposals = updated;
  }

  // increment solver count on problem
  const problem = getProblemById(data.problemId);
  if (problem) {
    problem.solverCount = (problem.solverCount || 0) + 1;
    saveProblemRecord(problem);
  }

  addAuditLog({
    actorEmail: currentUser.email,
    actorRole: currentUser.role,
    action: 'PROPOSAL_SUBMITTED',
    targetType: 'Proposal',
    targetId: proposal.id,
    details: `Proposal "${proposal.title}" submitted by ${currentUser.name} for ${data.problemTitle}.`
  });

  return proposal;
}

export function updateProposalStatusRecord(
  proposalId: string, 
  status: ProposalStatus, 
  reviewerNotes?: string
): SolutionProposal | null {
  const proposals = getStoredProposals();
  const proposal = proposals.find(p => p.id === proposalId);
  if (!proposal) return null;

  const actor = getCurrentUser();
  proposal.status = status;
  proposal.updatedAt = new Date().toISOString();
  if (reviewerNotes) {
    proposal.reviewerNotes = reviewerNotes;
  }

  if (isBrowser()) {
    setItem(STORAGE_KEYS.PROPOSALS, proposals);
  } else {
    serverProposals = proposals;
  }

  addAuditLog({
    actorEmail: actor.email,
    actorRole: actor.role,
    action: 'PROPOSAL_STATUS_UPDATE',
    targetType: 'Proposal',
    targetId: proposal.id,
    details: `Proposal status changed to ${status}. Note: ${reviewerNotes || 'Reviewed'}`
  });

  return proposal;
}

// ----------------- COMMENTS & DISCUSSIONS -----------------

export function getStoredComments(problemId?: string): DiscussionComment[] {
  let all: DiscussionComment[] = [];
  if (isBrowser()) {
    const fromStorage = getItem<DiscussionComment[] | null>(STORAGE_KEYS.COMMENTS, null);
    if (fromStorage && Array.isArray(fromStorage) && fromStorage.length > 0) {
      all = fromStorage;
    } else {
      setItem(STORAGE_KEYS.COMMENTS, INITIAL_COMMENTS);
      all = INITIAL_COMMENTS;
    }
  } else {
    all = serverComments;
  }

  if (problemId) {
    return all.filter(c => c.problemId === problemId);
  }
  return all;
}

export function addCommentRecord(problemId: string, text: string): DiscussionComment {
  const currentUser = getCurrentUser();
  const comment: DiscussionComment = {
    id: `comm-${Date.now()}`,
    problemId,
    authorName: currentUser.name,
    authorEmail: currentUser.email,
    authorRole: currentUser.role,
    comment: text,
    createdAt: new Date().toISOString()
  };

  const all = getStoredComments();
  const updated = [comment, ...all];
  if (isBrowser()) {
    setItem(STORAGE_KEYS.COMMENTS, updated);
  } else {
    serverComments = updated;
  }

  const prob = getProblemById(problemId);
  if (prob) {
    prob.discussionsCount = (prob.discussionsCount || 0) + 1;
    saveProblemRecord(prob);
  }

  return comment;
}

// ----------------- AUDIT LOGS -----------------

export function getStoredAuditLogs(): AuditLogItem[] {
  if (isBrowser()) {
    const fromStorage = getItem<AuditLogItem[] | null>(STORAGE_KEYS.AUDIT_LOGS, null);
    if (fromStorage && Array.isArray(fromStorage) && fromStorage.length > 0) {
      return fromStorage;
    }
    setItem(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
    return INITIAL_AUDIT_LOGS;
  }
  return serverAuditLogs;
}

export function addAuditLog(entry: Omit<AuditLogItem, 'id' | 'timestamp'>): AuditLogItem {
  const log: AuditLogItem = {
    id: `audit-${Date.now()}-${Math.floor(Math.random() * 999)}`,
    timestamp: new Date().toISOString(),
    ...entry
  };

  const current = getStoredAuditLogs();
  const updated = [log, ...current];
  if (isBrowser()) {
    setItem(STORAGE_KEYS.AUDIT_LOGS, updated);
  } else {
    serverAuditLogs = updated;
  }
  return log;
}

// ----------------- REPORTS & MODERATION -----------------

export function getStoredReports(): ProblemReport[] {
  if (isBrowser()) {
    const fromStorage = getItem<ProblemReport[] | null>(STORAGE_KEYS.REPORTS, null);
    if (fromStorage && Array.isArray(fromStorage) && fromStorage.length > 0) {
      return fromStorage;
    }
    setItem(STORAGE_KEYS.REPORTS, INITIAL_REPORTS);
    return INITIAL_REPORTS;
  }
  return serverReports;
}

export function submitProblemReport(
  problemId: string, 
  problemTitle: string, 
  reason: ProblemReport['reason'], 
  details: string
): ProblemReport {
  const currentUser = getCurrentUser();
  const report: ProblemReport = {
    id: `rep-${Date.now()}`,
    problemId,
    problemTitle,
    reporterEmail: currentUser.email,
    reason,
    details,
    createdAt: new Date().toISOString(),
    status: 'Open'
  };

  const current = getStoredReports();
  const updated = [report, ...current];
  if (isBrowser()) {
    setItem(STORAGE_KEYS.REPORTS, updated);
  } else {
    serverReports = updated;
  }

  addAuditLog({
    actorEmail: currentUser.email,
    actorRole: currentUser.role,
    action: 'REPORT_FILED',
    targetType: 'Report',
    targetId: report.id,
    details: `Flagged problem "${problemTitle}" for ${reason}.`
  });

  return report;
}

export function updateReportStatusRecord(reportId: string, status: ProblemReport['status']): boolean {
  const reports = getStoredReports();
  const report = reports.find(r => r.id === reportId);
  if (!report) return false;

  report.status = status;
  if (isBrowser()) {
    setItem(STORAGE_KEYS.REPORTS, reports);
  } else {
    serverReports = reports;
  }
  return true;
}

// ----------------- USERS & AUTH ROLES -----------------

export function getAllUsers(): UserProfile[] {
  return INITIAL_USERS;
}

export function getCurrentUser(): UserProfile {
  if (isBrowser()) {
    const stored = getItem<UserProfile | null>(STORAGE_KEYS.CURRENT_USER, null);
    if (stored) return stored;
    setItem(STORAGE_KEYS.CURRENT_USER, INITIAL_USERS[1]); // Tariqul Hasan (Solver)
    return INITIAL_USERS[1];
  }
  return serverCurrentUser;
}

export function setCurrentUser(user: UserProfile): void {
  if (isBrowser()) {
    setItem(STORAGE_KEYS.CURRENT_USER, user);
    window.dispatchEvent(new CustomEvent('supplierhut_auth_changed', { detail: user }));
  } else {
    serverCurrentUser = user;
  }
}

export function toggleSaveProblem(problemId: string): boolean {
  const user = getCurrentUser();
  const isSaved = user.savedProblemIds.includes(problemId);
  if (isSaved) {
    user.savedProblemIds = user.savedProblemIds.filter(id => id !== problemId);
  } else {
    user.savedProblemIds.push(problemId);
  }
  setCurrentUser(user);
  return !isSaved;
}
