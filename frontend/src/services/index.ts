export * from './registrationService';
export * from './adminService';

/**
 * Service layer placeholder for ProjectZero Growth Engine
 * Will support analytics, campaign tracking, and registration management.
 */
export const GrowthEngineService = {
  getWorkshopDetails: async () => {
    return {
      title: 'Build Your First AI Project in 60 Minutes',
      status: 'Active',
      platform: 'Online Workshop',
    };
  },
};
