'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Problem, DiscussionComment, UserProfile } from '@/types';
import { 
  toggleSaveProblem, 
  getCurrentUser, 
  getStoredComments, 
  addCommentRecord, 
  submitProposalRecord,
  submitProblemReport
} from '@/lib/data-store';
import ProblemCard from '@/components/ProblemCard';
import { 
  Bookmark, 
  CheckCircle2, 
  Calendar, 
  MapPin, 
  ExternalLink, 
  Sparkles, 
  Send, 
  Flag, 
  ArrowLeft
} from 'lucide-react';

type DetailTab = 'overview' | 'evidence' | 'market' | 'solutions' | 'validation' | 'proposals' | 'discussion';

interface ProblemDetailClientProps {
  problem: Problem;
  relatedProblems: Problem[];
}

export default function ProblemDetailClient({ problem, relatedProblems }: ProblemDetailClientProps) {
  const [activeTab, setActiveTab] = useState<DetailTab>('overview');
  const [isSaved, setIsSaved] = useState<boolean>(() => {
    const user = getCurrentUser();
    return user.savedProblemIds?.includes(problem.id) || false;
  });
  const [comments, setComments] = useState<DiscussionComment[]>(() => getStoredComments(problem.id));
  const [newComment, setNewComment] = useState('');
  
  // Proposal Form State
  const [proposalTitle, setProposalTitle] = useState('');
  const [proposalApproach, setProposalApproach] = useState('');
  const [proposalTech, setProposalTech] = useState('');
  const [proposalDays, setProposalDays] = useState(30);
  const [proposalBudget, setProposalBudget] = useState<number | undefined>(undefined);
  const [proposalSuccess, setProposalSuccess] = useState(false);

  // Report Modal
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState<'Misleading Data' | 'Inappropriate Content' | 'Commercial Spam' | 'Duplicate Problem'>('Misleading Data');
  const [reportDetails, setReportDetails] = useState('');
  const [reportSuccess, setReportSuccess] = useState(false);

  useEffect(() => {
    const handleAuth = (e: Event) => {
      const customEvent = e as CustomEvent<UserProfile>;
      if (customEvent.detail) {
        setIsSaved(customEvent.detail.savedProblemIds?.includes(problem.id) || false);
      }
    };
    window.addEventListener('supplierhut_auth_changed', handleAuth);
    return () => window.removeEventListener('supplierhut_auth_changed', handleAuth);
  }, [problem.id]);

  const handleSaveToggle = () => {
    const newState = toggleSaveProblem(problem.id);
    setIsSaved(newState);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    const added = addCommentRecord(problem.id, newComment);
    setComments([added, ...comments]);
    setNewComment('');
  };

  const handleProposalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proposalTitle || !proposalApproach) return;

    submitProposalRecord({
      problemId: problem.id,
      problemTitle: problem.title,
      title: proposalTitle,
      approach: proposalApproach,
      techStack: proposalTech,
      estimatedDays: Number(proposalDays),
      requestedBudgetBDT: proposalBudget ? Number(proposalBudget) : undefined
    });

    setProposalSuccess(true);
    setTimeout(() => {
      setProposalSuccess(false);
      setProposalTitle('');
      setProposalApproach('');
      setProposalTech('');
    }, 4000);
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportDetails.trim()) return;

    submitProblemReport(problem.id, problem.title, reportReason, reportDetails);
    setReportSuccess(true);
    setTimeout(() => {
      setReportSuccess(false);
      setShowReportModal(false);
      setReportDetails('');
    }, 2500);
  };

  const isPaidChallenge = problem.opportunityType === 'Paid Challenge' && problem.paidChallenge;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Back button */}
      <div className="mb-6">
        <Link
          href="/#problems"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Problem Directory
        </Link>
      </div>

      {/* Main Grid: Content Left, Action Sidebar Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (8 cols): Title, Visual, Tabs, Detailed Analysis */}
        <div className="lg:col-span-8 space-y-6">
          {/* Header Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500 mb-3">
              <span className="bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded font-bold uppercase tracking-wider">
                {problem.sector}
              </span>
              <span aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1 text-slate-700">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {problem.location}
              </span>
              <span aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1 text-slate-500">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Reported {problem.dateReported}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-950 tracking-tight leading-tight mb-4">
              {problem.title}
            </h1>

            <p className="text-sm sm:text-base text-slate-700 leading-relaxed mb-6 font-medium">
              {problem.summary}
            </p>

            {/* Validation & Verification Badge Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900">Validation Status:</span>
                <span className={`font-bold px-2.5 py-1 rounded-md ${
                  problem.validationStatus === 'Validated' 
                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' 
                    : problem.validationStatus === 'Evidence Supported'
                    ? 'bg-blue-100 text-blue-900 border border-blue-300'
                    : 'bg-amber-100 text-amber-900 border border-amber-300'
                }`}>
                  {problem.validationStatus} ({problem.confidenceScorePercent}% Confidence)
                </span>
              </div>

              <div className="flex items-center gap-3 text-slate-500">
                <span>Solvers: <strong className="text-slate-900">{problem.solverCount}</strong></span>
                <span>Discussions: <strong className="text-slate-900">{problem.discussionsCount}</strong></span>
              </div>
            </div>
          </div>

          {/* Context Photo */}
          {problem.imageUrl && (
            <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shadow-xs">
              <Image
                src={problem.imageUrl}
                alt={problem.imageAlt || problem.title}
                fill
                className="object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-slate-950/80 to-transparent text-[11px] text-white">
                Photo Context: {problem.imageAlt}
              </div>
            </div>
          )}

          {/* Tab Navigation */}
          <div className="bg-white rounded-xl border border-slate-200 p-1.5 shadow-2xs">
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-none text-xs font-semibold">
              {(
                [
                  { id: 'overview', label: 'Overview & Friction' },
                  { id: 'evidence', label: `Evidence (${problem.evidenceSources.length})` },
                  { id: 'market', label: 'Market Viability (TAM)' },
                  { id: 'solutions', label: 'Solutions & Costs' },
                  { id: 'validation', label: '30-Day Validation Plan' },
                  { id: 'proposals', label: isPaidChallenge ? 'Paid Challenge & Proposals' : 'Submit Proposal' },
                  { id: 'discussion', label: `Discussion (${comments.length})` }
                ] as { id: DetailTab; label: string }[]
              ).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-2 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-amber-400 text-slate-950 font-bold shadow-2xs'
                      : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content Display */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            {/* 1. Overview */}
            {activeTab === 'overview' && (
              <div className="space-y-6 text-sm text-slate-700 leading-relaxed">
                <div>
                  <h3 className="text-base font-bold text-slate-950 mb-2">Detailed Problem Narrative</h3>
                  <p className="whitespace-pre-line">{problem.fullDescription}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">Who Experiences This Problem?</h4>
                    <p className="text-xs text-slate-600">{problem.affectedCustomerType}</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">Frequency of Occurrence</h4>
                    <p className="text-xs text-slate-600">{problem.frequency}</p>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">Existing Alternatives in Bangladesh</h4>
                    <p className="text-xs text-slate-600">{problem.existingAlternatives}</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-rose-900 mb-1">Why Current Alternatives Fail</h4>
                    <p className="text-xs text-slate-600 bg-rose-50/70 p-3.5 rounded-xl border border-rose-200">
                      {problem.whyAlternativesFail}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <div>Reported By: <strong className="text-slate-800">{problem.reportedBy.name}</strong> ({problem.reportedBy.role})</div>
                  <div>Organization: <strong className="text-slate-800">{problem.reportedBy.organization || 'Independent Field Research'}</strong></div>
                </div>
              </div>
            )}

            {/* 2. Evidence Sources */}
            {activeTab === 'evidence' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-slate-950 mb-1">Documented Field Evidence & Citations</h3>
                  <p className="text-xs text-slate-500">
                    We strictly forbid fabricated statistics. Every claim listed here is tied to a verifiable survey, government publication, or field interview.
                  </p>
                </div>

                <div className="space-y-4">
                  {problem.evidenceSources.map((source, index) => (
                    <div key={index} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                      <div className="flex items-center justify-between gap-2 text-xs">
                        <span className="font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded text-[11px]">
                          {source.sourceType}
                        </span>
                        <span className="text-slate-500">Recorded: {source.sourceDate}</span>
                      </div>

                      <h4 className="text-sm font-bold text-slate-950">{source.title}</h4>
                      <p className="text-xs text-slate-700 leading-relaxed">{source.summary}</p>

                      {source.url && (
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 pt-1"
                        >
                          <span>Review External Source / Report</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>

                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-normal">
                  <span className="font-bold">Notice to Researchers:</span> Found an inaccuracy or have additional field interview data to attach to this record? Submit an update through the Community Discussion or file an evidence revision.
                </div>
              </div>
            )}

            {/* 3. Market Analysis & TAM */}
            {activeTab === 'market' && (
              <div className="space-y-6 text-sm">
                <div>
                  <h3 className="text-base font-bold text-slate-950 mb-1">Market Viability & Sizing in Bangladesh</h3>
                  <p className="text-xs text-slate-500">
                    TAM (Total Addressable Market) and SAM (Serviceable Addressable Market) calculations are based on transparent, defensible secondary metrics in BDT (৳).
                  </p>
                </div>

                {/* TAM / SAM Stat Boxes */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-xs text-slate-500 font-medium block">Estimated TAM (Total Addressable)</span>
                    <span className="text-xl font-black text-slate-950 tabular-nums">
                      {problem.marketAnalysis.estimatedTAMBDT}
                    </span>
                    <span className="text-[11px] text-slate-500 block mt-1">Across all relevant Bangladesh districts</span>
                  </div>

                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-300">
                    <span className="text-xs text-amber-900 font-medium block">Estimated SAM (Target Division)</span>
                    <span className="text-xl font-black text-amber-950 tabular-nums">
                      {problem.marketAnalysis.estimatedSAMBDT}
                    </span>
                    <span className="text-[11px] text-amber-800 block mt-1">In {problem.location}</span>
                  </div>
                </div>

                {/* Methodology Sizing Logic */}
                <div className="p-4 rounded-xl bg-white border border-slate-200 text-xs">
                  <span className="font-bold text-slate-900 block mb-1">Defensible Calculation Logic:</span>
                  <p className="text-slate-600 leading-relaxed">
                    {problem.marketAnalysis.marketSizingMethodology}
                  </p>
                </div>

                {/* Demand Signals & Gaps */}
                <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-slate-100 text-xs">
                  <div>
                    <h4 className="font-bold text-emerald-900 mb-2">Observed Customer Demand Signals:</h4>
                    <ul className="space-y-1.5 text-slate-700">
                      {problem.marketAnalysis.demandSignals.map((signal, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-emerald-600 font-bold">✓</span>
                          <span>{signal}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 mb-2">Key Market Gaps in Bangladesh:</h4>
                    <ul className="space-y-1.5 text-slate-700">
                      {problem.marketAnalysis.marketGaps.map((gap, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-amber-600 font-bold">✦</span>
                          <span>{gap}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Competitors & Substitutes */}
                <div className="pt-4 border-t border-slate-100 text-xs">
                  <h4 className="font-bold text-slate-900 mb-2">Existing Substitutes & Benchmark Pricing:</h4>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                      <span className="font-semibold text-slate-900 block mb-1">Current Competitors:</span>
                      <p className="text-slate-600">{problem.marketAnalysis.competitorsAndSubstitutes.join(', ')}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                      <span className="font-semibold text-slate-900 block mb-1">Current Pricing Examples:</span>
                      <p className="text-slate-600">{problem.marketAnalysis.currentPricingExamples.join('; ')}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 4. Solutions & Unit Economics */}
            {activeTab === 'solutions' && (
              <div className="space-y-6 text-sm">
                <div>
                  <h3 className="text-base font-bold text-slate-950 mb-1">Potential Solution Architectures</h3>
                  <p className="text-xs text-slate-500">
                    Multiple valid pathways exist. Solvers are encouraged to propose alternative lower-cost or simpler methods.
                  </p>
                </div>

                <div className="space-y-4">
                  {problem.potentialSolutions.map((sol) => (
                    <div key={sol.id} className="p-5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="font-bold text-slate-950 text-base">{sol.title}</h4>
                        <span className="font-mono text-xs font-semibold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                          {sol.estimatedBuildTime}
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed">{sol.description}</p>

                      <div className="grid sm:grid-cols-2 gap-3 text-xs bg-white p-3 rounded-lg border border-slate-200">
                        <div>
                          <span className="text-slate-500 block">Proposed Stack / Fabrication:</span>
                          <span className="font-medium text-slate-800">{sol.techStackOrMethod}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Prototype Build Cost:</span>
                          <span className="font-bold text-emerald-800 tabular-nums">{sol.upfrontCostEstimateBDT}</span>
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-3 text-xs pt-1">
                        <div>
                          <span className="font-bold text-emerald-900 block mb-1">Pros:</span>
                          <ul className="space-y-1 text-slate-600">
                            {sol.pros.map((p, idx) => (
                              <li key={idx}>+ {p}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <span className="font-bold text-rose-900 block mb-1">Cons & Tradeoffs:</span>
                          <ul className="space-y-1 text-slate-600">
                            {sol.cons.map((c, idx) => (
                              <li key={idx}>- {c}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Business Models */}
                <div className="pt-4 border-t border-slate-100">
                  <h4 className="font-bold text-slate-950 text-sm mb-2">Viable Commercial Business Models</h4>
                  <ul className="space-y-2 text-xs text-slate-700">
                    {problem.businessModels.map((model, idx) => (
                      <li key={idx} className="p-2.5 rounded-lg bg-amber-50/80 border border-amber-200 flex items-center gap-2">
                        <span className="font-bold text-amber-700">৳</span>
                        <span>{model}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* 5. Validation Plan */}
            {activeTab === 'validation' && (
              <div className="space-y-6 text-sm">
                <div>
                  <h3 className="text-base font-bold text-slate-950 mb-1">Practical 30-Day Field Validation Playbook</h3>
                  <p className="text-xs text-slate-500">
                    Do not build in isolation. Execute these customer interviews and low-cost experiments before investing capital.
                  </p>
                </div>

                {/* Interview Questions */}
                <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <h4 className="font-bold text-slate-950 text-xs uppercase tracking-wider">
                    Customer Discovery Interview Questions:
                  </h4>
                  <ol className="list-decimal list-inside space-y-2 text-xs text-slate-700">
                    {problem.validationPlan.interviewQuestions.map((q, idx) => (
                      <li key={idx} className="leading-relaxed pl-1">{q}</li>
                    ))}
                  </ol>
                </div>

                {/* MVP & Experiment */}
                <div className="grid md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-xl border border-slate-200 bg-white">
                    <span className="font-bold text-slate-900 block mb-1">Landing Page / Concierge Test:</span>
                    <p className="text-slate-600 leading-relaxed">{problem.validationPlan.landingPageExperiment}</p>
                  </div>
                  <div className="p-4 rounded-xl border border-slate-200 bg-white">
                    <span className="font-bold text-slate-900 block mb-1">Minimum Viable Prototype (MVP):</span>
                    <p className="text-slate-600 leading-relaxed">{problem.validationPlan.prototypeMVP}</p>
                  </div>
                </div>

                {/* 30 Days Action Steps */}
                <div>
                  <h4 className="font-bold text-slate-950 text-xs uppercase tracking-wider mb-3">
                    First 30 Days Action Plan:
                  </h4>
                  <div className="space-y-2 text-xs">
                    {problem.validationPlan.first30DaysSteps.map((step, idx) => (
                      <div key={idx} className="p-3 rounded-lg bg-slate-50 border border-slate-200 font-medium text-slate-800 flex items-start gap-2">
                        <span className="font-mono text-amber-600 font-bold shrink-0">W{idx + 1}</span>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 6. Proposals & Paid Challenge */}
            {activeTab === 'proposals' && (
              <div id="propose" className="space-y-6">
                {isPaidChallenge && (
                  <div className="p-5 rounded-2xl bg-emerald-50 border-2 border-emerald-500/50 space-y-4">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-emerald-600" />
                        Verified Paid Challenge Details
                      </span>
                      <span className="font-semibold text-slate-600">
                        Deadline: {problem.paidChallenge?.applicationDeadline}
                      </span>
                    </div>

                    <div className="flex items-baseline justify-between border-b border-emerald-200 pb-3">
                      <span className="text-xs text-slate-600">Sponsor: <strong>{problem.paidChallenge?.sponsorOrganization}</strong></span>
                      <span className="text-2xl font-black text-emerald-800 tabular-nums">
                        ৳{problem.paidChallenge?.fundingConfirmedBDT.toLocaleString()} BDT
                      </span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <span className="font-bold text-slate-900 block">Milestone Disbursements:</span>
                      {problem.paidChallenge?.milestones.map((m, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 rounded bg-white border border-emerald-200">
                          <span className="font-medium text-slate-800">{m.milestoneName}</span>
                          <span className="font-bold text-emerald-800 tabular-nums">
                            {m.percentage}% (৳{m.amountBDT.toLocaleString()})
                          </span>
                        </div>
                      ))}
                    </div>

                    <p className="text-[11px] text-slate-500 italic">
                      IP Terms: {problem.paidChallenge?.intellectualPropertyTerms}
                    </p>
                  </div>
                )}

                {/* Proposal Submission Form */}
                <div className="bg-white rounded-xl p-5 border border-slate-200 space-y-4">
                  <h4 className="text-base font-bold text-slate-950">
                    {isPaidChallenge ? 'Submit Challenge Solution Proposal' : 'Propose a Solution or Collaboration'}
                  </h4>
                  <p className="text-xs text-slate-500">
                    Provide a concrete technical approach, local supply chain feasibility, and realistic timeline. Submissions enter Under Review.
                  </p>

                  {proposalSuccess && (
                    <div className="p-4 rounded-xl bg-emerald-100 text-emerald-900 text-xs font-semibold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                      Proposal successfully recorded! View and track status in your Solver Dashboard.
                    </div>
                  )}

                  <form onSubmit={handleProposalSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Proposal Title
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., Solar-assisted portable chilling tunnel using local Nawabpur components"
                        value={proposalTitle}
                        onChange={(e) => setProposalTitle(e.target.value)}
                        required
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Technical Approach & Methodology
                      </label>
                      <textarea
                        rows={4}
                        placeholder="Describe your technical build, materials, and how it solves this Bangladesh problem..."
                        value={proposalApproach}
                        onChange={(e) => setProposalApproach(e.target.value)}
                        required
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                      />
                    </div>

                    <div className="grid sm:grid-cols-3 gap-3 text-xs">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Tech Stack / Tools</label>
                        <input
                          type="text"
                          placeholder="e.g., ESP32, Python, Solar DC"
                          value={proposalTech}
                          onChange={(e) => setProposalTech(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Estimated Days</label>
                        <input
                          type="number"
                          min={7}
                          max={180}
                          value={proposalDays}
                          onChange={(e) => setProposalDays(Number(e.target.value))}
                          className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Requested Budget (৳ BDT)</label>
                        <input
                          type="number"
                          placeholder="e.g., 180000"
                          value={proposalBudget || ''}
                          onChange={(e) => setProposalBudget(e.target.value ? Number(e.target.value) : undefined)}
                          className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 px-4 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer shadow-2xs"
                    >
                      Submit Technical Proposal for Review
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* 7. Discussion */}
            {activeTab === 'discussion' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-slate-950 mb-1">Community Discussion & Field Feedback</h3>
                  <p className="text-xs text-slate-500">
                    Connect with problem reporters, local practitioners, and fellow solvers. Keep contributions constructive and grounded in Bangladesh realities.
                  </p>
                </div>

                {/* Comment Input */}
                <form onSubmit={handleCommentSubmit} className="space-y-3">
                  <textarea
                    rows={3}
                    placeholder="Share field observations, technical critiques, or local market data..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Post Comment
                  </button>
                </form>

                {/* Comment List */}
                <div className="space-y-3 pt-4 border-t border-slate-100">
                  {comments.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">No comments posted yet. Be the first to start the discussion!</p>
                  ) : (
                    comments.map((c) => (
                      <div key={c.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900">{c.authorName}</span>
                            <span className="text-[10px] font-semibold text-slate-500 uppercase px-1.5 py-0.2 bg-slate-200/70 rounded">
                              {c.authorRole}
                            </span>
                          </div>
                          <span className="text-slate-400 text-[10px]">{new Date(c.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="text-slate-700 leading-relaxed">{c.comment}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column (4 cols): Action Box, Quick Facts, Report Trigger */}
        <div className="lg:col-span-4 space-y-6">
          {/* Main Action Box */}
          <div className="bg-white rounded-2xl border-2 border-amber-300 p-6 shadow-sm space-y-5 sticky top-20">
            <div>
              <span className="text-xs text-slate-500 font-medium block">Estimated Startup Cost</span>
              <span className="text-2xl font-black text-slate-950 tabular-nums">
                {problem.estimatedStartupCostBDT.displayLabel}
              </span>
              <span className="text-[11px] text-slate-500 block mt-0.5">
                Target: {problem.timeToFirstTest}
              </span>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={handleSaveToggle}
                className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  isSaved
                    ? 'bg-amber-600 text-white hover:bg-amber-700'
                    : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                {isSaved ? 'Saved to Your Dashboard' : 'Save Problem to Dashboard'}
              </button>

              <button
                onClick={() => {
                  setActiveTab('proposals');
                  const target = document.getElementById('propose');
                  if (target) target.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors shadow-2xs cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-slate-950" />
                {isPaidChallenge ? 'Apply for Paid Challenge' : 'Submit Solution Proposal'}
              </button>
            </div>

            {/* Quick Specs */}
            <div className="space-y-2.5 pt-4 border-t border-slate-100 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Opportunity Type:</span>
                <span className="font-bold text-slate-900">{problem.opportunityType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Technical Difficulty:</span>
                <span className="font-semibold text-slate-800">{problem.difficulty}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Key Skills:</span>
                <span className="font-medium text-slate-800 text-right max-w-[170px] truncate">
                  {problem.skillsRequired.join(', ')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Division:</span>
                <span className="font-semibold text-slate-800">{problem.division}</span>
              </div>
            </div>

            {/* Report Issue Button */}
            <div className="pt-3 border-t border-slate-100 text-center">
              <button
                onClick={() => setShowReportModal(true)}
                className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-rose-600 hover:text-rose-700 cursor-pointer"
              >
                <Flag className="w-3 h-3" />
                Report Misleading Data or Abuse
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-200 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-950 flex items-center gap-1.5">
                <Flag className="w-4 h-4 text-rose-600" />
                Report Problem Record
              </h3>
              <button onClick={() => setShowReportModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            {reportSuccess ? (
              <div className="p-4 bg-emerald-100 text-emerald-900 rounded-xl font-semibold">
                Thank you. Your report has been submitted to the moderation team.
              </div>
            ) : (
              <form onSubmit={handleReportSubmit} className="space-y-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Reason for Flagging</label>
                  <select
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value as 'Misleading Data' | 'Inappropriate Content' | 'Commercial Spam' | 'Duplicate Problem')}
                    className="w-full p-2 border border-slate-200 rounded-lg text-slate-950"
                  >
                    <option value="Misleading Data">Misleading / Fabricated Market Data</option>
                    <option value="Duplicate Problem">Duplicate of Existing Problem</option>
                    <option value="Commercial Spam">Commercial Spam / Self Promotion</option>
                    <option value="Inappropriate Content">Inappropriate Content</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Explain the issue</label>
                  <textarea
                    rows={3}
                    placeholder="Provide specific details or links clarifying why this record requires revision..."
                    value={reportDetails}
                    onChange={(e) => setReportDetails(e.target.value)}
                    required
                    className="w-full p-2 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowReportModal(false)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-rose-600 text-white font-bold hover:bg-rose-700"
                  >
                    Submit Report
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Related Problems Section */}
      {relatedProblems.length > 0 && (
        <div className="mt-16 pt-12 border-t border-slate-200">
          <h2 className="text-2xl font-extrabold text-slate-950 mb-6">
            Related Problems in {problem.sector} or {problem.division}
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {relatedProblems.map((rel) => (
              <ProblemCard key={rel.id} problem={rel} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
