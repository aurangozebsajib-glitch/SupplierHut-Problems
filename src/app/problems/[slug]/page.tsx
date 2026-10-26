import React from 'react';
import { notFound } from 'next/navigation';
import { getStoredProblems, getProblemBySlug } from '@/lib/data-store';
import ProblemDetailClient from './ProblemDetailClient';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const problems = getStoredProblems();
  return problems.map((p) => ({ slug: p.slug }));
}

export default async function ProblemDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const problem = getProblemBySlug(slug);

  if (!problem) {
    notFound();
  }

  const allProblems = getStoredProblems();
  const relatedProblems = allProblems
    .filter((p) => p.id !== problem.id && (p.sector === problem.sector || p.division === problem.division))
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <ProblemDetailClient problem={problem} relatedProblems={relatedProblems} />
    </div>
  );
}
