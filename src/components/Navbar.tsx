'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import RoleSwitcher from './RoleSwitcher';
import ClerkAuthControls from './ClerkAuthControls';
import { getCurrentUser } from '@/lib/data-store';
import { UserProfile } from '@/types';
import { Menu, X, PlusCircle, ShieldAlert } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const [currentUser, setUser] = useState<UserProfile>(() => getCurrentUser());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleAuth = (e: Event) => {
      const customEvent = e as CustomEvent<UserProfile>;
      if (customEvent.detail) {
        setUser(customEvent.detail);
      }
    };
    window.addEventListener('supplierhut_auth_changed', handleAuth);
    return () => window.removeEventListener('supplierhut_auth_changed', handleAuth);
  }, []);

  const navLinks = [
    { label: 'Explore Problems', href: '/#problems' },
    { label: 'Categories', href: '/#categories' },
    { label: 'Paid Challenges', href: '/#challenges' },
    { label: 'How It Works', href: '/#how-it-works' },
    { label: 'Dashboard', href: '/dashboard' },
  ];

  const isAdmin = currentUser.role === 'admin';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Brand Wordmark (Single text element) */}
          <Link 
            href="/" 
            className="flex items-center gap-1.5 text-xl font-extrabold tracking-tight text-slate-900 whitespace-nowrap shrink-0 group"
          >
            <span className="bg-amber-400 text-slate-950 px-2 py-0.5 rounded font-black tracking-tighter">
              SUPPLIERHUT
            </span>
            <span className="text-emerald-600 font-bold tracking-tight">
              SOLUTIONS
            </span>
          </Link>

          {/* Zone 2: 4-5 Clean single-line nav links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`hover:text-slate-950 transition-colors whitespace-nowrap shrink-0 ${
                    active ? 'text-slate-950 font-semibold' : ''
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            {isAdmin && (
              <Link
                href="/admin"
                className="flex items-center gap-1 text-amber-700 font-semibold hover:text-amber-800 transition-colors whitespace-nowrap shrink-0"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                Admin Panel
              </Link>
            )}
          </nav>

          {/* Zone 3: Primary Action & Role Switcher & Auth */}
          <div className="hidden sm:flex items-center gap-2.5 shrink-0">
            <RoleSwitcher />
            <ClerkAuthControls />
            <Link
              href="/submit"
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-950 bg-emerald-500 hover:bg-emerald-400 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-xs"
            >
              <PlusCircle className="w-3.5 h-3.5 text-slate-950" />
              Submit Problem
            </Link>
          </div>

          {/* Mobile hamburger */}
          <div className="flex sm:hidden items-center gap-2">
            <ClerkAuthControls />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-4 space-y-2 text-sm font-medium text-slate-700">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 px-3 rounded-lg hover:bg-slate-50 hover:text-slate-950"
            >
              {link.label}
            </Link>
          ))}
          {isAdmin && (
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 px-3 rounded-lg bg-amber-50 text-amber-800 font-semibold"
            >
              Admin Panel
            </Link>
          )}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Test Role Switcher:</span>
            <RoleSwitcher />
          </div>
          <div className="pt-1">
            <Link
              href="/submit"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-1.5 py-2.5 px-4 text-xs font-bold text-slate-950 bg-emerald-500 rounded-lg shadow-xs"
            >
              <PlusCircle className="w-4 h-4" />
              Submit a Problem
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
