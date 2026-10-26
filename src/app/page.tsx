import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ProblemGridSection from '@/components/ProblemGridSection';
import { getStoredProblems } from '@/lib/data-store';
import { 
  Sparkles, 
  ShieldCheck, 
  TrendingUp, 
  Search, 
  Calendar,
  Building,
  Target,
  Wrench,
  CheckCircle,
  FileSearch
} from 'lucide-react';

export default async function HomePage() {
  const problems = getStoredProblems();
  const paidChallenges = problems.filter((p) => p.opportunityType === 'Paid Challenge' && p.paidChallenge);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-amber-300 selection:text-slate-950">
      {/* 1. Hero Section */}
      <section className="relative bg-white border-b border-slate-200 overflow-hidden pt-12 pb-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            {/* Hero Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider border border-amber-300">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                Bangladesh Problem Discovery & Income Platform
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-950 leading-[1.08] text-balance">
                Bangladesh Has Problems. <br />
                <span className="bg-gradient-to-r from-amber-500 via-amber-600 to-emerald-600 bg-clip-text text-transparent">
                  You Can Build Solutions.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed">
                Discover real, documented problems affecting agriculture, healthcare, retail, and logistics across Bangladesh. Research defensible market viability, test customer willingness to pay, and participate in structured paid challenges.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <Link
                  href="/#problems"
                  className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm text-slate-950 bg-amber-400 hover:bg-amber-300 transition-colors shadow-sm"
                >
                  <Search className="w-4 h-4 text-slate-950" />
                  Explore Opportunities
                </Link>
                <Link
                  href="/submit"
                  className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors shadow-sm"
                >
                  <Wrench className="w-4 h-4 text-slate-950" />
                  Submit a Problem
                </Link>
              </div>

              {/* Trust Callout */}
              <div className="pt-4 flex flex-col sm:flex-row sm:items-center gap-4 text-xs text-slate-500 border-t border-slate-100">
                <div className="flex items-center gap-1.5 font-medium text-slate-700">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Sourced Field Evidence</span>
                </div>
                <span className="hidden sm:inline text-slate-300">·</span>
                <div className="flex items-center gap-1.5 font-medium text-slate-700">
                  <TrendingUp className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Defensible TAM/SAM in BDT (৳)</span>
                </div>
                <span className="hidden sm:inline text-slate-300">·</span>
                <div className="flex items-center gap-1.5 font-medium text-slate-700">
                  <Sparkles className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>Verified Escrow Challenges</span>
                </div>
              </div>
            </div>

            {/* Hero Right Visual: Authentic High-Resolution Photography */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden border-2 border-slate-900 shadow-xl bg-slate-900 group">
                <div className="relative aspect-[16/10] w-full">
                  <Image
                    src="/images/hero_bangladesh_innovation_1792999684164.jpg"
                    alt="Young Bangladeshi software engineers and startup researchers collaborating in Dhaka"
                    fill
                    className="object-cover group-hover:scale-102 transition-transform duration-500"
                    priority
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>
                </div>

                <div className="absolute bottom-0 inset-x-0 p-5 text-white">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 mb-1 block">
                    Field Research & Problem Mapping
                  </span>
                  <p className="text-xs text-slate-200 font-medium leading-normal">
                    Real solutions built for real Bangladeshi enterprises — from northern vegetable arats to Old Dhaka grocery networks.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Honest Market Standard Disclaimer Banner */}
      <section className="bg-slate-950 text-slate-300 py-3.5 px-4 text-xs border-y border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="bg-amber-400 text-slate-950 font-black px-1.5 py-0.5 rounded text-[10px] uppercase">
              Notice
            </span>
            <p className="text-slate-300">
              <strong className="text-white">Honest Opportunity Standard:</strong> A potential market is not guaranteed revenue. We do not claim market demand without evidence. All financial figures are labeled estimates or verified sponsor commitments.
            </p>
          </div>
          <Link href="/guidelines" className="text-amber-400 hover:underline font-semibold whitespace-nowrap">
            Read Evidence Criteria &rarr;
          </Link>
        </div>
      </section>

      {/* 3. The Core Problem Cards Grid (From Sketch) */}
      <ProblemGridSection initialProblems={problems} />

      {/* 4. Verified Paid Challenges Spotlight */}
      <section id="challenges" className="py-16 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                Verified Sponsored Opportunities
              </div>
              <h2 className="text-3xl font-extrabold text-slate-950 tracking-tight">
                Active Paid Challenges
              </h2>
              <p className="text-sm text-slate-600 mt-1 max-w-2xl">
                These opportunities have confirmed sponsor funding held in escrow. Solvers submit proposals and receive milestone-based payouts upon technical deliverable approval.
              </p>
            </div>
            <Link
              href="/dashboard"
              className="text-xs font-bold text-slate-900 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-lg transition-colors whitespace-nowrap shrink-0"
            >
              View My Applications &rarr;
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {paidChallenges.map((problem) => {
              const chal = problem.paidChallenge!;
              return (
                <div
                  key={problem.id}
                  className="bg-emerald-50/40 rounded-2xl border-2 border-emerald-500/40 p-6 flex flex-col justify-between shadow-xs hover:border-emerald-500 transition-all"
                >
                  <div>
                    {/* Header: Verified Sponsor & Deadline */}
                    <div className="flex items-center justify-between gap-2 mb-3 text-xs">
                      <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                        <Building className="w-4 h-4 text-emerald-600" />
                        <span>{chal.sponsorOrganization}</span>
                      </div>
                      <div className="flex items-center gap-1 text-slate-500 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>Deadline: {chal.applicationDeadline}</span>
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-slate-950 mb-2">
                      {problem.title}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                      {problem.summary}
                    </p>

                    {/* Funding & Milestones Strip */}
                    <div className="bg-white rounded-xl p-4 border border-emerald-200 mb-4 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 font-medium">Confirmed Challenge Fund:</span>
                        <span className="text-lg font-black text-emerald-700 tabular-nums">
                          ৳{chal.fundingConfirmedBDT.toLocaleString()} BDT
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 border-t border-slate-100 pt-2">
                        {chal.escrowStatusNote}
                      </div>
                    </div>

                    {/* Deliverables snippet */}
                    <div className="space-y-1.5 text-xs text-slate-700 mb-6">
                      <span className="font-bold text-slate-900 block text-xs">Core Deliverables:</span>
                      {chal.deliverables.slice(0, 2).map((deliv, idx) => (
                        <div key={idx} className="flex items-start gap-1.5">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{deliv}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-emerald-200 flex items-center justify-between gap-3">
                    <span className="text-xs text-slate-500 font-medium">
                      {chal.applicationsCount} proposals submitted · {chal.openPositionsOrSlots} award slot
                    </span>
                    <Link
                      href={`/problems/${problem.slug}#propose`}
                      className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-2xs"
                    >
                      Apply / Submit Proposal
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. How It Works: The 5-Step Pipeline */}
      <section id="how-it-works" className="py-16 sm:py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-amber-400 text-xs font-black uppercase tracking-widest block mb-2">
              METHODOLOGY
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              From Raw Bangladesh Problem to Viable Income
            </h2>
            <p className="text-slate-400 text-sm mt-2">
              No guaranteed get-rich promises. A disciplined, transparent path to building products people actually pay for.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              {
                step: '01',
                title: 'Discover',
                desc: 'Explore real, unembellished friction points reported by farmers, SME merchants, clinics, and municipal workers.',
                icon: FileSearch
              },
              {
                step: '02',
                title: 'Research',
                desc: 'Review verified field data, TAM-SAM sizing logic in BDT (৳), failure modes of past attempts, and interview transcripts.',
                icon: Target
              },
              {
                step: '03',
                title: 'Build MVP',
                desc: 'Design low-cost prototypes using local components sourcable in Nawabpur, Dholaikhal, or standard cloud stacks.',
                icon: Wrench
              },
              {
                step: '04',
                title: 'Validate',
                desc: 'Execute field interviews and testing with target customers to verify true willingness to pay before scaling.',
                icon: CheckCircle
              },
              {
                step: '05',
                title: 'Earn & Scale',
                desc: 'Launch an independent commercial venture, or win milestone disbursements from verified sponsored challenges.',
                icon: TrendingUp
              }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.step}
                  className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700/80 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-mono text-xl font-black text-amber-400">{item.step}</span>
                      <Icon className="w-5 h-5 text-emerald-400" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-xs text-slate-300 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. Participant Roles: Submitters, Solvers & Sponsors */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-extrabold text-slate-950">Who Participates on SupplierHut</h2>
            <p className="text-sm text-slate-600 mt-1">Connecting the entire Bangladesh innovation value chain</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-2">Problem Submitters</h3>
              <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                Farmers, SME owners, logistics operators, doctors, and civic workers who face day-to-day operational pain points.
              </p>
              <ul className="text-xs text-slate-700 space-y-2">
                <li>• Document friction with field photos & evidence</li>
                <li>• Retain priority access to early solutions</li>
                <li>• Zero fee to report community issues</li>
              </ul>
            </div>

            <div className="p-6 rounded-2xl bg-amber-50/70 border border-amber-300">
              <h3 className="text-lg font-bold text-slate-900 mb-2">Solvers & Builders</h3>
              <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                Engineers, researchers, students, freelancers, and entrepreneurs looking for genuine market demand instead of generic ideas.
              </p>
              <ul className="text-xs text-slate-700 space-y-2">
                <li>• Access structured customer interview questions</li>
                <li>• Submit solution proposals and team up</li>
                <li>• Compete for verified cash challenge awards</li>
              </ul>
            </div>

            <div className="p-6 rounded-2xl bg-emerald-50/70 border border-emerald-300">
              <h3 className="text-lg font-bold text-slate-900 mb-2">Organizations & Clients</h3>
              <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                NGOs, corporations, CSR funds, and government agencies seeking practical prototypes to solve systemic challenges.
              </p>
              <ul className="text-xs text-slate-700 space-y-2">
                <li>• Publish verified paid challenges with clear terms</li>
                <li>• Review vetted technical proposals</li>
                <li>• Pay milestone disbursements upon verification</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FAQs */}
      <section className="py-16 bg-slate-50 border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-slate-950">Frequently Asked Questions</h2>
            <p className="text-sm text-slate-600 mt-1">Honest answers about opportunities, funding, and IP terms</p>
          </div>

          <div className="space-y-4 text-left">
            {[
              {
                q: 'Is income guaranteed if I work on an open problem?',
                a: 'No. Open problems represent market demand opportunities, not employment contracts. Your income depends entirely on building a viable product, customer willingness to pay, and your operational execution.'
              },
              {
                q: 'How are Paid Challenges verified before being listed?',
                a: 'Before any challenge is marked as "Paid Challenge", our admin team verifies the sponsoring organization and confirms that funds are committed in project reserves. We do not list speculative bounties.'
              },
              {
                q: 'What currency are opportunities and startup costs calculated in?',
                a: 'All figures on SupplierHut are calibrated in Bangladeshi Taka (৳ BDT). Market sizing reflects Bangladesh-specific purchasing power and local supply chains.'
              },
              {
                q: 'Who owns the intellectual property (IP) of solutions created?',
                a: 'For open problems, solvers retain 100% of their IP. For paid challenges, terms vary by sponsor but standard terms grant solvers the core IP with the sponsor receiving non-exclusive deployment rights.'
              },
              {
                q: 'How do I submit a new problem?',
                a: 'Click "Submit a Problem" in the top bar. You will be guided through documenting who experiences the problem, frequency, existing alternatives, and supporting evidence. Submissions enter Pending Review before publishing.'
              }
            ].map((faq, idx) => (
              <div key={idx} className="bg-white rounded-xl p-5 border border-slate-200">
                <h3 className="text-sm font-bold text-slate-950 mb-1">{faq.q}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
