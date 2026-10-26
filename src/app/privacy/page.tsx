import React from 'react';

export default function PrivacyPage() {
  return (
    <div className="py-12 sm:py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-xs text-slate-700 leading-relaxed space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-950 mb-2">Privacy & Research Data Policy</h1>
        <p className="text-slate-500">Effective Date: October 2026</p>
      </div>

      <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <h2 className="text-sm font-bold text-slate-900">1. Information We Collect</h2>
        <p>
          We collect basic user profile information (name, email, role, skills, location in Bangladesh) and submitted problem documentation. We do not sell personal data to advertisers or third-party brokers.
        </p>
      </section>

      <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <h2 className="text-sm font-bold text-slate-900">2. Field Research Anonymity</h2>
        <p>
          Problem submitters may request anonymity for their personal details while publishing field findings to protect local farming cooperatives or factory workers from commercial retaliation.
        </p>
      </section>

      <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <h2 className="text-sm font-bold text-slate-900">3. Cookies & Session Storage</h2>
        <p>
          We use browser session storage and essential cookies to maintain role state, saved problems, and draft submissions across page visits.
        </p>
      </section>
    </div>
  );
}
