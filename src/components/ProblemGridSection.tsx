'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Problem, Sector, OpportunityType } from '@/types';
import ProblemCard from './ProblemCard';
import { Search, PlusCircle, AlertCircle, ArrowUpDown } from 'lucide-react';

interface ProblemGridSectionProps {
  initialProblems: Problem[];
}

const SECTORS: (Sector | 'All')[] = [
  'All',
  'Agriculture',
  'Retail & SMEs',
  'Healthcare',
  'Technology',
  'Logistics',
  'Education',
  'Environment',
  'Finance',
  'Employment',
  'Public Services',
  'Other'
];

const DIVISIONS = ['All', 'Dhaka', 'Chittagong', 'Rajshahi', 'Sylhet', 'Rangpur', 'Khulna', 'Barishal', 'Mymensingh', 'National'];

export default function ProblemGridSection({ initialProblems }: ProblemGridSectionProps) {
  const problems = initialProblems;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState<Sector | 'All'>('All');
  const [selectedDivision, setSelectedDivision] = useState('All');
  const [selectedOpportunity, setSelectedOpportunity] = useState<OpportunityType | 'All'>('All');
  const [sortBy, setSortBy] = useState<'newest' | 'validated' | 'cost' | 'interest'>('newest');

  const filteredProblems = useMemo(() => {
    return problems.filter((p) => {
      // search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = p.title.toLowerCase().includes(query);
        const matchesSummary = p.summary.toLowerCase().includes(query);
        const matchesLocation = p.location.toLowerCase().includes(query);
        const matchesCustomer = p.affectedCustomerType.toLowerCase().includes(query);
        if (!matchesTitle && !matchesSummary && !matchesLocation && !matchesCustomer) {
          return false;
        }
      }

      // sector filter
      if (selectedSector !== 'All' && p.sector !== selectedSector) {
        return false;
      }

      // division filter
      if (selectedDivision !== 'All' && p.division !== selectedDivision && p.division !== 'National') {
        return false;
      }

      // opportunity type filter
      if (selectedOpportunity !== 'All' && p.opportunityType !== selectedOpportunity) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'validated') {
        const scoreA = a.validationStatus === 'Validated' ? 100 : a.confidenceScorePercent;
        const scoreB = b.validationStatus === 'Validated' ? 100 : b.confidenceScorePercent;
        return scoreB - scoreA;
      }
      if (sortBy === 'cost') {
        return a.estimatedStartupCostBDT.min - b.estimatedStartupCostBDT.min;
      }
      if (sortBy === 'interest') {
        return (b.followerCount + b.solverCount) - (a.followerCount + a.solverCount);
      }
      // newest default
      return new Date(b.dateReported).getTime() - new Date(a.dateReported).getTime();
    });
  }, [problems, searchQuery, selectedSector, selectedDivision, selectedOpportunity, sortBy]);

  return (
    <section id="problems" className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800 mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              Field-Verified Opportunities Grid
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
              Explore Active Problems in Bangladesh
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              Real friction points collected from farms, wholesale markets, clinics, and SME clusters. Review verified evidence and research before building.
            </p>
          </div>

          <div className="text-xs text-slate-500 font-medium">
            Showing <span className="font-bold text-slate-900">{filteredProblems.length}</span> documented problems
          </div>
        </div>

        {/* Search & Filters Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs mb-8 space-y-4">
          {/* Search Input Row */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by keyword, affected customer, location, or problem title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 focus:bg-white rounded-xl border border-slate-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-200 outline-none transition-all placeholder:text-slate-400 text-slate-900"
              />
            </div>

            {/* Quick Sorting Dropdown */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'newest' | 'validated' | 'cost' | 'interest')}
                className="w-full sm:w-auto px-3 py-2.5 text-xs font-semibold bg-slate-50 rounded-xl border border-slate-200 text-slate-800 focus:border-amber-400 outline-none cursor-pointer"
              >
                <option value="newest">Sort: Newest First</option>
                <option value="validated">Sort: Highest Validation & Evidence</option>
                <option value="cost">Sort: Low Startup Cost Entry</option>
                <option value="interest">Sort: Most Solvers & Interest</option>
              </select>
            </div>
          </div>

          {/* Filter Selectors */}
          <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-100 text-xs">
            {/* Division dropdown */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-medium">Division:</span>
              <select
                value={selectedDivision}
                onChange={(e) => setSelectedDivision(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-800 focus:outline-none"
              >
                {DIVISIONS.map((d) => (
                  <option key={d} value={d}>{d === 'All' ? 'All Divisions' : `${d} Division`}</option>
                ))}
              </select>
            </div>

            {/* Opportunity Type */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-medium">Opportunity Type:</span>
              <select
                value={selectedOpportunity}
                onChange={(e) => setSelectedOpportunity(e.target.value as OpportunityType | 'All')}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-800 focus:outline-none"
              >
                <option value="All">All Types</option>
                <option value="Open Problem">Open Problem (Ventures)</option>
                <option value="Paid Challenge">Verified Paid Challenges</option>
                <option value="Client Request">Client Requests</option>
                <option value="Collaboration">Collaboration Teams</option>
                <option value="Marketplace">Marketplace Solutions</option>
              </select>
            </div>

            {(selectedSector !== 'All' || selectedDivision !== 'All' || selectedOpportunity !== 'All' || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedSector('All');
                  setSelectedDivision('All');
                  setSelectedOpportunity('All');
                  setSearchQuery('');
                }}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 ml-auto cursor-pointer"
              >
                Reset Filters
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div id="categories" className="pt-2">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
              {SECTORS.map((sector) => {
                const isSelected = selectedSector === sector;
                return (
                  <button
                    key={sector}
                    onClick={() => setSelectedSector(sector)}
                    className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer font-medium ${
                      isSelected
                        ? 'bg-amber-400 text-slate-950 font-bold shadow-2xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                    }`}
                  >
                    {sector}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* The Signature Sketch Grid: Green "Submit a Problem" anchor card + Bold Yellow Problem Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch">
          {/* Sketch Iconic Element: Top-Left Bold Green "SUBMIT A PROBLEM" Block */}
          <div className="bg-emerald-500 text-slate-950 rounded-2xl p-6 flex flex-col justify-between border-2 border-emerald-600 shadow-md min-h-[380px] relative overflow-hidden group">
            <div className="relative z-10">
              <div className="inline-block bg-slate-950 text-emerald-400 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded mb-4">
                COMMUNITY PIPELINE
              </div>
              <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-slate-950 leading-tight mb-3">
                SUBMIT A <br />
                <span className="text-white">+ PROBLEM</span>
              </h3>
              <p className="text-xs font-medium text-emerald-950/90 leading-relaxed mb-4">
                Witnessed a systemic bottleneck in your factory, farm, shop, clinic, or municipal ward? Document the friction and submit it for solver matchmaking.
              </p>
              
              <ul className="text-[11px] font-medium text-emerald-950 space-y-1.5 pt-3 border-t border-emerald-600/40">
                <li className="flex items-center gap-1.5">
                  <span className="font-bold">✓</span> Guided evidence submission
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="font-bold">✓</span> Zero unverified promises
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="font-bold">✓</span> Reviewed by research team
                </li>
              </ul>
            </div>

            <div className="relative z-10 mt-6">
              <Link
                href="/submit"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider text-white bg-slate-950 hover:bg-slate-900 transition-colors shadow-sm"
              >
                <PlusCircle className="w-4 h-4 text-emerald-400" />
                Submit Problem Now
              </Link>
            </div>
          </div>

          {/* Dynamic Problem Cards (Warm Yellow Identity) */}
          {filteredProblems.map((problem) => (
            <ProblemCard key={problem.id} problem={problem} />
          ))}
        </div>

        {filteredProblems.length === 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto my-8">
            <AlertCircle className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900 mb-1">No matching problems found</h3>
            <p className="text-xs text-slate-500 mb-4">
              Try adjusting your search keywords, sector selection, or location filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedSector('All');
                setSelectedDivision('All');
                setSelectedOpportunity('All');
              }}
              className="text-xs font-bold text-amber-700 bg-amber-100 px-3 py-1.5 rounded-lg hover:bg-amber-200"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
