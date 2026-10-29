import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowLeft, Clock, ShieldCheck, MonitorPlay, Users } from 'lucide-react';

export const RegisterPlaceholderPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-xl w-full bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-10 shadow-lg text-center space-y-6">
        <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-sm">
          <Sparkles className="h-7 w-7" />
        </div>

        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/80 mb-3">
            Workshop Registration
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Build Your First AI Project in 60 Minutes
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-2">
            The registration form will be configured in the next step. Your free seat can be claimed once the registration step is live!
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 text-left bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
          <div className="flex items-center gap-2 text-slate-700">
            <Clock className="h-4 w-4 text-violet-600" />
            <span>Duration: 60 Mins</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>Fee: 100% Free</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700">
            <MonitorPlay className="h-4 w-4 text-blue-600" />
            <span>Format: Online</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700">
            <Users className="h-4 w-4 text-indigo-600" />
            <span>For: Engineering Students</span>
          </div>
        </div>

        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm transition-colors cursor-pointer w-full"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Return to Workshop Landing Page</span>
        </button>
      </div>
    </div>
  );
};
