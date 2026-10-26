import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Wordmark & Statement */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-1.5 text-lg font-extrabold text-white mb-3">
              <span className="bg-amber-400 text-slate-950 px-2 py-0.5 rounded font-black tracking-tighter text-sm">
                SUPPLIERHUT
              </span>
              <span className="text-emerald-400 font-bold tracking-tight">
                SOLUTIONS
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              Bangladesh problem discovery, market research, and income opportunity platform. Connecting problem owners, researchers, entrepreneurs, and verified sponsors.
            </p>
            <div className="mt-4 text-[11px] text-slate-500">
              Primary Currency: Bangladeshi Taka (৳ BDT) <br />
              Timezone: Asia/Dhaka (BST)
            </div>
          </div>

          {/* Col 2: Platform Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
              Platform Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/#problems" className="hover:text-amber-400 transition-colors">
                  Explore Problems
                </Link>
              </li>
              <li>
                <Link href="/#categories" className="hover:text-amber-400 transition-colors">
                  Problem Sectors
                </Link>
              </li>
              <li>
                <Link href="/#challenges" className="hover:text-amber-400 transition-colors">
                  Verified Paid Challenges
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="hover:text-amber-400 transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/submit" className="hover:text-amber-400 transition-colors">
                  Submit a Problem
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-amber-400 transition-colors">
                  Solver Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Research & Verification */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
              Standards & Guidelines
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/guidelines" className="hover:text-amber-400 transition-colors">
                  Evidence Standards
                </Link>
              </li>
              <li>
                <Link href="/guidelines#tam" className="hover:text-amber-400 transition-colors">
                  TAM/SAM Sizing Rules
                </Link>
              </li>
              <li>
                <Link href="/guidelines#challenges" className="hover:text-amber-400 transition-colors">
                  Paid Challenge Terms
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-amber-400 transition-colors">
                  About Our Mission
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-amber-400 transition-colors">
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Trust & Ethics Policy */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
              Trust & Legal Notices
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/terms" className="hover:text-amber-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-amber-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/report" className="text-rose-400 hover:text-rose-300 transition-colors">
                  Report Abuse / Misleading Data
                </Link>
              </li>
            </ul>
            <div className="mt-4 p-3 bg-slate-900 rounded-lg border border-slate-800 text-[11px] text-slate-400 leading-normal">
              <span className="font-semibold text-slate-300">Honest Market Notice:</span> A potential market is not a paying customer. We never guarantee business income or fabricate investor demand.
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 SupplierHut Solutions Bangladesh. Built for Bangladesh innovators and problem solvers.</p>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="hover:text-slate-400">Terms</Link>
            <span aria-hidden="true">·</span>
            <Link href="/privacy" className="hover:text-slate-400">Privacy</Link>
            <span aria-hidden="true">·</span>
            <Link href="/guidelines" className="hover:text-slate-400">Guidelines</Link>
            <span aria-hidden="true">·</span>
            <Link href="/report" className="hover:text-slate-400">Report Abuse</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
