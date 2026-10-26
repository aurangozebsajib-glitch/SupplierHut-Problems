'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Problem, UserProfile } from '@/types';
import { toggleSaveProblem, getCurrentUser } from '@/lib/data-store';
import { Bookmark, ArrowRight, CheckCircle2, AlertCircle, Clock, Sparkles } from 'lucide-react';

interface ProblemCardProps {
  problem: Problem;
}

export default function ProblemCard({ problem }: ProblemCardProps) {
  const [isSaved, setIsSaved] = useState<boolean>(() => {
    const user = getCurrentUser();
    return user.savedProblemIds?.includes(problem.id) || false;
  });

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

  const handleSaveToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newState = toggleSaveProblem(problem.id);
    setIsSaved(newState);
  };

  const getStatusDisplay = (status: Problem['validationStatus']) => {
    switch (status) {
      case 'Validated':
        return (
          <span className="inline-flex items-center gap-1 text-emerald-800 font-bold text-xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Validated Problem
          </span>
        );
      case 'Evidence Supported':
        return (
          <span className="inline-flex items-center gap-1 text-blue-800 font-bold text-xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
            Evidence Supported
          </span>
        );
      case 'Researching':
        return (
          <span className="inline-flex items-center gap-1 text-amber-800 font-bold text-xs">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            Researching
          </span>
        );
      case 'Unverified':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-slate-600 font-bold text-xs">
            <AlertCircle className="w-3.5 h-3.5 text-slate-400" />
            Unverified Submission
          </span>
        );
    }
  };

  const isPaidChallenge = problem.opportunityType === 'Paid Challenge' && problem.paidChallenge;

  return (
    <div className="group relative bg-amber-50/70 hover:bg-amber-100/60 transition-all duration-200 border-2 border-amber-300 hover:border-amber-400 rounded-2xl flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md">
      {/* Top Banner Stripe - Warm Yellow with Sketch Energy */}
      <div className="bg-amber-400 px-5 py-3 border-b border-amber-300 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-950">
          <span>{problem.sector}</span>
          <span aria-hidden="true" className="text-amber-700">·</span>
          <span className="font-semibold text-slate-900">{problem.location}</span>
        </div>

        <button
          onClick={handleSaveToggle}
          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
            isSaved 
              ? 'bg-amber-600 text-white' 
              : 'text-slate-900 hover:bg-amber-300/80'
          }`}
          title={isSaved ? 'Remove from saved' : 'Save problem to dashboard'}
          aria-label="Save problem"
        >
          <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Main Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Validation Status & Opportunity Flag */}
          <div className="flex items-center justify-between gap-2 mb-3 text-xs">
            {getStatusDisplay(problem.validationStatus)}
            
            {isPaidChallenge ? (
              <span className="font-extrabold text-emerald-800 bg-emerald-100/90 px-2.5 py-0.5 rounded text-xs inline-flex items-center gap-1 border border-emerald-300">
                <Sparkles className="w-3 h-3 text-emerald-700" />
                Paid Challenge: ৳{problem.paidChallenge?.fundingConfirmedBDT.toLocaleString()}
              </span>
            ) : (
              <span className="font-medium text-slate-600 text-[11px]">
                {problem.opportunityType}
              </span>
            )}
          </div>

          {/* Title */}
          <Link href={`/problems/${problem.slug}`}>
            <h3 className="text-lg font-extrabold text-slate-950 group-hover:text-amber-950 leading-snug mb-2 transition-colors">
              {problem.title}
            </h3>
          </Link>

          {/* Summary */}
          <p className="text-xs text-slate-700 line-clamp-3 leading-relaxed mb-4">
            {problem.summary}
          </p>

          {/* Customer & Demand Signals */}
          <div className="space-y-1.5 pt-3 border-t border-amber-200/70 text-xs">
            <div className="flex items-start gap-1.5 text-slate-800">
              <span className="font-bold text-slate-900 shrink-0">Affected:</span>
              <span className="text-slate-700 line-clamp-1">{problem.affectedCustomerType}</span>
            </div>
            <div className="flex items-start gap-1.5 text-slate-800">
              <span className="font-bold text-slate-900 shrink-0">Frequency:</span>
              <span className="text-slate-700">{problem.frequency}</span>
            </div>
          </div>
        </div>

        {/* Bottom Metrics & CTA */}
        <div className="mt-5 pt-4 border-t border-amber-200/70">
          <div className="grid grid-cols-2 gap-2 text-[11px] mb-4">
            <div>
              <span className="text-slate-500 block">Startup Cost (Est.)</span>
              <span className="font-bold text-slate-900 tabular-nums">
                {problem.estimatedStartupCostBDT.displayLabel}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">Difficulty</span>
              <span className="font-semibold text-slate-800">
                {problem.difficulty}
              </span>
            </div>
          </div>

          <Link
            href={`/problems/${problem.slug}`}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 transition-colors shadow-2xs group-hover:bg-amber-400"
          >
            <span>View Opportunity Details</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}
