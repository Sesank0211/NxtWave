export interface WorkshopInfo {
  title: string;
  durationMinutes: number;
  isFree: boolean;
  targetAudience: string;
  tagline: string;
}

export interface GrowthMetric {
  id: string;
  label: string;
  value: string | number;
  changePercent: number;
  trend: 'up' | 'down' | 'neutral';
}

export interface RegistrationFormData {
  fullName: string;
  email: string;
  collegeName: string;
  graduationYear: string;
  referredBy?: string;
}

export interface RegistrationErrors {
  fullName?: string;
  email?: string;
  collegeName?: string;
  graduationYear?: string;
  referredBy?: string;
}

export interface SavedStudentRecord {
  id?: string;
  name: string;
  email: string;
  collegeName: string;
  graduationYear: string;
  referralCode?: string;
  referralLink?: string;
  referralCount?: number;
  referredBy?: string | null;
  registeredAt?: string;
}

export interface RegistrationResult {
  success: boolean;
  message: string;
  data?: SavedStudentRecord;
  timestamp: string;
  errors?: Record<string, string>;
  isNetworkError?: boolean;
}

export interface ReferralStats {
  referralCode: string;
  studentName: string;
  referralCount: number;
  registeredAt?: string;
}

export interface LeaderboardEntry {
  referralCode: string;
  name: string;
  collegeName: string;
  graduationYear: string;
  referralCount: number;
}

export interface AdminMetrics {
  totalStudents: number;
  referredStudents: number;
  directStudents: number;
  targetBatchStudents: number;
  targetBatchRate: number;
  viralRate: number;
  uniqueCollegesCount: number;
  registrationsToday: number;
  target: number;
  targetProgress: number;
  registrationsRemaining: number;
}

export interface ChartAnalytics {
  batchDistribution: { batch: string; count: number }[];
  topColleges: { college: string; count: number }[];
  timeline: { date: string; total: number; viral: number }[];
  sourceDistribution: { source: string; count: number }[];
}

export interface AdminStudent {
  id: string;
  name: string;
  email: string;
  collegeName: string;
  graduationYear: string;
  referralCode: string;
  referredBy: string | null;
  referralCount: number;
  registeredAt: string;
}

export interface AdminPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
