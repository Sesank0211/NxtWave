import React from 'react';
import { Hero } from '../components/Hero';
import { Benefits } from '../components/Benefits';
import { HowItWorks } from '../components/HowItWorks';
import { WorkshopDetails } from '../components/WorkshopDetails';
import { CtaSection } from '../components/CtaSection';

export const LandingPage: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col bg-white">
      <Hero />
      <Benefits />
      <HowItWorks />
      <WorkshopDetails />
      <CtaSection />
    </div>
  );
};
