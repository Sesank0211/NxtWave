import type { 
  RegistrationFormData, 
  RegistrationResult, 
  ReferralStats, 
  LeaderboardEntry 
} from '../types';

/**
 * Interface for the workshop registration and referral service.
 */
export interface IRegistrationService {
  register(data: RegistrationFormData): Promise<RegistrationResult>;
  getReferralStats(code: string): Promise<{ success: boolean; data?: ReferralStats; message?: string }>;
  validateReferralCode(code: string): Promise<{ success: boolean; valid: boolean; referrerName?: string; referralCode?: string; message?: string }>;
  getLeaderboard(): Promise<{ success: boolean; leaderboard?: LeaderboardEntry[]; message?: string }>;
}

/**
 * Production-ready API service connecting to Express backend and MongoDB.
 */
export class ApiRegistrationService implements IRegistrationService {
  private baseUrl: string;

  constructor() {
    // Read API base URL from Vite environment variable with safe fallback
    this.baseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api').replace(/\/$/, '');
  }

  async register(data: RegistrationFormData): Promise<RegistrationResult> {
    try {
      const response = await fetch(`${this.baseUrl}/registrations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          name: data.fullName.trim(),
          email: data.email.trim(),
          collegeName: data.collegeName.trim(),
          graduationYear: data.graduationYear.trim(),
          referredBy: data.referredBy ? data.referredBy.trim().toUpperCase() : undefined,
        }),
      });

      let responseData: any = null;
      try {
        responseData = await response.json();
      } catch {
        responseData = null;
      }

      if (response.ok && responseData?.success) {
        return {
          success: true,
          message: responseData.message || 'Registration successful! Your workshop seat has been reserved.',
          data: responseData.data,
          timestamp: responseData.data?.registeredAt || new Date().toISOString(),
        };
      }

      return {
        success: false,
        message: responseData?.message || `Registration request failed with status ${response.status}`,
        errors: responseData?.errors,
        timestamp: new Date().toISOString(),
      };
    } catch (err: any) {
      console.error('[Registration Service Error]:', err);
      return {
        success: false,
        message: 'The registration backend server is currently unavailable. Please ensure the backend server is running.',
        isNetworkError: true,
        timestamp: new Date().toISOString(),
      };
    }
  }

  async getReferralStats(code: string): Promise<{ success: boolean; data?: ReferralStats; message?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/referrals/stats/${encodeURIComponent(code.trim().toUpperCase())}`);
      const data = await response.json();

      if (response.ok && data?.success) {
        return {
          success: true,
          data: {
            referralCode: data.referralCode,
            studentName: data.studentName,
            referralCount: data.referralCount,
            registeredAt: data.registeredAt,
          },
        };
      }

      return {
        success: false,
        message: data?.message || 'Failed to fetch referral statistics',
      };
    } catch (err: any) {
      console.error('[Referral Stats Error]:', err);
      return {
        success: false,
        message: 'Failed to connect to referral statistics service',
      };
    }
  }

  async validateReferralCode(code: string): Promise<{ 
    success: boolean; 
    valid: boolean; 
    referrerName?: string; 
    referralCode?: string; 
    message?: string 
  }> {
    try {
      const cleanCode = code.trim().toUpperCase();
      const response = await fetch(`${this.baseUrl}/referrals/validate/${encodeURIComponent(cleanCode)}`);
      const data = await response.json();

      if (response.ok && data?.valid) {
        return {
          success: true,
          valid: true,
          referrerName: data.referrerName,
          referralCode: data.referralCode,
        };
      }

      return {
        success: false,
        valid: false,
        message: data?.message || 'Invalid referral code',
      };
    } catch (err: any) {
      console.error('[Referral Validation Error]:', err);
      return {
        success: false,
        valid: false,
        message: 'Unable to validate referral code with backend',
      };
    }
  }

  async getLeaderboard(): Promise<{ success: boolean; leaderboard?: LeaderboardEntry[]; message?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/referrals/leaderboard`);
      const data = await response.json();

      if (response.ok && data?.success) {
        return {
          success: true,
          leaderboard: data.leaderboard || [],
        };
      }

      return {
        success: false,
        message: data?.message || 'Failed to fetch referral leaderboard',
      };
    } catch (err: any) {
      console.error('[Leaderboard Error]:', err);
      return {
        success: false,
        message: 'Unable to load leaderboard from server',
      };
    }
  }
}

// Export singleton instance for the application
export const registrationService: IRegistrationService = new ApiRegistrationService();
