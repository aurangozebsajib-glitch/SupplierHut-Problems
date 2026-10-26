'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { SignUp } from '@clerk/nextjs';
import { ArrowLeft, KeyRound, ExternalLink, ShieldCheck } from 'lucide-react';

const isClerkConfigured = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

function SignUpContent() {
  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-slate-950 mb-2">
          <span className="bg-amber-400 px-2 py-0.5 rounded font-black">SUPPLIERHUT</span>
          <span className="text-emerald-600 font-bold">SOLUTIONS</span>
        </div>
        <h1 className="text-2xl font-black text-slate-950">
          Create Your Account
        </h1>
        <p className="text-xs text-slate-600 mt-1">
          Join problem owners, solvers, and researchers across Bangladesh
        </p>
      </div>

      {isClerkConfigured ? (
        <div className="flex justify-center">
          <SignUp 
            path="/sign-up" 
            routing="path" 
            signInUrl="/sign-in" 
            fallbackRedirectUrl="/"
          />
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <KeyRound className="w-6 h-6" />
          </div>
          
          <div className="text-center space-y-1">
            <h2 className="text-base font-bold text-slate-900">
              Clerk Keys Required
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Connect your Clerk application <strong className="text-slate-900">SupplierHut Problems</strong> by placing your keys in Vercel or <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-800 font-mono text-[11px]">.env.local</code>.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
            <div className="font-semibold text-slate-800 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              How to retrieve your keys:
            </div>
            <ol className="list-decimal pl-4 space-y-1.5 text-slate-600">
              <li>Log in to <a href="https://dashboard.clerk.com" target="_blank" rel="noreferrer" className="text-emerald-700 underline font-medium inline-flex items-center gap-0.5">Clerk Dashboard <ExternalLink className="w-2.5 h-2.5" /></a></li>
              <li>Select your application: <strong>SupplierHut Problems</strong></li>
              <li>Go to <strong>API Keys</strong> under Configure in the sidebar</li>
              <li>Copy <strong>Publishable key</strong> and <strong>Secret key</strong> into Vercel or <code className="bg-slate-200 px-1 py-0.2 rounded font-mono">.env.local</code></li>
            </ol>
          </div>

          <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs">
            <p className="font-bold mb-1">Add to .env.local or Vercel:</p>
            <pre className="font-mono text-[11px] bg-white p-2 rounded border border-amber-200 overflow-x-auto text-slate-800">
{`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/`}
            </pre>
          </div>

          <div className="text-center pt-2">
            <Link 
              href="/dashboard"
              className="inline-flex items-center justify-center px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-bold rounded-lg transition-colors w-full shadow-2xs"
            >
              Continue to Dashboard with Standalone Session
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SignUpPage() {
  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Link 
          href="/" 
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Homepage
        </Link>
      </div>

      <Suspense fallback={
        <div className="w-full max-w-md h-64 flex flex-col items-center justify-center bg-white rounded-2xl border border-slate-200 p-8">
          <div className="w-8 h-8 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-xs font-semibold text-slate-500">Loading sign-up interface...</p>
        </div>
      }>
        <SignUpContent />
      </Suspense>
    </div>
  );
}
