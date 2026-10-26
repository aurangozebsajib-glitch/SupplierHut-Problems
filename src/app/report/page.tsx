'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { getStoredProblems, submitProblemReport } from '@/lib/data-store';
import { Problem, ProblemReport } from '@/types';
import { Flag, CheckCircle2, ArrowLeft } from 'lucide-react';

export default function ReportAbusePage() {
  const [problems] = useState<Problem[]>(() => {
    return typeof window !== 'undefined' ? getStoredProblems() : [];
  });
  const [selectedProblemId, setSelectedProblemId] = useState<string>(() => {
    const list = typeof window !== 'undefined' ? getStoredProblems() : [];
    return list[0]?.id || '';
  });
  const [reason, setReason] = useState<ProblemReport['reason']>('Misleading Data');
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!details.trim()) return;

    const prob = problems.find(p => p.id === selectedProblemId);
    submitProblemReport(
      selectedProblemId, 
      prob?.title || 'General Platform Report', 
      reason, 
      details
    );
    setSubmitted(true);
  };

  return (
    <div className="py-12 sm:py-16 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900">
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Homepage
        </Link>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs space-y-6">
        <div className="flex items-center gap-2 text-rose-700 text-xs font-bold uppercase tracking-wider">
          <Flag className="w-4 h-4 text-rose-600" />
          Integrity & Moderation
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-slate-950">
          Report Misleading Data or Policy Violation
        </h1>
        <p className="text-xs text-slate-600 leading-relaxed">
          Help us maintain the highest integrity for Bangladesh market opportunities. If you notice fabricated market figures, spam, or copyright violations, report it here.
        </p>

        {submitted ? (
          <div className="p-8 text-center space-y-3 bg-emerald-50 rounded-2xl border border-emerald-200">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h3 className="text-base font-bold text-emerald-950">Report Submitted</h3>
            <p className="text-xs text-emerald-800">
              Our moderation desk has logged ticket. We will audit the cited source links and update the record accordingly.
            </p>
            <div className="pt-2">
              <Link href="/" className="inline-block px-4 py-2 text-xs font-bold text-slate-950 bg-amber-400 rounded-lg">
                Return to Directory
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Target Problem Record</label>
              <select
                value={selectedProblemId}
                onChange={(e) => setSelectedProblemId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-slate-900 bg-white font-medium"
              >
                {problems.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title} ({p.location})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Reason for Report</label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value as ProblemReport['reason'])}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-slate-900 bg-white font-medium"
              >
                <option value="Misleading Data">Misleading / Fabricated Market Data</option>
                <option value="Duplicate Problem">Duplicate of Existing Problem</option>
                <option value="Commercial Spam">Commercial Spam / Vendor Promotion</option>
                <option value="Copyright Violation">Copyright or Source Plagiarism</option>
                <option value="Inappropriate Content">Inappropriate Content</option>
                <option value="Other">Other Policy Violation</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Explanation & Supporting Links</label>
              <textarea
                rows={4}
                placeholder="Provide specific reasons why this record is inaccurate, or attach links contradicting the stated facts..."
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                required
                className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-400"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 transition-colors shadow-2xs cursor-pointer"
            >
              Submit Moderation Ticket
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
