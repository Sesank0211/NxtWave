import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, CheckCircle } from 'lucide-react';

export const CtaSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-slate-900 text-white overflow-hidden p-8 sm:p-12 lg:p-16 shadow-xl border border-slate-800">
          {/* Subtle accent highlight behind content */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-blue-600/20 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-violet-600/20 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-300 border border-blue-500/20">
              <Sparkles className="h-3.5 w-3.5 text-blue-400" />
              <span>Limited Online Capacity</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Ready to Build Your First AI Project?
            </h2>

            <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto leading-relaxed">
              Join engineering students from across the country in this free 60-minute practical session. Learn the fundamentals and leave with working code.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => navigate('/register')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-base shadow-lg shadow-blue-600/25 active:scale-[0.99] transition-all duration-150 cursor-pointer"
              >
                <span>Register for Free</span>
                <ArrowRight className="h-4.5 w-4.5" />
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 pt-4">
              <span className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-emerald-400" />
                100% Free Access
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-emerald-400" />
                No Prior AI Knowledge Needed
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-emerald-400" />
                Instant Confirmation
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
