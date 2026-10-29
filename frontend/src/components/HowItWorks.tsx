import React from 'react';
import { UserCheck, Video, Rocket, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const HowItWorks: React.FC = () => {
  const navigate = useNavigate();

  const steps = [
    {
      number: '01',
      title: 'Register for free',
      description:
        'Submit your basic details to reserve your free seat for the upcoming 60-minute session. No hidden fees or prerequisites.',
      icon: <UserCheck className="h-6 w-6 text-blue-600" />,
      accent: 'border-blue-200 bg-blue-50/50',
      badgeColor: 'text-blue-700 bg-blue-100',
    },
    {
      number: '02',
      title: 'Join the online workshop',
      description:
        'Receive the live session link and starter template directly in your inbox. Connect online from anywhere.',
      icon: <Video className="h-6 w-6 text-violet-600" />,
      accent: 'border-violet-200 bg-violet-50/50',
      badgeColor: 'text-violet-700 bg-violet-100',
    },
    {
      number: '03',
      title: 'Start building your first AI project',
      description:
        'Follow along with step-by-step guidance. Code, test, and walk away with a functioning AI app in under 60 minutes.',
      icon: <Rocket className="h-6 w-6 text-indigo-600" />,
      accent: 'border-indigo-200 bg-indigo-50/50',
      badgeColor: 'text-indigo-700 bg-indigo-100',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 md:py-28 bg-white scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold tracking-wider uppercase text-violet-600 bg-violet-50 border border-violet-200/60 px-3 py-1 rounded-full">
            Simple 3-Step Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            How It Works
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            From registration to your first running AI project in three frictionless steps.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="relative bg-white rounded-2xl border border-slate-200 p-8 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${step.accent}`}>
                    {step.icon}
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${step.badgeColor}`}>
                    Step {step.number}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 tracking-tight">
                  {step.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100 flex items-center text-xs font-semibold text-slate-500">
                <span>Phase {step.number} of Workshop</span>
              </div>
            </div>
          ))}
        </div>

        {/* Action Link */}
        <div className="mt-12 text-center">
          <button
            onClick={() => navigate('/register')}
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
          >
            <span>Ready to get started? Reserve your spot now</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
