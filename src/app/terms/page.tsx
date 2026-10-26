import React from 'react';

export default function TermsPage() {
  return (
    <div className="py-12 sm:py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-xs text-slate-700 leading-relaxed space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-950 mb-2">Terms of Service & Earning Disclaimer</h1>
        <p className="text-slate-500">Last updated: October 2026 · Governed by the Laws of Bangladesh</p>
      </div>

      <div className="bg-amber-50 p-5 rounded-2xl border border-amber-300 text-amber-950 font-medium">
        <strong className="block text-amber-900 mb-1">Critical Earnings Disclaimer:</strong>
        SupplierHut Solutions does not guarantee income, business profitability, venture investment, or employment. Listed open problems represent research opportunities and observed market demand. Users participate independently and assume all commercial and technical risks.
      </div>

      <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <h2 className="text-sm font-bold text-slate-900">1. Acceptance of Terms</h2>
        <p>
          By accessing or submitting information to SupplierHut, you agree to comply with these terms, honest research standards, and moderation guidelines. If you do not accept these terms, you must discontinue use of the platform.
        </p>
      </section>

      <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <h2 className="text-sm font-bold text-slate-900">2. Accuracy of Problem Submissions</h2>
        <p>
          Users who submit problem reports warrant that information provided is grounded in firsthand observation or documented evidence. Knowingly fabricating statistics, citing nonexistent surveys, or submitting duplicate commercial spam will result in immediate suspension.
        </p>
      </section>

      <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <h2 className="text-sm font-bold text-slate-900">3. Paid Challenges & Payout Disbursement</h2>
        <p>
          Submission or selection of a proposal does not constitute financial transfer. Payouts for verified Paid Challenges are executed in Bangladeshi Taka (৳ BDT) exclusively upon verified milestone sign-off by the designated sponsoring organization. We do not operate an unregulated escrow or banking institution.
        </p>
      </section>

      <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <h2 className="text-sm font-bold text-slate-900">4. Intellectual Property</h2>
        <p>
          Solvers retain copyright and ownership of code, CAD designs, and hardware blueprints created for open problems. Paid challenges govern IP through specific sponsor terms specified prior to proposal submission.
        </p>
      </section>
    </div>
  );
}
