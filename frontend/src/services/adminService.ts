import type { AdminMetrics, ChartAnalytics, AdminStudent, AdminPagination } from '../types';

export class AdminService {
  private baseUrl: string;
  private readonly sessionKey = 'projectzero-admin-session';

  constructor() {
    this.baseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api').replace(/\/$/, '');
  }

  async login(username: string, password: string): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ username: username.trim(), password }),
      });
      const data = await response.json();
      if (!response.ok || !data?.success || typeof data.token !== 'string') {
        return { success: false, message: data?.message || 'Unable to sign in.' };
      }
      sessionStorage.setItem(this.sessionKey, data.token);
      return { success: true };
    } catch {
      return { success: false, message: 'Could not connect to the administrator login service.' };
    }
  }

  logout(): void {
    sessionStorage.removeItem(this.sessionKey);
  }

  hasSession(): boolean {
    return Boolean(sessionStorage.getItem(this.sessionKey));
  }

  private authorizedFetch(path: string, init: RequestInit = {}): Promise<Response> {
    const headers = new Headers(init.headers);
    const token = sessionStorage.getItem(this.sessionKey);
    if (token) headers.set('Authorization', `Bearer ${token}`);
    return fetch(`${this.baseUrl}${path}`, { ...init, headers }).then((response) => {
      if (response.status === 401) {
        this.logout();
        window.dispatchEvent(new Event('projectzero-admin-session-expired'));
      }
      return response;
    });
  }

  async getAdminMetrics(): Promise<{ success: boolean; metrics?: AdminMetrics; message?: string }> {
    try {
      const response = await this.authorizedFetch('/admin/metrics');
      const data = await response.json();
      if (response.ok && data?.success) {
        return { success: true, metrics: data.metrics };
      }
      return { success: false, message: data?.message || 'Failed to fetch metrics' };
    } catch (err: any) {
      console.error('[AdminService Metrics Error]:', err);
      return { success: false, message: 'Could not connect to backend server' };
    }
  }

  async getChartData(): Promise<{ success: boolean; chartData?: ChartAnalytics; message?: string }> {
    try {
      const response = await this.authorizedFetch('/admin/chart-data');
      const data = await response.json();
      if (response.ok && data?.success) {
        return {
          success: true,
          chartData: {
            batchDistribution: data.batchDistribution || [],
            topColleges: data.topColleges || [],
            timeline: data.timeline || [],
            sourceDistribution: data.sourceDistribution || [],
          },
        };
      }
      return { success: false, message: data?.message || 'Failed to fetch chart analytics' };
    } catch (err: any) {
      console.error('[AdminService Charts Error]:', err);
      return { success: false, message: 'Could not load chart data from backend' };
    }
  }

  async getStudents(params: {
    search?: string;
    batch?: string;
    referred?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    success: boolean;
    students?: AdminStudent[];
    pagination?: AdminPagination;
    message?: string;
  }> {
    try {
      const query = new URLSearchParams();
      if (params.search) query.set('search', params.search);
      if (params.batch && params.batch !== 'all') query.set('batch', params.batch);
      if (params.referred && params.referred !== 'all') query.set('referred', params.referred);
      if (params.page) query.set('page', params.page.toString());
      if (params.limit) query.set('limit', params.limit.toString());

      const response = await this.authorizedFetch(`/admin/students?${query.toString()}`);
      const data = await response.json();

      if (response.ok && data?.success) {
        return {
          success: true,
          students: data.students || [],
          pagination: data.pagination,
        };
      }
      return { success: false, message: data?.message || 'Failed to load students' };
    } catch (err: any) {
      console.error('[AdminService Students Error]:', err);
      return { success: false, message: 'Could not load students directory' };
    }
  }

  getExportCsvUrl(): string {
    return `${this.baseUrl}/admin/export`;
  }

  async downloadExportCsv(): Promise<void> {
    const response = await this.authorizedFetch('/admin/export');
    if (!response.ok) throw new Error('Administrator authorization is required to export registrations.');
    const url = URL.createObjectURL(await response.blob());
    const link = document.createElement('a');
    link.href = url;
    link.download = 'projectzero-registrations.csv';
    link.click();
    URL.revokeObjectURL(url);
  }
}

export const adminService = new AdminService();
