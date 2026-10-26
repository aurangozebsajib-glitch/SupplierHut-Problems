'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sector, Problem, EvidenceSource } from '@/types';
import { createProblemSubmission, getStoredProblems } from '@/lib/data-store';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  Save, 
  ShieldAlert
} from 'lucide-react';

const SECTORS: Sector[] = [
  'Agriculture',
  'Retail & SMEs',
  'Healthcare',
  'Technology',
  'Logistics',
  'Education',
  'Environment',
  'Finance',
  'Employment',
  'Public Services',
  'Other'
];

const DIVISIONS: Problem['division'][] = ['Dhaka', 'Chittagong', 'Rajshahi', 'Khulna', 'Sylhet', 'Rangpur', 'Barishal', 'Mymensingh', 'National'];

interface StoredDraft {
  title?: string;
  sector?: Sector;
  location?: string;
  division?: Problem['division'];
  summary?: string;
  fullDescription?: string;
  affectedCustomerType?: string;
  frequency?: string;
  existingAlternatives?: string;
  whyAlternativesFail?: string;
}

function getStoredDraft(): StoredDraft | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('supplierhut_submit_draft');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export default function SubmitProblemPage() {
  const [step, setStep] = useState(1);
  const [existingProblems] = useState<Problem[]>(() => {
    return typeof window !== 'undefined' ? getStoredProblems() : [];
  });

  // Form State
  const [title, setTitle] = useState(() => getStoredDraft()?.title || '');
  const [sector, setSector] = useState<Sector>(() => getStoredDraft()?.sector || 'Agriculture');
  const [location, setLocation] = useState(() => getStoredDraft()?.location || 'Bogura, Rajshahi Division');
  const [division, setDivision] = useState<Problem['division']>(() => getStoredDraft()?.division || 'Rajshahi');
  const [affectedCustomerType, setAffectedCustomerType] = useState(() => getStoredDraft()?.affectedCustomerType || '');
  const [frequency, setFrequency] = useState(() => getStoredDraft()?.frequency || 'Daily during peak seasons');
  const [summary, setSummary] = useState(() => getStoredDraft()?.summary || '');
  const [fullDescription, setFullDescription] = useState(() => getStoredDraft()?.fullDescription || '');
  const [existingAlternatives, setExistingAlternatives] = useState(() => getStoredDraft()?.existingAlternatives || '');
  const [whyAlternativesFail, setWhyAlternativesFail] = useState(() => getStoredDraft()?.whyAlternativesFail || '');
  
  // Evidence Source State
  const [evidenceTitle, setEvidenceTitle] = useState('');
  const [evidenceSourceType, setEvidenceSourceType] = useState<EvidenceSource['sourceType']>('Field Interview');
  const [evidenceSummary, setEvidenceSummary] = useState('');
  const [evidenceUrl, setEvidenceUrl] = useState('');

  // Market & Cost State
  const [costMin, setCostMin] = useState(30000);
  const [costMax, setCostMax] = useState(90000);
  const [potentialBuyers, setPotentialBuyers] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedProblem, setSubmittedProblem] = useState<Problem | null>(null);
  const [draftSaved, setDraftSaved] = useState(false);

  const saveDraft = () => {
    const draft = {
      title,
      sector,
      location,
      division,
      summary,
      fullDescription,
      affectedCustomerType,
      frequency,
      existingAlternatives,
      whyAlternativesFail
    };
    localStorage.setItem('supplierhut_submit_draft', JSON.stringify(draft));
    setDraftSaved(true);
    setTimeout(() => setDraftSaved(false), 2500);
  };

  // Duplicate suggestion check
  const duplicateSuggestions = existingProblems.filter((p) => {
    if (!title.trim() || title.length < 5) return false;
    const words = title.toLowerCase().split(/\s+/).filter(w => w.length > 3);
    return words.some(w => p.title.toLowerCase().includes(w));
  }).slice(0, 2);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !summary || !affectedCustomerType) {
      alert('Please complete the required fields.');
      return;
    }

    setIsSubmitting(true);

    const evidenceSources = evidenceTitle ? [
      {
        title: evidenceTitle,
        url: evidenceUrl || undefined,
        sourceDate: new Date().toISOString().split('T')[0],
        sourceType: evidenceSourceType,
        summary: evidenceSummary || 'Primary field submission notes.',
        verified: false
      }
    ] : [];

    const created = createProblemSubmission({
      title,
      sector,
      location,
      division,
      summary,
      fullDescription: fullDescription || summary,
      affectedCustomerType,
      frequency,
      existingAlternatives: existingAlternatives || 'Informal manual workarounds',
      whyAlternativesFail: whyAlternativesFail || 'High cost and unreliability',
      estimatedStartupCostBDT: {
        min: Number(costMin),
        max: Number(costMax),
        displayLabel: `৳${Number(costMin).toLocaleString()} - ৳${Number(costMax).toLocaleString()} BDT (Est.)`
      },
      potentialBuyers: potentialBuyers ? potentialBuyers.split(',').map(s => s.trim()) : [affectedCustomerType],
      evidenceSources,
      opportunityType: 'Open Problem'
    });

    localStorage.removeItem('supplierhut_submit_draft');
    setSubmittedProblem(created);
    setIsSubmitting(false);
  };

  if (submittedProblem) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border-2 border-emerald-400 shadow-sm space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <h1 className="text-3xl font-black text-slate-950">
            Problem Submitted for Research Review!
          </h1>

          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-left text-xs text-amber-950 space-y-1">
            <p className="font-bold">Status: Pending Review (Unverified)</p>
            <p>To preserve platform trust and prevent misinformation, new submissions undergo evidence verification before being marked as Validated. Your submission is now accessible in your Dashboard.</p>
          </div>

          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 text-left space-y-2">
            <span className="text-[11px] font-bold uppercase text-slate-400">Submission Title</span>
            <h3 className="text-base font-bold text-slate-900">{submittedProblem.title}</h3>
            <p className="text-xs text-slate-600">{submittedProblem.summary}</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href={`/problems/${submittedProblem.slug}`}
              className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 transition-colors shadow-2xs"
            >
              View Problem Page
            </Link>
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              Go to My Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="mb-8">
        <Link href="/#problems" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 mb-3">
          <ArrowLeft className="w-3.5 h-3.5" />
          Cancel and return home
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
              Submit a Problem in Bangladesh
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Document an operational bottleneck affecting your industry, farm, or locality.
            </p>
          </div>

          <button
            onClick={saveDraft}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 cursor-pointer shadow-2xs shrink-0 self-start sm:self-auto"
          >
            <Save className="w-3.5 h-3.5" />
            {draftSaved ? 'Draft Saved!' : 'Save Draft'}
          </button>
        </div>
      </div>

      {/* Wizard Steps indicator */}
      <div className="grid grid-cols-4 gap-2 mb-8 text-xs font-bold">
        {[
          { num: 1, label: '1. Basics & Location' },
          { num: 2, label: '2. Friction Details' },
          { num: 3, label: '3. Field Evidence' },
          { num: 4, label: '4. Review & Submit' }
        ].map((s) => (
          <div
            key={s.num}
            onClick={() => setStep(s.num)}
            className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
              step === s.num
                ? 'bg-amber-400 border-amber-500 text-slate-950 shadow-2xs font-extrabold'
                : step > s.num
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                : 'bg-white border-slate-200 text-slate-400'
            }`}
          >
            {s.label}
          </div>
        ))}
      </div>

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        {/* Step 1: Basics & Location */}
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-900 mb-1">
                Problem Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g., Perishable Produce Spoilage in Urban Neighborhood Grocery Retailers"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400 font-medium"
              />
              <p className="text-[11px] text-slate-400 mt-1">State what breaks, who is hurt, and where.</p>

              {/* Duplicate Detection Alert */}
              {duplicateSuggestions.length > 0 && (
                <div className="mt-3 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950">
                  <span className="font-bold block mb-1">Similar problems already listed:</span>
                  <ul className="space-y-1">
                    {duplicateSuggestions.map((dup) => (
                      <li key={dup.id}>
                        • <Link href={`/problems/${dup.slug}`} target="_blank" className="underline font-semibold">{dup.title}</Link> ({dup.location})
                      </li>
                    ))}
                  </ul>
                  <p className="text-[11px] text-amber-800 mt-1">Ensure your submission offers a unique angle or geography.</p>
                </div>
              )}
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1">
                  Sector / Industry <span className="text-rose-500">*</span>
                </label>
                <select
                  value={sector}
                  onChange={(e) => setSector(e.target.value as Sector)}
                  className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400 font-medium bg-white"
                >
                  {SECTORS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1">
                  Division in Bangladesh <span className="text-rose-500">*</span>
                </label>
                <select
                  value={division}
                  onChange={(e) => setDivision(e.target.value as Problem['division'])}
                  className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400 font-medium bg-white"
                >
                  {DIVISIONS.map((d) => (
                    <option key={d} value={d}>{d === 'National' ? 'National / All Bangladesh' : `${d} Division`}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-900 mb-1">
                Specific Location Details <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g., Mahasthangarh Wholesale Arat, Bogura or Mirpur Section 11, Dhaka"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1">
                  Who Experiences This Problem? <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., Smallholder vegetable farmers (2-5 bighas)"
                  value={affectedCustomerType}
                  onChange={(e) => setAffectedCustomerType(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1">
                  Frequency of Problem
                </label>
                <input
                  type="text"
                  placeholder="e.g., Daily during morning auction hours"
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Friction Details */}
        {step === 2 && (
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-900 mb-1">
                Short Summary (2-3 sentences) <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={2}
                placeholder="Summarize the core bottleneck concisely for problem directory cards..."
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                required
                className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-900 mb-1">
                Detailed Problem Narrative & Financial Toll
              </label>
              <textarea
                rows={5}
                placeholder="Explain the complete workflow: what happens, how much money or time is lost, and what breaks down..."
                value={fullDescription}
                onChange={(e) => setFullDescription(e.target.value)}
                className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-900 mb-1">
                Existing Alternatives / Workarounds
              </label>
              <textarea
                rows={2}
                placeholder="What do people do right now to cope with this? (e.g., buying dirty ice blocks, manual notebook registers)"
                value={existingAlternatives}
                onChange={(e) => setExistingAlternatives(e.target.value)}
                className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-rose-900 mb-1">
                Why Do Current Alternatives Fail?
              </label>
              <textarea
                rows={2}
                placeholder="Why hasn't the current workaround solved the root issue? (e.g., too expensive, melts too fast, high electricity bills)"
                value={whyAlternativesFail}
                onChange={(e) => setWhyAlternativesFail(e.target.value)}
                className="w-full px-4 py-2.5 text-xs rounded-xl border border-rose-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-400 bg-rose-50/40"
              />
            </div>
          </div>
        )}

        {/* Step 3: Evidence & Sources */}
        {step === 3 && (
          <div className="space-y-5">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
              <span className="font-bold text-slate-900 block mb-1">Evidence Standard:</span>
              SupplierHut rejects unsubstantiated claims. Please attach at least one field interview, government survey, NGO study, or newspaper investigation supporting your report.
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-900 mb-1">
                Evidence Source Title / Reference
              </label>
              <input
                type="text"
                placeholder="e.g., Field Interview with 12 Aratdars at Mahasthangarh Bazar"
                value={evidenceTitle}
                onChange={(e) => setEvidenceTitle(e.target.value)}
                className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1">
                  Source Type
                </label>
                <select
                  value={evidenceSourceType}
                  onChange={(e) => setEvidenceSourceType(e.target.value as EvidenceSource['sourceType'])}
                  className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
                >
                  <option value="Field Interview">Field Interview / Direct Survey</option>
                  <option value="Government Report">Government / BBS Report</option>
                  <option value="Academic Study">University / Academic Study</option>
                  <option value="Industry Survey">Industry / Trade Association Survey</option>
                  <option value="NGO Audit">NGO or Development Bank Audit</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1">
                  External URL / Report Link (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={evidenceUrl}
                  onChange={(e) => setEvidenceUrl(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-900 mb-1">
                Summary of Evidence / Key Data Points
              </label>
              <textarea
                rows={3}
                placeholder="What specific numbers or observations were verified? (e.g., 14.6% produce weight loss recorded over 30 days)"
                value={evidenceSummary}
                onChange={(e) => setEvidenceSummary(e.target.value)}
                className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1">
                  Est. Minimum Startup Cost (৳ BDT)
                </label>
                <input
                  type="number"
                  step={5000}
                  value={costMin}
                  onChange={(e) => setCostMin(Number(e.target.value))}
                  className="w-full px-4 py-2 text-xs rounded-xl border border-slate-200 text-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1">
                  Est. Maximum Startup Cost (৳ BDT)
                </label>
                <input
                  type="number"
                  step={5000}
                  value={costMax}
                  onChange={(e) => setCostMax(Number(e.target.value))}
                  className="w-full px-4 py-2 text-xs rounded-xl border border-slate-200 text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-900 mb-1">
                Potential Target Buyers / Paying Segments (Comma-separated)
              </label>
              <input
                type="text"
                placeholder="e.g. Upazila cold storage owners, Vegetable wholesalers, Municipal transport contractors"
                value={potentialBuyers}
                onChange={(e) => setPotentialBuyers(e.target.value)}
                className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
          </div>
        )}

        {/* Step 4: Review & Live Card Preview */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-xs text-amber-950 flex items-start gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-amber-900">Platform Transparency Notice:</strong>
                Submitting this problem registers it under your account as <span className="font-bold underline">Pending Review (Unverified)</span>. Our research and moderation team will audit the source links before validating.
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Live Directory Card Preview</h4>
              
              <div className="max-w-md mx-auto bg-amber-50/70 border-2 border-amber-300 rounded-2xl overflow-hidden shadow-sm">
                <div className="bg-amber-400 px-4 py-2.5 flex items-center justify-between text-xs font-black uppercase text-slate-950">
                  <span>{sector}</span>
                  <span>{location}</span>
                </div>
                <div className="p-5 space-y-3">
                  <div className="text-[11px] font-bold text-slate-600">
                    Status: Unverified (Pending Review)
                  </div>
                  <h3 className="text-base font-extrabold text-slate-950 leading-snug">
                    {title || 'Your Problem Title Here'}
                  </h3>
                  <p className="text-xs text-slate-700 line-clamp-3">
                    {summary || 'Your short problem summary will appear here.'}
                  </p>
                  <div className="pt-3 border-t border-amber-200 text-[11px]">
                    <span className="font-bold text-slate-900">Affected:</span> {affectedCustomerType || 'Target customer'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Wizard Controls */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-100">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Previous Step
            </button>
          ) : <div />}

          {step < 4 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 transition-colors shadow-2xs cursor-pointer"
            >
              Next Step
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 px-6 py-3 text-xs font-bold rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors shadow-sm cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 text-slate-950" />
              {isSubmitting ? 'Submitting...' : 'Submit Problem for Review'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
