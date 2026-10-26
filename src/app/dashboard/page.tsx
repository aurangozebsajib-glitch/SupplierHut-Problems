'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { UserProfile, Problem, SolutionProposal } from '@/types';
import { 
  getCurrentUser, 
  setCurrentUser, 
  getStoredProblems, 
  getStoredProposals,
  toggleSaveProblem
} from '@/lib/data-store';
import RoleSwitcher from '@/components/RoleSwitcher';
import { 
  Bookmark, 
  FileText, 
  Sparkles, 
  Settings, 
  CheckCircle2, 
  AlertCircle, 
  Trash2
} from 'lucide-react';

export default function DashboardPage() {
  const [currentUser, setUser] = useState<UserProfile>(() => getCurrentUser());
  const [activeTab, setActiveTab] = useState<'saved' | 'submissions' | 'proposals' | 'profile'>('saved');
  const [allProblems, setAllProblems] = useState<Problem[]>(() => getStoredProblems());
  const [allProposals, setAllProposals] = useState<SolutionProposal[]>(() => getStoredProposals());
  
  // Profile edit state
  const [name, setName] = useState(currentUser.name);
  const [title, setTitle] = useState(currentUser.title);
  const [bio, setBio] = useState(currentUser.bio);
  const [location, setLocation] = useState(currentUser.location);
  const [skillsStr, setSkillsStr] = useState(currentUser.skills.join(', '));
  const [portfolioUrl, setPortfolioUrl] = useState(currentUser.portfolioUrl || '');
  const [profileSuccess, setProfileSuccess] = useState(false);

  useEffect(() => {
    const handleAuth = (e: Event) => {
      const customEvent = e as CustomEvent<UserProfile>;
      if (customEvent.detail) {
        setUser(customEvent.detail);
        setName(customEvent.detail.name);
        setTitle(customEvent.detail.title);
        setBio(customEvent.detail.bio);
        setLocation(customEvent.detail.location);
        setSkillsStr(customEvent.detail.skills.join(', '));
        setPortfolioUrl(customEvent.detail.portfolioUrl || '');
        setAllProblems(getStoredProblems());
        setAllProposals(getStoredProposals());
      }
    };
    window.addEventListener('supplierhut_auth_changed', handleAuth);
    return () => window.removeEventListener('supplierhut_auth_changed', handleAuth);
  }, []);

  // Filter items
  const savedProblems = allProblems.filter((p) => currentUser.savedProblemIds?.includes(p.id));
  const mySubmissions = allProblems.filter((p) => p.reportedBy.name.includes(currentUser.name.split(' ')[0]));
  const myProposals = allProposals.filter((pr) => pr.solverEmail === currentUser.email);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      ...currentUser,
      name,
      title,
      bio,
      location,
      skills: skillsStr.split(',').map((s) => s.trim()).filter(Boolean),
      portfolioUrl
    };
    setCurrentUser(updated);
    setUser(updated);
    setProfileSuccess(true);
    setTimeout(() => setProfileSuccess(false), 2500);
  };

  const handleRemoveSaved = (problemId: string) => {
    toggleSaveProblem(problemId);
    setAllProblems([...getStoredProblems()]);
    setUser(getCurrentUser());
  };

  const getProposalStatusBadge = (status: SolutionProposal['status']) => {
    switch (status) {
      case 'Accepted':
        return <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-emerald-100 text-emerald-900 border border-emerald-300">Accepted by Sponsor</span>;
      case 'Shortlisted':
        return <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-blue-100 text-blue-900 border border-blue-300">Shortlisted for Review</span>;
      case 'Under Review':
        return <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-amber-100 text-amber-900 border border-amber-300">Under Technical Review</span>;
      case 'Rejected':
        return <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-rose-100 text-rose-900 border border-rose-300">Not Selected</span>;
      case 'Completed':
        return <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-purple-100 text-purple-900 border border-purple-300">Milestones Completed</span>;
      case 'Submitted':
      default:
        return <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-slate-100 text-slate-800 border border-slate-200">Submitted</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Top Banner with Profile Header & Role Switcher */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-400 text-slate-950 font-black text-2xl flex items-center justify-center shrink-0 border-2 border-amber-500 shadow-2xs">
            {currentUser.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-950">{currentUser.name}</h1>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-300">
                {currentUser.role}
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">{currentUser.title} · <span className="font-semibold text-slate-800">{currentUser.location}</span></p>
            <p className="text-xs text-slate-400 font-mono mt-0.5">{currentUser.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <RoleSwitcher />
          <Link
            href="/submit"
            className="px-4 py-2 text-xs font-bold text-slate-950 bg-emerald-500 hover:bg-emerald-400 rounded-xl transition-colors shadow-2xs"
          >
            + Submit Problem
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-slate-200 p-1.5 shadow-2xs mb-8 flex items-center gap-1 overflow-x-auto text-xs font-semibold">
        <button
          onClick={() => setActiveTab('saved')}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'saved' ? 'bg-amber-400 text-slate-950 font-bold shadow-2xs' : 'text-slate-600 hover:text-slate-950'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          Saved Problems ({savedProblems.length})
        </button>

        <button
          onClick={() => setActiveTab('proposals')}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'proposals' ? 'bg-amber-400 text-slate-950 font-bold shadow-2xs' : 'text-slate-600 hover:text-slate-950'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          My Proposals & Challenges ({myProposals.length})
        </button>

        <button
          onClick={() => setActiveTab('submissions')}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'submissions' ? 'bg-amber-400 text-slate-950 font-bold shadow-2xs' : 'text-slate-600 hover:text-slate-950'
          }`}
        >
          <FileText className="w-4 h-4" />
          My Problem Submissions ({mySubmissions.length})
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'profile' ? 'bg-amber-400 text-slate-950 font-bold shadow-2xs' : 'text-slate-600 hover:text-slate-950'
          }`}
        >
          <Settings className="w-4 h-4" />
          Profile Settings
        </button>
      </div>

      {/* Tab 1: Saved Problems */}
      {activeTab === 'saved' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-950">Followed Opportunities & Problems</h2>
            <span className="text-xs text-slate-500 font-medium">Keep track of market updates and field tests</span>
          </div>

          {savedProblems.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto">
              <Bookmark className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-900 mb-1">No saved problems yet</h3>
              <p className="text-xs text-slate-500 mb-4">Browse problems on the homepage and click the bookmark button to save them here.</p>
              <Link href="/#problems" className="inline-block px-4 py-2 text-xs font-bold text-slate-950 bg-amber-400 rounded-lg hover:bg-amber-300">
                Explore Problems
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {savedProblems.map((prob) => (
                <div key={prob.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:border-amber-300 transition-all">
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                      <span className="font-bold text-slate-900">{prob.sector}</span>
                      <span>{prob.location}</span>
                    </div>
                    <Link href={`/problems/${prob.slug}`}>
                      <h3 className="font-bold text-slate-950 text-base hover:text-amber-700 transition-colors mb-2">
                        {prob.title}
                      </h3>
                    </Link>
                    <p className="text-xs text-slate-600 line-clamp-2 mb-4">{prob.summary}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="font-semibold text-emerald-800">
                      {prob.opportunityType}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleRemoveSaved(prob.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                        title="Remove from saved"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <Link
                        href={`/problems/${prob.slug}`}
                        className="px-3 py-1.5 rounded-lg bg-amber-400 text-slate-950 font-bold hover:bg-amber-300"
                      >
                        Open Details &rarr;
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: My Proposals & Challenges */}
      {activeTab === 'proposals' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-950">My Solution Proposals & Challenge Applications</h2>
            <p className="text-xs text-slate-500">
              Track review status, sponsor remarks, and milestone disbursements.
            </p>
          </div>

          {/* Critical Disclaimer Box */}
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-xs text-amber-950 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">Important Payment Distinctions:</span>
              Having a technical proposal <span className="font-bold">Accepted</span> indicates selection to build the prototype. Money is disbursed only upon verified delivery of agreed technical milestones inspected by the sponsor.
            </div>
          </div>

          {myProposals.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto">
              <Sparkles className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-900 mb-1">No proposals submitted yet</h3>
              <p className="text-xs text-slate-500 mb-4">Review open challenges and submit technical approaches to win funded grants.</p>
              <Link href="/#challenges" className="inline-block px-4 py-2 text-xs font-bold text-slate-950 bg-emerald-500 rounded-lg hover:bg-emerald-400">
                View Paid Challenges
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {myProposals.map((pr) => (
                <div key={pr.id} className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                    <div>
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Target Problem</span>
                      <h3 className="font-bold text-slate-900 text-sm">{pr.problemTitle}</h3>
                    </div>
                    <div>{getProposalStatusBadge(pr.status)}</div>
                  </div>

                  <div>
                    <h4 className="font-extrabold text-base text-slate-950 mb-1">{pr.title}</h4>
                    <p className="text-xs text-slate-700 leading-relaxed mb-3">{pr.approach}</p>

                    <div className="grid sm:grid-cols-3 gap-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <div>
                        <span className="text-slate-500 block">Tech Stack:</span>
                        <span className="font-medium text-slate-800">{pr.techStack}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Estimated Timeline:</span>
                        <span className="font-medium text-slate-800">{pr.estimatedDays} days</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Requested Budget:</span>
                        <span className="font-bold text-emerald-800 tabular-nums">
                          {pr.requestedBudgetBDT ? `৳${pr.requestedBudgetBDT.toLocaleString()} BDT` : 'Open / Sponsor Terms'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {pr.reviewerNotes && (
                    <div className="p-3 bg-blue-50/80 rounded-lg border border-blue-200 text-xs text-blue-950">
                      <span className="font-bold block mb-0.5">Sponsor / Reviewer Remarks:</span>
                      {pr.reviewerNotes}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                    <span>Submitted on: {new Date(pr.submittedAt).toLocaleDateString()}</span>
                    <span>Proposal ID: <strong className="font-mono">{pr.id}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: My Problem Submissions */}
      {activeTab === 'submissions' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-950">My Documented Problems</h2>
              <p className="text-xs text-slate-500">Track review progress from our research auditing desk.</p>
            </div>
            <Link
              href="/submit"
              className="px-4 py-2 text-xs font-bold text-slate-950 bg-emerald-500 hover:bg-emerald-400 rounded-lg"
            >
              + Submit New Problem
            </Link>
          </div>

          {mySubmissions.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto">
              <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-900 mb-1">No problems submitted yet</h3>
              <p className="text-xs text-slate-500 mb-4">Document an operational problem from your trade or locality to match with solvers.</p>
              <Link href="/submit" className="inline-block px-4 py-2 text-xs font-bold text-slate-950 bg-emerald-500 rounded-lg hover:bg-emerald-400">
                Submit Your First Problem
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {mySubmissions.map((sub) => (
                <div key={sub.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-500">{sub.sector} · {sub.location}</span>
                    <span className={`px-2.5 py-0.5 rounded-md font-bold text-xs ${
                      sub.validationStatus === 'Validated' 
                        ? 'bg-emerald-100 text-emerald-900' 
                        : sub.validationStatus === 'Evidence Supported'
                        ? 'bg-blue-100 text-blue-900'
                        : 'bg-amber-100 text-amber-900'
                    }`}>
                      Status: {sub.validationStatus}
                    </span>
                  </div>

                  <Link href={`/problems/${sub.slug}`}>
                    <h3 className="font-bold text-slate-950 text-base hover:text-amber-700 transition-colors">
                      {sub.title}
                    </h3>
                  </Link>

                  <p className="text-xs text-slate-600 line-clamp-2">{sub.summary}</p>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span>Submitted on: {sub.dateReported}</span>
                    <Link href={`/problems/${sub.slug}`} className="text-amber-700 font-bold hover:underline">
                      View Live Page &rarr;
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Profile Settings */}
      {activeTab === 'profile' && (
        <div className="max-w-2xl bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <h2 className="text-lg font-bold text-slate-950 mb-1">Solver & Submitter Profile Settings</h2>
          <p className="text-xs text-slate-500 mb-6">
            Keep your skills and location accurate to receive relevant problem alerts and challenge invitations.
          </p>

          {profileSuccess && (
            <div className="p-4 rounded-xl bg-emerald-100 text-emerald-900 text-xs font-semibold mb-6 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              Profile updated successfully!
            </div>
          )}

          <form onSubmit={handleProfileSave} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Professional Title / Role</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Location in Bangladesh</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Skills & Technical Competencies (comma separated)</label>
              <input
                type="text"
                value={skillsStr}
                onChange={(e) => setSkillsStr(e.target.value)}
                placeholder="e.g. Next.js, IoT Sensors, Cold Chain, Agri Research"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Portfolio or GitHub URL</label>
              <input
                type="url"
                value={portfolioUrl}
                onChange={(e) => setPortfolioUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Bio / Background</label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer"
              >
                Save Profile Changes
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
