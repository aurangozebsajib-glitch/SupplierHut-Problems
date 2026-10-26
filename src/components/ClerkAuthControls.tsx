'use client';

import React from 'react';
import Link from 'next/link';
import { Show, UserButton, SignInButton } from '@clerk/nextjs';
import { LogIn } from 'lucide-react';

const isClerkKeyConfigured = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

function ActiveClerkControls() {
  return (
    <div className="flex items-center gap-2">
      <Show when="signed-out">
        <SignInButton mode="modal">
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-950 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer">
            <LogIn className="w-3.5 h-3.5" />
            Sign In
          </button>
        </SignInButton>
      </Show>
      <Show when="signed-in">
        <div className="flex items-center gap-2 pl-1">
          <UserButton 
            appearance={{
              elements: {
                avatarBox: 'w-7 h-7 ring-2 ring-amber-400'
              }
            }}
          />
        </div>
      </Show>
    </div>
  );
}

function FallbackAuthControls() {
  return (
    <Link
      href="/sign-in"
      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-950 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
      title="Configure Clerk or test authentication"
    >
      <LogIn className="w-3.5 h-3.5" />
      Sign In
    </Link>
  );
}

export default function ClerkAuthControls() {
  if (isClerkKeyConfigured) {
    return <ActiveClerkControls />;
  }

  return <FallbackAuthControls />;
}
