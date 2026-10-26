import React from 'react';
import { ShieldCheck, Scale, Target } from 'lucide-react';

export default function GuidelinesPage() {
  return (
    <div className="py-12 sm:py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-12">
        <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-2.5 py-1 rounded">
          Platform Governance
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-950 mt-3 mb-3">
          Research & Verification Guidelines
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          SupplierHut maintains strict standards to ensure every listed problem represents genuine operational friction in Bangladesh, with defensible unit economics and zero fabricated demand.
        </p>
      </div>

      <div className="space-y-10 text-sm text-slate-700 leading-relaxed">
        {/* Section 1 */}
        <section className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h2>1. Evidence & Validation Tiers</h2>
          </div>
          <p>
            Problems progress through four clear tiers based on independent verification:
          </p>

          <div className="grid sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-slate-900 block mb-1">Tier 1: Unverified</span>
              <p className="text-slate-600">Freshly submitted community report. Under preliminary audit by research staff. Not yet labeled as confirmed market fact.</p>
            </div>
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-300">
              <span className="font-bold text-amber-900 block mb-1">Tier 2: Researching</span>
              <p className="text-slate-700">Secondary data exists (e.g. news reports), and field interviews are actively scheduled across target Upazilas.</p>
            </div>
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-300">
              <span className="font-bold text-blue-900 block mb-1">Tier 3: Evidence Supported</span>
              <p className="text-slate-700">Supported by published government surveys (BBS, DAE, DGHS) or recorded transcripts from $\ge 15$ affected businesses.</p>
            </div>
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300">
              <span className="font-bold text-emerald-900 block mb-1">Tier 4: Validated</span>
              <p className="text-slate-700">Demonstrated customer willingness to pay through pilot deposits, paid trials, or sponsor-funded challenge commitments.</p>
            </div>
          </div>
        </section>

        {/* Section 2: TAM/SAM Rules */}
        <section id="tam" className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
            <Target className="w-5 h-5 text-amber-600" />
            <h2>2. TAM / SAM Market Sizing Discipline</h2>
          </div>
          <p>
            We strictly forbid speculative global market figures (e.g., &quot;The global cold chain is $300B&quot;). All market sizing on SupplierHut must:
          </p>
          <ul className="space-y-2 text-xs text-slate-700 list-disc list-inside">
            <li>Be calculated in Bangladeshi Taka (৳ BDT) reflecting local price points.</li>
            <li>Document the exact unit count (e.g., &quot;45,000 neighborhood grocers in Dhaka City Corporation&quot;).</li>
            <li>State the realistic annual hardware or subscription fee that an SME can absorb without negative ROI.</li>
            <li>Explicitly label forecasts as estimates and separate hypotheses from verified historical spending.</li>
          </ul>
        </section>

        {/* Section 3: Paid Challenges */}
        <section id="challenges" className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
            <Scale className="w-5 h-5 text-purple-600" />
            <h2>3. Paid Challenge Governance & IP Rules</h2>
          </div>
          <p>
            Organizations posting Paid Challenges must deposit or verify 100% of award funding with clear milestone inspection criteria before publishing.
          </p>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
            <p><strong>Intellectual Property:</strong> Unless explicitly agreed otherwise under written contract, solvers retain complete copyright and design rights to their prototypes. Sponsoring organizations receive license rights to test and procure initial units.</p>
            <p><strong>Anti-Exploitation Policy:</strong> Sponsors may not use challenge submissions to extract free consulting or copy intellectual property without selecting or compensating solvers.</p>
          </div>
        </section>
      </div>
    </div>
  );
}
