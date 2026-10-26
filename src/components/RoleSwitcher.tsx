'use client';

import React, { useEffect, useState } from 'react';
import { UserProfile, Role } from '@/types';
import { getCurrentUser, setCurrentUser, getAllUsers } from '@/lib/data-store';
import { UserCheck, Shield, Wrench, FileText, Building2, ChevronDown } from 'lucide-react';

export default function RoleSwitcher() {
  const [currentUser, setUser] = useState<UserProfile>(() => getCurrentUser());
  const [isOpen, setIsOpen] = useState(false);
  const users = getAllUsers();

  useEffect(() => {
    const handleAuthChange = (e: Event) => {
      const customEvent = e as CustomEvent<UserProfile>;
      if (customEvent.detail) {
        setUser(customEvent.detail);
      }
    };

    window.addEventListener('supplierhut_auth_changed', handleAuthChange);
    return () => window.removeEventListener('supplierhut_auth_changed', handleAuthChange);
  }, []);

  const getRoleIcon = (role: Role) => {
    switch (role) {
      case 'admin':
        return <Shield className="w-3.5 h-3.5 text-amber-500" />;
      case 'solver':
        return <Wrench className="w-3.5 h-3.5 text-emerald-500" />;
      case 'submitter':
        return <FileText className="w-3.5 h-3.5 text-blue-500" />;
      case 'organization':
        return <Building2 className="w-3.5 h-3.5 text-purple-500" />;
      default:
        return <UserCheck className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  const getRoleBadgeColor = (role: Role) => {
    switch (role) {
      case 'admin':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'solver':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'submitter':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'organization':
        return 'text-purple-700 bg-purple-50 border-purple-200';
      default:
        return 'text-slate-700 bg-slate-50 border-slate-200';
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs text-slate-800 transition-colors shadow-2xs cursor-pointer"
        title="Switch user role to test Admin, Solver, Submitter or Sponsor flows"
      >
        <div className="flex items-center gap-1.5">
          {getRoleIcon(currentUser.role)}
          <span className="font-semibold capitalize text-slate-900">{currentUser.role}:</span>
          <span className="font-medium text-slate-600 truncate max-w-[110px]">{currentUser.name.split(' ')[0]}</span>
        </div>
        <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50 text-xs animate-in fade-in zoom-in-95 duration-100">
            <div className="px-2 py-1.5 border-b border-slate-100 mb-1">
              <p className="font-bold text-slate-900">Switch Testing Role</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Test role-specific workflows (Admin review, proposal submission, problem posting).</p>
            </div>

            <div className="space-y-1">
              {users.map((u) => (
                <button
                  key={u.id}
                  onClick={() => {
                    setCurrentUser(u);
                    setUser(u);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-start gap-2.5 p-2 rounded-lg text-left transition-colors cursor-pointer ${
                    currentUser.id === u.id ? 'bg-amber-50/80 border border-amber-200' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="mt-0.5">{getRoleIcon(u.role)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-900 truncate">{u.name}</span>
                      <span className={`px-1.5 py-0.5 text-[10px] font-bold uppercase rounded border ${getRoleBadgeColor(u.role)}`}>
                        {u.role}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">{u.title}</p>
                    <p className="text-[10px] text-slate-400">{u.location}</p>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-2 pt-2 border-t border-slate-100 px-2 text-[10px] text-slate-400">
              Active Session: <span className="font-mono text-slate-600">{currentUser.email}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
