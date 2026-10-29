import type { WorkshopInfo, GrowthMetric } from '../types';

export const WORKSHOP_DETAILS: WorkshopInfo = {
  title: 'Build Your First AI Project in 60 Minutes',
  durationMinutes: 60,
  isFree: true,
  targetAudience: 'Students, Aspiring Developers & AI Enthusiasts',
  tagline: 'Step-by-step hands-on guide to building and deploying a live AI application.',
};

export const INITIAL_GROWTH_METRICS: GrowthMetric[] = [
  {
    id: 'registrations',
    label: 'Workshop Registrations',
    value: '1,280',
    changePercent: 24.5,
    trend: 'up',
  },
  {
    id: 'conversion_rate',
    label: 'Visitor Conversion',
    value: '18.4%',
    changePercent: 3.2,
    trend: 'up',
  },
  {
    id: 'referrals',
    label: 'Viral Referrals',
    value: '420',
    changePercent: 12.1,
    trend: 'up',
  },
];
