'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Solver / Builder');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setSubmitted(true);
  };

  return (
    <div className="py-12 sm:py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-2.5 py-1 rounded">
          Get in Touch
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-950 mt-3 mb-3 tracking-tight">
          Contact SupplierHut Bangladesh
        </h1>
        <p className="text-sm text-slate-600 max-w-xl mx-auto">
          Have inquiries regarding sponsoring a paid challenge, proposing an academic partnership, or reporting field data?
        </p>
      </div>

      <div className="grid md:grid-cols-12 gap-8">
        {/* Contact Form */}
        <div className="md:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          {submitted ? (
            <div className="p-8 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Message Received</h3>
              <p className="text-xs text-slate-600">
                Thank you, {name}. Our research and operations team in Dhaka will review your inquiry and follow up within 24-48 business hours.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setName('');
                  setEmail('');
                  setMessage('');
                }}
                className="text-xs font-bold text-amber-700 bg-amber-50 px-4 py-2 rounded-lg hover:bg-amber-100"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Your Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Tanvir Ahmed"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="name@organization.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">I am participating as a:</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
                >
                  <option value="Solver / Builder">Solver / Engineer / Builder</option>
                  <option value="Problem Owner">Problem Submitter / SME Owner</option>
                  <option value="Challenge Sponsor">Challenge Sponsor / Foundation</option>
                  <option value="Researcher">Researcher / Academic Partner</option>
                  <option value="Other">Other Inquiry</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Inquiry / Message</label>
                <textarea
                  rows={4}
                  placeholder="Describe your question or partnership proposal..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 transition-colors shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                Submit Inquiry
              </button>
            </form>
          )}
        </div>

        {/* Contact Info Details */}
        <div className="md:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4 text-xs">
            <h3 className="font-bold text-slate-900 text-sm">Dhaka Operations Desk</h3>
            
            <div className="space-y-3 text-slate-600">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-800 block">Field Office:</strong>
                  Level 5, Mohakhali Commercial Area, Dhaka 1212, Bangladesh
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-800 block">Inquiries:</strong>
                  research@supplierhut.bd
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-800 block">Hours:</strong>
                  Sunday – Thursday: 9:00 AM – 6:00 PM (Asia/Dhaka)
                </div>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-amber-50 border border-amber-300 text-xs text-amber-950 space-y-1">
            <span className="font-bold block">Need to Report Content?</span>
            <p className="text-slate-600">
              If you found inaccurate market claims or copyright violations, please submit via the{' '}
              <a href="/report" className="underline font-bold text-rose-700">Abuse Reporting Form</a>{' '}
              for prioritized moderation review.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
