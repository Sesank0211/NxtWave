import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Clock, ShieldCheck, Sparkles, CheckCircle2, Code2, Users } from 'lucide-react';
import { RegistrationForm } from '../components/RegistrationForm';
import { RegistrationConfirmation } from '../components/RegistrationConfirmation';
import { ReferralLeaderboard } from '../components/ReferralLeaderboard';
import type { RegistrationResult } from '../types';

export const RegisterPage: React.FC = () => {
  const [submissionResult, setSubmissionResult] = useState<RegistrationResult | null>(null);

  const handleSuccess = (result: RegistrationResult) => {
    setSubmissionResult(result);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setSubmissionResult(null);
  };

  return (
    <div className="flex-1 bg-slate-50/70 py-10 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Workshop Landing Page</span>
          </Link>
        </div>

        {/* Page Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Card (Form or Confirmation) */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm">
            {!submissionResult ? (
              <div className="space-y-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/80 mb-3">
                    <Sparkles className="h-3.5 w-3.5 text-blue-600" />
                    <span>Free Student Workshop</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    Workshop Registration
                  </h1>
                  <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
                    Reserve your seat for <span className="font-semibold text-slate-800">"Build Your First AI Project in 60 Minutes"</span>.
                  </p>
                </div>

                <RegistrationForm onSuccess={handleSuccess} />
              </div>
            ) : (
              <RegistrationConfirmation result={submissionResult} onReset={handleReset} />
            )}
          </div>

          {/* Right Info Sidebar (Desktop & Mobile summary) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Workshop Quick Summary Box */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-5">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Code2 className="h-5 w-5 text-blue-600" />
                Workshop Quick Facts
              </h3>

              <div className="space-y-3.5 text-sm">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900 block text-xs sm:text-sm">Duration</span>
                    <span className="text-slate-500 text-xs">60 Minutes practical code session</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900 block text-xs sm:text-sm">Cost</span>
                    <span className="text-slate-500 text-xs">100% Free access for students</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center shrink-0">
                    <Users className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900 block text-xs sm:text-sm">Target Batch</span>
                    <span className="text-slate-500 text-xs">2027 Engineering Batch & all students</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  What you will build
                </span>
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0" />
                  <span>A deployed, interactive AI web application</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0" />
                  <span>GitHub repository ready for your resume</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0" />
                  <span>Prompt orchestration & API wiring foundation</span>
                </div>
              </div>
            </div>

            {/* Referral Leaderboard Preview */}
            <ReferralLeaderboard />

            {/* Support / Help note */}
            <div className="rounded-2xl border border-slate-200/80 bg-white/70 p-4 text-center">
              <p className="text-xs text-slate-500">
                Questions about the session? Reach out directly via the workshop portal.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
