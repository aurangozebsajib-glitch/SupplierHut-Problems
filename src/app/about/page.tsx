import React from 'react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="py-12 sm:py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-12">
        <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-2.5 py-1 rounded">
          About SupplierHut
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-950 mt-3 mb-4 tracking-tight">
          Solving Real Friction Points in Bangladesh
        </h1>
        <p className="text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          We connect problem owners, field researchers, software and hardware engineers, and verified sponsors to turn real systemic bottlenecks into viable livelihoods.
        </p>
      </div>

      <div className="space-y-10 text-sm text-slate-700 leading-relaxed">
        {/* Story */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs space-y-4">
          <h2 className="text-xl font-bold text-slate-950">Why SupplierHut Exists</h2>
          <p>
            Too many brilliant Bangladeshi developers, engineers, and graduates build clones of Silicon Valley apps that solve problems that do not exist in Bangladesh. Meanwhile, vegetable farmers in Bogura lose 25% of their crop to field heat, rural maternity clinics wait 4 days for ultrasound reports, and small grocery merchants throw out wilting produce.
          </p>
          <p>
            SupplierHut was founded on a simple premise: <strong className="text-slate-950">A business is only as strong as the problem it solves.</strong> Instead of guessing, builders can discover verified, field-researched friction points with real customers who are already paying for substandard workarounds.
          </p>
        </div>

        {/* Core Principles */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold mb-3">
              1
            </div>
            <h3 className="text-base font-bold text-slate-950">Zero Fabricated Demand</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              We never promise guaranteed income, pretend investor interest exists, or invent market statistics. Every opportunity is grounded in documented secondary data and direct interviews.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold mb-3">
              2
            </div>
            <h3 className="text-base font-bold text-slate-950">Locally Sourcable Solutions</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              We champion solutions using components that can be procured in Nawabpur, Dholaikhal, or standard local cloud providers without requiring impossible foreign imports.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-slate-950 text-white rounded-3xl p-8 sm:p-10 text-center space-y-4">
          <h3 className="text-2xl font-black text-white">Join the Problem-Solving Community</h3>
          <p className="text-xs text-slate-300 max-w-xl mx-auto">
            Whether you are a researcher in Bogura, an engineer in Dhaka, or an organization looking to sponsor a paid challenge, your participation matters.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/#problems"
              className="px-6 py-3 rounded-xl text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 transition-colors"
            >
              Explore Active Problems
            </Link>
            <Link
              href="/submit"
              className="px-6 py-3 rounded-xl text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors"
            >
              Submit a Problem
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
