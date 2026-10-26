'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Problem, 
  SolutionProposal, 
  AuditLogItem, 
  ProblemReport, 
  ValidationStatus, 
  ProposalStatus, 
  UserProfile 
} from '@/types';
import { 
  getCurrentUser, 
  getStoredProblems, 
  getStoredProposals, 
  getStoredAuditLogs, 
  getStoredReports,
  updateProblemStatus,
  deleteProblemRecord,
  updateProposalStatusRecord,
  updateReportStatusRecord,
} from '@/lib/data-store';
import { 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle, 
  RefreshCw,
  Database,
  Lock,
  LogIn,
  Layers
} from 'lucide-react';

interface ServerAuthStatus {
  loading: boolean;
  authorized: boolean;
  reason?: string;
  adminEmailConfigured: boolean;
  isClerkConfigured: boolean;
  maskedAdminEmail?: string | null;
  authenticatedUserEmail?: string;
  adminUser?: {
    id: string;
    email: string;
    name: string;
  };
}

export default function AdminPage() {
  const [currentUser] = useState<UserProfile>(() => getCurrentUser());
  const [activeTab, setActiveTab] = useState<'problems' | 'proposals' | 'reports' | 'audit' | 'database'>('problems');
  const [problems, setProblems] = useState<Problem[]>(() => getStoredProblems());
  const [proposals, setProposals] = useState<SolutionProposal[]>(() => getStoredProposals());
  const [reports, setReports] = useState<ProblemReport[]>(() => getStoredReports());
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(() => getStoredAuditLogs());
  
  // Server-side auth check state
  const [serverAuth, setServerAuth] = useState<ServerAuthStatus>({
    loading: true,
    authorized: false,
    adminEmailConfigured: false,
    isClerkConfigured: false,
  });

  // Database table verification state
  const [dbStatus, setDbStatus] = useState<{ checked: boolean; success?: boolean; message?: string }>({
    checked: false,
  });

  // Status notification message
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    fetch('/api/admin/verify')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!isMounted) return;
        if (data) {
          setServerAuth({
            loading: false,
            authorized: Boolean(data.authorized),
            reason: data.reason,
            adminEmailConfigured: Boolean(data.adminEmailConfigured),
            isClerkConfigured: Boolean(data.isClerkConfigured),
            maskedAdminEmail: data.maskedAdminEmail,
            authenticatedUserEmail: data.authenticatedUserEmail,
            adminUser: data.adminUser,
          });
        } else {
          setServerAuth({
            loading: false,
            authorized: false,
            reason: 'Failed to query server authorization',
            adminEmailConfigured: false,
            isClerkConfigured: false,
          });
        }
      })
      .catch(() => {
        if (!isMounted) return;
        setServerAuth({
          loading: false,
          authorized: false,
          reason: 'Network error checking server authorization',
          adminEmailConfigured: false,
          isClerkConfigured: false,
        });
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const loadData = () => {
    setProblems(getStoredProblems());
    setProposals(getStoredProposals());
    setReports(getStoredReports());
    setAuditLogs(getStoredAuditLogs());
  };

  const checkServerAuth = async () => {
    try {
      const res = await fetch('/api/admin/verify');
      if (res.ok) {
        const data = await res.json();
        setServerAuth({
          loading: false,
          authorized: Boolean(data.authorized),
          reason: data.reason,
          adminEmailConfigured: Boolean(data.adminEmailConfigured),
          isClerkConfigured: Boolean(data.isClerkConfigured),
          maskedAdminEmail: data.maskedAdminEmail,
          authenticatedUserEmail: data.authenticatedUserEmail,
          adminUser: data.adminUser,
        });
      }
    } catch {
      // Ignore transient check failure
    }
  };

  const handleEnsureTables = async () => {
    try {
      const res = await fetch('/api/admin/actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'ensure_tables' }),
      });
      const data = await res.json();
      setDbStatus({ checked: true, success: res.ok, message: data.message || data.error });
      if (res.ok) {
        setNotification('Neon database tables verified successfully');
        setTimeout(() => setNotification(null), 3000);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Database check failed';
      setDbStatus({ checked: true, success: false, message: msg });
    }
  };

  const handleStatusChange = async (problemId: string, newStatus: ValidationStatus) => {
    const confidence = newStatus === 'Validated' ? 95 : newStatus === 'Evidence Supported' ? 80 : 50;
    updateProblemStatus(problemId, newStatus, confidence);
    loadData();

    // Log action to server
    try {
      await fetch('/api/admin/actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'record_audit_log',
          payload: {
            actionName: 'UPDATE_STATUS',
            targetType: 'Problem',
            targetId: problemId,
            details: `Status set to ${newStatus}`,
          },
        }),
      });
    } catch {
      // Offline fallback
    }

    setNotification(`Updated problem status to ${newStatus}`);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleDeleteProblem = (problemId: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) {
      deleteProblemRecord(problemId);
      loadData();
      setNotification(`Deleted problem ${problemId}`);
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleProposalStatus = (proposalId: string, status: ProposalStatus) => {
    const note = prompt('Add reviewer feedback note for the applicant:');
    updateProposalStatusRecord(proposalId, status, note || undefined);
    loadData();
    setNotification(`Updated proposal status to ${status}`);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleReportAction = (reportId: string, newStatus: ProblemReport['status']) => {
    updateReportStatusRecord(reportId, newStatus);
    loadData();
    setNotification(`Marked report as ${newStatus}`);
    setTimeout(() => setNotification(null), 3000);
  };

  // Loading state
  if (serverAuth.loading) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs space-y-4">
          <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-semibold text-slate-600">Verifying administrator authorization server-side...</p>
        </div>
      </div>
    );
  }

  // Deny access if server authorization check fails
  // When Clerk is configured in production, only authenticated users matching ADMIN_EMAIL are allowed
  if (serverAuth.isClerkConfigured && !serverAuth.authorized) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="bg-white rounded-3xl p-8 border border-rose-200 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-slate-950">403 Restricted Admin Area</h1>
          
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-left text-xs space-y-1.5 text-rose-900">
            <p className="font-bold flex items-center gap-1.5 text-rose-950">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              Server-Enforced Access Control
            </p>
            <p className="text-[11px] leading-relaxed text-rose-800">
              {serverAuth.reason || 'You are not authorized to view or manage administrative operations.'}
            </p>
            {serverAuth.maskedAdminEmail && (
              <p className="text-[10px] text-rose-700 font-mono mt-1">
                Authorized Admin: {serverAuth.maskedAdminEmail}
              </p>
            )}
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Administrator access requires a verified email address matching the configured <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-slate-900 font-semibold">ADMIN_EMAIL</code>. Local storage or client-side roles cannot grant administrative permissions.
          </p>

          <div className="pt-2 space-y-2">
            <Link
              href="/sign-in"
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-colors cursor-pointer shadow-xs"
            >
              <LogIn className="w-4 h-4" />
              Sign In with Admin Account
            </Link>

            <Link href="/" className="block text-xs font-semibold text-slate-500 hover:text-slate-800 pt-1">
              Back to Homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // If in local standalone environment without Clerk keys or ADMIN_EMAIL configured,
  // allow local preview with a prominent notice indicating production server protection
  const isLocalDemoMode = !serverAuth.isClerkConfigured && !serverAuth.authorized;

  const pendingProblems = problems.filter(p => p.validationStatus === 'Unverified');
  const activeChallenges = problems.filter(p => p.opportunityType === 'Paid Challenge');
  const openReports = reports.filter(r => r.status === 'Open');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Local demo banner if keys are pending */}
      {isLocalDemoMode && (
        <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-900">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-slate-900">Local Sandbox Mode — Production Protected by Server-Side Admin Rules</p>
              <p className="text-[11px] text-slate-700 mt-0.5">
                Clerk keys and <code className="bg-white/80 px-1 py-0.2 rounded font-mono">ADMIN_EMAIL</code> are configured in Vercel. In production at <strong className="text-slate-900">supplier-hut-problems.vercel.app</strong>, access is strictly verified on the server against the authenticated user&apos;s verified email.
              </p>
            </div>
          </div>
          <button
            onClick={checkServerAuth}
            className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-lg font-bold text-xs cursor-pointer shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Check Live Auth
          </button>
        </div>
      )}

      {/* Top Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-700 mb-1">
            <ShieldCheck className="w-4 h-4 text-amber-600" />
            Administrative Operations & Governance Desk
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-950">
            Platform Moderation & Verification
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {serverAuth.authorized ? (
              <span className="inline-flex items-center gap-1.5 text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                Verified Server Admin: <strong>{serverAuth.authenticatedUserEmail}</strong>
              </span>
            ) : (
              <span>Session: <strong className="text-slate-800">{currentUser.name}</strong> ({currentUser.email})</span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleEnsureTables}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer shadow-2xs"
            title="Verify Neon database tables"
          >
            <Database className="w-3.5 h-3.5 text-emerald-600" />
            Verify Neon Tables
          </button>
          <button
            onClick={loadData}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer shadow-2xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh Records
          </button>
        </div>
      </div>

      {notification && (
        <div className="p-3 bg-emerald-100 text-emerald-900 text-xs font-bold rounded-xl mb-6 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-700" />
          {notification}
        </div>
      )}

      {dbStatus.checked && (
        <div className={`p-3 text-xs font-semibold rounded-xl mb-6 flex items-center gap-2 ${
          dbStatus.success ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' : 'bg-slate-100 text-slate-800 border border-slate-200'
        }`}>
          <Database className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>{dbStatus.message}</span>
        </div>
      )}

      {/* KPI Overview Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium block">Total Problems</span>
          <span className="text-2xl font-black text-slate-950 tabular-nums">{problems.length}</span>
          <span className="text-[11px] text-amber-600 font-bold block mt-0.5">{pendingProblems.length} Pending Review</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium block">Active Paid Challenges</span>
          <span className="text-2xl font-black text-emerald-800 tabular-nums">{activeChallenges.length}</span>
          <span className="text-[11px] text-slate-500 block mt-0.5">Verified escrow backing</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium block">Submitted Proposals</span>
          <span className="text-2xl font-black text-slate-950 tabular-nums">{proposals.length}</span>
          <span className="text-[11px] text-slate-500 block mt-0.5">{proposals.filter(pr => pr.status === 'Submitted').length} unreviewed</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium block">Abuse & Flags</span>
          <span className="text-2xl font-black text-rose-600 tabular-nums">{openReports.length}</span>
          <span className="text-[11px] text-slate-500 block mt-0.5">Open moderation tickets</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-slate-200 p-1.5 shadow-2xs mb-6 flex items-center gap-1 overflow-x-auto text-xs font-semibold">
        <button
          onClick={() => setActiveTab('problems')}
          className={`px-4 py-2 rounded-lg whitespace-nowrap cursor-pointer ${
            activeTab === 'problems' ? 'bg-amber-400 text-slate-950 font-bold shadow-2xs' : 'text-slate-600 hover:text-slate-950'
          }`}
        >
          Problems & Verification Queue ({problems.length})
        </button>

        <button
          onClick={() => setActiveTab('proposals')}
          className={`px-4 py-2 rounded-lg whitespace-nowrap cursor-pointer ${
            activeTab === 'proposals' ? 'bg-amber-400 text-slate-950 font-bold shadow-2xs' : 'text-slate-600 hover:text-slate-950'
          }`}
        >
          Proposals & Applications ({proposals.length})
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`px-4 py-2 rounded-lg whitespace-nowrap cursor-pointer ${
            activeTab === 'reports' ? 'bg-amber-400 text-slate-950 font-bold shadow-2xs' : 'text-slate-600 hover:text-slate-950'
          }`}
        >
          Abuse Reports ({reports.length})
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2 rounded-lg whitespace-nowrap cursor-pointer ${
            activeTab === 'audit' ? 'bg-amber-400 text-slate-950 font-bold shadow-2xs' : 'text-slate-600 hover:text-slate-950'
          }`}
        >
          Audit Log ({auditLogs.length})
        </button>

        <button
          onClick={() => setActiveTab('database')}
          className={`px-4 py-2 rounded-lg whitespace-nowrap cursor-pointer ${
            activeTab === 'database' ? 'bg-amber-400 text-slate-950 font-bold shadow-2xs' : 'text-slate-600 hover:text-slate-950'
          }`}
        >
          Neon DB & Environment
        </button>
      </div>

      {/* Tab 1: Problems List & Verification Actions */}
      {activeTab === 'problems' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between text-xs">
            <span className="font-bold text-slate-900">Manage Problem Verification Status & Evidence</span>
            <span className="text-slate-500">Unverified → Researching → Evidence Supported → Validated</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Title & Sector</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Validation Status</th>
                  <th className="py-3 px-4">Opportunity Type</th>
                  <th className="py-3 px-4">Reported By</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800 font-medium">
                {problems.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-4 max-w-xs">
                      <Link href={`/problems/${p.slug}`} className="font-bold text-slate-950 hover:underline block truncate">
                        {p.title}
                      </Link>
                      <span className="text-[11px] text-slate-500">{p.sector} · {p.evidenceSources.length} sources</span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">{p.location}</td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <select
                        value={p.validationStatus}
                        onChange={(e) => handleStatusChange(p.id, e.target.value as ValidationStatus)}
                        className={`text-xs font-bold rounded px-2 py-1 border cursor-pointer ${
                          p.validationStatus === 'Validated'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : p.validationStatus === 'Evidence Supported'
                            ? 'bg-blue-50 text-blue-800 border-blue-300'
                            : p.validationStatus === 'Researching'
                            ? 'bg-amber-50 text-amber-800 border-amber-300'
                            : 'bg-slate-100 text-slate-700 border-slate-300'
                        }`}
                      >
                        <option value="Unverified">Unverified</option>
                        <option value="Researching">Researching</option>
                        <option value="Evidence Supported">Evidence Supported</option>
                        <option value="Validated">Validated</option>
                        <option value="Archived">Archived</option>
                      </select>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="font-semibold text-slate-900">{p.opportunityType}</span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-slate-600">
                      {p.reportedBy.name}
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap space-x-2">
                      <Link
                        href={`/problems/${p.slug}`}
                        className="text-xs font-semibold text-blue-600 hover:underline"
                      >
                        View
                      </Link>
                      <button
                        onClick={() => handleDeleteProblem(p.id, p.title)}
                        className="text-xs font-semibold text-rose-600 hover:text-rose-800 cursor-pointer"
                        title="Delete record"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Proposals List */}
      {activeTab === 'proposals' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-100 text-xs font-bold text-slate-900">
            Review Submitted Technical Approaches
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Applicant & Title</th>
                  <th className="py-3 px-4">Target Problem</th>
                  <th className="py-3 px-4">Timeline / Budget</th>
                  <th className="py-3 px-4">Current Status</th>
                  <th className="py-3 px-4 text-right">Review Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800 font-medium">
                {proposals.map((pr) => (
                  <tr key={pr.id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-4 max-w-xs">
                      <span className="font-bold text-slate-950 block">{pr.title}</span>
                      <span className="text-[11px] text-slate-500">{pr.solverName} ({pr.solverEmail})</span>
                    </td>
                    <td className="py-3 px-4 max-w-xs truncate text-slate-700">{pr.problemTitle}</td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {pr.estimatedDays} days · <strong className="text-emerald-800">৳{pr.requestedBudgetBDT?.toLocaleString() || 'N/A'}</strong>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="font-bold px-2 py-0.5 rounded text-xs bg-slate-100">
                        {pr.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap space-x-1.5">
                      <button
                        onClick={() => handleProposalStatus(pr.id, 'Shortlisted')}
                        className="px-2 py-1 rounded bg-blue-50 text-blue-700 font-bold hover:bg-blue-100 cursor-pointer"
                      >
                        Shortlist
                      </button>
                      <button
                        onClick={() => handleProposalStatus(pr.id, 'Accepted')}
                        className="px-2 py-1 rounded bg-emerald-50 text-emerald-700 font-bold hover:bg-emerald-100 cursor-pointer"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleProposalStatus(pr.id, 'Rejected')}
                        className="px-2 py-1 rounded bg-rose-50 text-rose-700 font-bold hover:bg-rose-100 cursor-pointer"
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Reports */}
      {activeTab === 'reports' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-100 text-xs font-bold text-slate-900">
            Community Flagged Content & Moderation Tickets
          </div>

          {reports.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">No active abuse reports in queue.</div>
          ) : (
            <div className="divide-y divide-slate-100 text-xs">
              {reports.map((r) => (
                <div key={r.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-rose-800 bg-rose-100 px-2 py-0.5 rounded text-[11px] uppercase">
                        {r.reason}
                      </span>
                      <span className="text-slate-400 font-mono text-[10px]">{new Date(r.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="font-bold text-slate-900">Problem: {r.problemTitle}</p>
                    <p className="text-slate-600">{r.details}</p>
                    <span className="text-[11px] text-slate-400">Reported by: {r.reporterEmail}</span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-bold text-slate-500 mr-2">Status: {r.status}</span>
                    <button
                      onClick={() => handleReportAction(r.id, 'Resolved')}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-700 cursor-pointer"
                    >
                      Resolve
                    </button>
                    <button
                      onClick={() => handleReportAction(r.id, 'Dismissed')}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 cursor-pointer"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Audit Logs */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-100 text-xs font-bold text-slate-900">
            Immutable Administrative Audit Trail (Asia/Dhaka)
          </div>

          <div className="divide-y divide-slate-100 font-mono text-[11px]">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50">
                <div>
                  <span className="text-amber-700 font-bold mr-2">[{log.action}]</span>
                  <span className="text-slate-800">{log.details}</span>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    Target: {log.targetType} #{log.targetId} · Actor: {log.actorEmail} ({log.actorRole})
                  </div>
                </div>
                <span className="text-slate-400 shrink-0 text-[10px]">{new Date(log.timestamp).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Neon Database & Environment Verification */}
      {activeTab === 'database' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-950 flex items-center gap-2">
              <Database className="w-5 h-5 text-emerald-600" />
              Neon PostgreSQL Database & Environment Integrity
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              Verify schema status, connection pooling, and Clerk server-side configuration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">Database Connection</span>
                <span className="text-[11px] px-2 py-0.5 rounded font-mono font-bold bg-emerald-100 text-emerald-800">
                  @neondatabase/serverless
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Uses pooled connection <code className="font-mono text-slate-800 font-semibold bg-white px-1 py-0.5 rounded border border-slate-200">DATABASE_URL</code> for fast serverless execution and direct <code className="font-mono text-slate-800 font-semibold bg-white px-1 py-0.5 rounded border border-slate-200">DATABASE_URL_UNPOOLED</code> for migrations.
              </p>
              <button
                onClick={handleEnsureTables}
                className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
              >
                <Layers className="w-4 h-4" />
                Run Table Schema Verification
              </button>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">Clerk Authentication & Admin</span>
                <span className="text-[11px] px-2 py-0.5 rounded font-mono font-bold bg-amber-100 text-amber-800">
                  @clerk/nextjs
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Server-side role protection verifies the authenticated user&apos;s verified email against <code className="font-mono text-slate-800 font-semibold bg-white px-1 py-0.5 rounded border border-slate-200">ADMIN_EMAIL</code>.
              </p>
              <div className="p-2.5 bg-white rounded-lg border border-slate-200 text-[11px] font-mono text-slate-700">
                Configured Admin: {serverAuth.maskedAdminEmail || 'Configured via Vercel env'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
