import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Clock, CheckCircle, ArrowRight, ShieldCheck, Terminal, Layers } from 'lucide-react';

export const Hero: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section id="top" className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden bg-white">
      {/* Subtle background ambient tint - crisp and restrained */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          {/* Badges Container */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/80">
              <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />
              100% Free
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-violet-50 text-violet-700 border border-violet-200/80">
              <Clock className="h-3.5 w-3.5 text-violet-600" />
              60 Minutes
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
              <Sparkles className="h-3.5 w-3.5 text-slate-600" />
              Beginner Friendly
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
            Your First AI Project <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600">
              Starts Here.
            </span>
          </h1>

          {/* Description */}
          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
            Discover how to start building an AI project in a free, beginner-friendly 60-minute online workshop.
          </p>

          {/* Primary CTA */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate('/register')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base shadow-sm hover:shadow-md hover:shadow-blue-600/20 active:scale-[0.99] transition-all duration-150 cursor-pointer"
            >
              <span>Register for Free</span>
              <ArrowRight className="h-4.5 w-4.5" />
            </button>
            <a
              href="#how-it-works"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-base transition-colors duration-150"
            >
              See How It Works
            </a>
          </div>

          {/* Micro trust note */}
          <p className="text-xs text-slate-500 pt-1 flex items-center justify-center gap-2">
            <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
            No credit card or prior machine learning background required
          </p>
        </div>

        {/* Clean SaaS Visual Preview Box */}
        <div className="mt-14 max-w-4xl mx-auto">
          <div className="rounded-2xl border border-slate-200 bg-slate-900 text-slate-100 shadow-xl overflow-hidden">
            {/* Terminal / Code Window Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-slate-950/80 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                <span className="ml-2 text-xs font-mono text-slate-400">workshop-preview.ts</span>
              </div>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                Live Hands-on
              </span>
            </div>

            {/* Code / Agenda Simulation */}
            <div className="p-5 sm:p-6 font-mono text-xs sm:text-sm text-slate-300 space-y-3 bg-slate-900/90 leading-relaxed">
              <div className="flex items-start gap-3">
                <span className="text-slate-500 select-none">01</span>
                <div>
                  <span className="text-violet-400 font-semibold">// Step 1: Understand AI Foundations & APIs</span>
                  <p className="text-slate-400 text-xs mt-0.5 font-sans">
                    Learn how modern LLM interfaces and prompt engineering connect to web applications.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-slate-500 select-none">02</span>
                <div>
                  <span className="text-blue-400 font-semibold">// Step 2: Build Interactive Interface</span>
                  <p className="text-slate-400 text-xs mt-0.5 font-sans">
                    Construct a responsive frontend with immediate real-time AI responses.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-slate-500 select-none">03</span>
                <div>
                  <span className="text-emerald-400 font-semibold">// Step 3: Deploy & Showcase on GitHub / Resume</span>
                  <p className="text-slate-400 text-xs mt-0.5 font-sans">
                    Walk away in 60 minutes with a functioning project you can showcase.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer banner */}
            <div className="px-5 py-3 bg-slate-950/60 border-t border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
              <span className="flex items-center gap-1.5">
                <Terminal className="h-3.5 w-3.5 text-blue-400" />
                Hands-on practical code walkthrough
              </span>
              <span className="flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-violet-400" />
                Designed for Engineering Students
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
