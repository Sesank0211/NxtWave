import React from 'react';
import { Users, Share2, Target, School, ArrowUpRight, CalendarDays } from 'lucide-react';
import type { AdminMetrics } from '../../types';

interface AdminMetricsCardsProps {
  metrics: AdminMetrics;
}

export const AdminMetricsCards: React.FC<AdminMetricsCardsProps> = ({ metrics }) => {
  const cards = [
    {
      title: 'Total Registrations',
      value: metrics.totalStudents.toLocaleString(),
      subtitle: `${metrics.directStudents} direct signups`,
      icon: <Users className="h-5 w-5 text-blue-600" />,
      bg: 'bg-blue-50',
      badge: 'Live MongoDB',
      badgeColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    },
    {
      title: 'Viral Referrals',
      value: metrics.referredStudents.toLocaleString(),
      subtitle: `${metrics.viralRate}% viral conversion rate`,
      icon: <Share2 className="h-5 w-5 text-indigo-600" />,
      bg: 'bg-indigo-50',
      badge: `${metrics.viralRate}% Viral`,
      badgeColor: 'text-indigo-700 bg-indigo-50 border-indigo-200',
    },
    {
      title: '2027 Target Batch',
      value: metrics.targetBatchStudents.toLocaleString(),
      subtitle: `${metrics.targetBatchRate}% of total registrations`,
      icon: <Target className="h-5 w-5 text-violet-600" />,
      bg: 'bg-violet-50',
      badge: 'Core Cohort',
      badgeColor: 'text-violet-700 bg-violet-50 border-violet-200',
    },
    {
      title: 'Colleges Represented',
      value: metrics.uniqueCollegesCount.toLocaleString(),
      subtitle: 'Across engineering institutions',
      icon: <School className="h-5 w-5 text-cyan-600" />,
      bg: 'bg-cyan-50',
      badge: 'Institutions',
      badgeColor: 'text-cyan-700 bg-cyan-50 border-cyan-200',
    },
    {
      title: 'Registrations Today',
      value: metrics.registrationsToday.toLocaleString(),
      subtitle: 'New records saved today',
      icon: <CalendarDays className="h-5 w-5 text-emerald-600" />,
      bg: 'bg-emerald-50',
      badge: 'Today',
      badgeColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    },
    {
      title: 'Campaign Progress',
      value: `${metrics.targetProgress.toFixed(1)}%`,
      subtitle: `${metrics.registrationsRemaining.toLocaleString()} registrations remaining of ${metrics.target}`,
      icon: <Target className="h-5 w-5 text-amber-600" />,
      bg: 'bg-amber-50',
      badge: `${metrics.totalStudents.toLocaleString()} / ${metrics.target}`,
      badgeColor: 'text-amber-700 bg-amber-50 border-amber-200',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:shadow-sm hover:border-slate-300 transition-all flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-3">
            <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center`}>
              {card.icon}
            </div>
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${card.badgeColor}`}>
              {card.badge}
            </span>
          </div>

          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              {card.title}
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {card.value}
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-500 flex items-center gap-1">
              <ArrowUpRight className="h-3.5 w-3.5 text-blue-600" />
              <span>{card.subtitle}</span>
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
