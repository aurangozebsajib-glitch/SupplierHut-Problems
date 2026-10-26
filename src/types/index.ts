export type Role = 'visitor' | 'submitter' | 'solver' | 'organization' | 'admin';

export type ValidationStatus = 
  | 'Unverified' 
  | 'Researching' 
  | 'Evidence Supported' 
  | 'Validated' 
  | 'Archived';

export type Sector = 
  | 'Agriculture' 
  | 'Education' 
  | 'Healthcare' 
  | 'Logistics' 
  | 'Retail & SMEs' 
  | 'Technology' 
  | 'Environment' 
  | 'Employment' 
  | 'Finance' 
  | 'Public Services' 
  | 'Other';

export type OpportunityType = 
  | 'Open Problem' 
  | 'Paid Challenge' 
  | 'Client Request' 
  | 'Collaboration' 
  | 'Marketplace';

export type DifficultyLevel = 
  | 'Low-Cost / Fast Entry' 
  | 'Moderate' 
  | 'High Technical' 
  | 'Systemic / Capital Intensive';

export type ProposalStatus = 
  | 'Draft' 
  | 'Submitted' 
  | 'Under Review' 
  | 'Shortlisted' 
  | 'Accepted' 
  | 'Rejected' 
  | 'Completed';

export interface EvidenceSource {
  title: string;
  url?: string;
  sourceDate: string;
  sourceType: 'Field Interview' | 'Government Report' | 'Academic Study' | 'Industry Survey' | 'NGO Audit';
  summary: string;
  verified: boolean;
}

export interface MarketAnalysis {
  targetCustomerProfile: string;
  estimatedTAMBDT: string; // e.g., "৳450M - ৳600M Annual"
  estimatedSAMBDT: string; // e.g., "৳85M in Division"
  marketSizingMethodology: string; // Documented logic to avoid fabrication
  demandSignals: string[];
  competitorsAndSubstitutes: string[];
  currentPricingExamples: string[];
  marketGaps: string[];
}

export interface SolutionIdea {
  id: string;
  title: string;
  description: string;
  techStackOrMethod: string;
  estimatedBuildTime: string;
  upfrontCostEstimateBDT: string;
  pros: string[];
  cons: string[];
}

export interface ValidationPlan {
  interviewQuestions: string[];
  landingPageExperiment: string;
  prototypeMVP: string;
  successCriteria: string;
  first30DaysSteps: string[];
}

export interface PaidChallengeInfo {
  challengeId: string;
  sponsorOrganization: string;
  sponsorWebsite?: string;
  isVerifiedSponsor: boolean;
  fundingConfirmedBDT: number;
  currency: string;
  applicationDeadline: string; // YYYY-MM-DD
  deliverables: string[];
  selectionCriteria: string[];
  milestones: {
    milestoneName: string;
    percentage: number;
    amountBDT: number;
  }[];
  intellectualPropertyTerms: string;
  escrowStatusNote: string;
  openPositionsOrSlots: number;
  applicationsCount: number;
}

export interface Problem {
  id: string;
  slug: string;
  title: string;
  summary: string;
  fullDescription: string;
  sector: Sector;
  location: string; // e.g., "Bogura, Rajshahi Division" or "All Bangladesh"
  division: 'Dhaka' | 'Chittagong' | 'Rajshahi' | 'Khulna' | 'Sylhet' | 'Barishal' | 'Rangpur' | 'Mymensingh' | 'National';
  affectedCustomerType: string;
  frequency: string;
  existingAlternatives: string;
  whyAlternativesFail: string;
  validationStatus: ValidationStatus;
  confidenceScorePercent: number;
  opportunityType: OpportunityType;
  difficulty: DifficultyLevel;
  estimatedStartupCostBDT: {
    min: number;
    max: number;
    displayLabel: string;
  };
  skillsRequired: string[];
  timeToFirstTest: string;
  featured: boolean;
  dateReported: string; // ISO date
  updatedAt: string;
  reportedBy: {
    name: string;
    role: string;
    organization?: string;
  };
  imageUrl: string;
  imageAlt: string;
  evidenceSources: EvidenceSource[];
  marketAnalysis: MarketAnalysis;
  potentialSolutions: SolutionIdea[];
  businessModels: string[];
  validationPlan: ValidationPlan;
  potentialBuyers: string[];
  customerAcquisitionChannels: string[];
  risksAndDependencies: string[];
  paidChallenge?: PaidChallengeInfo;
  followerCount: number;
  solverCount: number;
  discussionsCount: number;
}

export interface SolutionProposal {
  id: string;
  problemId: string;
  problemTitle: string;
  solverId: string;
  solverName: string;
  solverEmail: string;
  solverSkills: string[];
  title: string;
  approach: string;
  techStack: string;
  estimatedDays: number;
  requestedBudgetBDT?: number;
  status: ProposalStatus;
  submittedAt: string;
  updatedAt: string;
  reviewerNotes?: string;
}

export interface DiscussionComment {
  id: string;
  problemId: string;
  authorName: string;
  authorEmail: string;
  authorRole: Role;
  comment: string;
  createdAt: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: Role;
  title: string;
  location: string;
  bio: string;
  skills: string[];
  preferredSectors: Sector[];
  portfolioUrl?: string;
  githubUrl?: string;
  savedProblemIds: string[];
  followedChallengeIds: string[];
}

export interface AuditLogItem {
  id: string;
  timestamp: string; // ISO string
  actorEmail: string;
  actorRole: string;
  action: string;
  targetType: 'Problem' | 'Challenge' | 'Proposal' | 'Evidence' | 'User' | 'Report';
  targetId: string;
  details: string;
}

export interface ProblemReport {
  id: string;
  problemId: string;
  problemTitle: string;
  reporterEmail: string;
  reason: 'Misleading Data' | 'Inappropriate Content' | 'Commercial Spam' | 'Duplicate Problem' | 'Copyright Violation' | 'Other';
  details: string;
  createdAt: string;
  status: 'Open' | 'Reviewed' | 'Resolved' | 'Dismissed';
}
