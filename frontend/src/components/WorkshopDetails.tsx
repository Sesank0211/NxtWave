import React from 'react';
import { Clock, Users, Globe, Tag, CheckCircle2, Calendar } from 'lucide-react';

export const WorkshopDetails: React.FC = () => {
  const details = [
    {
      label: 'Workshop Duration',
      value: '60 Minutes',
      description: 'Concise, high-intensity session focused entirely on practical project creation.',
      icon: <Clock className="h-6 w-6 text-blue-600" />,
      bg: 'bg-blue-50',
    },
    {
      label: 'Audience',
      value: 'Engineering Students',
      description: 'Ideal for 1st to 4th year engineering students aiming to explore AI and build projects.',
      icon: <Users className="h-6 w-6 text-violet-600" />,
      bg: 'bg-violet-50',
    },
    {
      label: 'Format',
      value: 'Online',
      description: 'Live interactive streaming session accessible from any laptop or browser.',
      icon: <Globe className="h-6 w-6 text-indigo-600" />,
      bg: 'bg-indigo-50',
    },
    {
      label: 'Fee',
      value: 'Free',
      description: '100% complimentary access as part of the student enablement initiative.',
      icon: <Tag className="h-6 w-6 text-emerald-600" />,
      bg: 'bg-emerald-50',
    },
  ];

  const highlights = [
    'Live Q&A support during the workshop',
    'Starter code template and documentation provided',
    'Walkthrough of connecting an AI backend to a frontend UI',
    'Actionable project output ready for personal portfolios',
  ];

  return (
    <section id="about-workshop" className="py-20 bg-slate-50/70 border-y border-slate-200/70 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold tracking-wider uppercase text-blue-600 bg-blue-50 border border-blue-200/60 px-3 py-1 rounded-full">
            Workshop Specifications
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            About the Workshop
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            Clear, transparent details on what to expect from "Build Your First AI Project in 60 Minutes".
          </p>
        </div>

        {/* 4 Details Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {details.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className={`w-12 h-12 rounded-xl ${item.bg} flex items-center justify-center mb-5`}>
                  {item.icon}
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {item.label}
                </span>
                <p className="text-2xl font-bold text-slate-900 mt-1 mb-2">
                  {item.value}
                </p>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* What You Will Receive Box */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <Calendar className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-bold text-slate-900">
              What is included in the 60 minutes
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {highlights.map((highlight, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                <span className="text-sm text-slate-700 font-medium">
                  {highlight}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
