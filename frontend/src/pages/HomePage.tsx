import React from 'react';
import { Sparkles, Users, Clock, Award, ArrowUpRight, BarChart3, CheckCircle2 } from 'lucide-react';
import { WORKSHOP_DETAILS, INITIAL_GROWTH_METRICS } from '../data';

export const HomePage: React.FC = () => {
  return (
    <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Hero Badge */}
      <div className="flex flex-col items-center text-center space-y-4 mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 shadow-inner">
          <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
          <span>NxtWave Growth Intern Challenge</span>
        </div>

        {/* Main Title displaying ProjectZero Growth Engine */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-4xl">
          ProjectZero <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400">Growth Engine</span>
        </h1>

        <p className="text-base sm:text-lg text-slate-400 max-w-2xl leading-relaxed">
          Engineered to drive awareness, boost engagement, and maximize registrations for the free online workshop:
          <span className="block mt-1 font-semibold text-slate-200">
            "{WORKSHOP_DETAILS.title}"
          </span>
        </p>
      </div>

      {/* Workshop Highlight Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-950 p-6 sm:p-8 mb-12 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <CheckCircle2 className="h-3.5 w-3.5" />
              100% Free Online Workshop
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {WORKSHOP_DETAILS.title}
            </h2>
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl">
              {WORKSHOP_DETAILS.tagline}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-400 pt-2">
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-cyan-400" />
                {WORKSHOP_DETAILS.durationMinutes} Minutes Live
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="h-4 w-4 text-indigo-400" />
                {WORKSHOP_DETAILS.targetAudience}
              </span>
              <span className="flex items-center gap-1.5">
                <Award className="h-4 w-4 text-yellow-400" />
                Certificate of Completion
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
            <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer">
              Launch Workshop Campaign
              <ArrowUpRight className="h-4 w-4" />
            </button>
            <button className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-sm border border-slate-700 transition-all flex items-center justify-center gap-2 cursor-pointer">
              <BarChart3 className="h-4 w-4" />
              View Growth Metrics
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-12">
        {INITIAL_GROWTH_METRICS.map((metric) => (
          <div
            key={metric.id}
            className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur hover:border-slate-700 transition-all shadow-md"
          >
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              {metric.label}
            </span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {metric.value}
              </span>
              <span className="inline-flex items-center text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                +{metric.changePercent}%
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Setup Status Box */}
      <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-5 text-center">
        <p className="text-xs text-slate-400">
          Frontend initialized successfully with React 19, TypeScript, Vite, Tailwind CSS, React Router, Lucide Icons & Chart.js.
        </p>
      </div>
    </main>
  );
};
