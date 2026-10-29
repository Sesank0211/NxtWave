import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  RefreshCw, 
  Download, 
  Sparkles,
  LockKeyhole,
  LogOut,
} from 'lucide-react';
import type { AdminMetrics, ChartAnalytics } from '../types';
import { adminService } from '../services';
import { AdminMetricsCards } from '../components/admin/AdminMetricsCards';
import { AdminCharts } from '../components/admin/AdminCharts';
import { AdminStudentTable } from '../components/admin/AdminStudentTable';

export const AdminDashboardPage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => adminService.hasSession());
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [chartData, setChartData] = useState<ChartAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [loadError, setLoadError] = useState<string | null>(null);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [metricsRes, chartsRes] = await Promise.all([
        adminService.getAdminMetrics(),
        adminService.getChartData(),
      ]);

      if (metricsRes.success && metricsRes.metrics) {
        setMetrics(metricsRes.metrics);
      }
      if (chartsRes.success && chartsRes.chartData) {
        setChartData(chartsRes.chartData);
      }
      const failures = [metricsRes, chartsRes].filter((result) => !result.success).map((result) => result.message);
      setLoadError(failures.length ? failures.join('. ') : null);
      setLastRefreshed(new Date());
    } catch (err) {
      console.error('Failed to load admin dashboard data:', err);
      setLoadError('Could not load dashboard data. Check the API connection and administrator token.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    const handleSessionExpired = () => {
      setIsAuthenticated(false);
      setMetrics(null);
      setChartData(null);
      setLoginError('Your administrator session expired. Please sign in again.');
    };
    window.addEventListener('projectzero-admin-session-expired', handleSessionExpired);
    loadDashboardData();
    return () => window.removeEventListener('projectzero-admin-session-expired', handleSessionExpired);
  }, [isAuthenticated]);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoginLoading(true);
    setLoginError(null);
    const result = await adminService.login(username, password);
    setLoginLoading(false);
    if (!result.success) {
      setLoginError(result.message || 'Unable to sign in.');
      return;
    }
    setPassword('');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    adminService.logout();
    setIsAuthenticated(false);
    setMetrics(null);
    setChartData(null);
    setLoadError(null);
  };

  const handleExportCsv = async () => {
    try {
      await adminService.downloadExportCsv();
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : 'Could not export registrations.');
    }
  };

  if (!isAuthenticated) {
    return (
      <main className="flex-1 bg-slate-50/70 py-12 sm:py-20 px-4">
        <section className="max-w-md mx-auto bg-white rounded-3xl border border-slate-200 p-7 sm:p-9 shadow-sm">
          <Link to="/" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-blue-600">
            <ArrowLeft className="h-4 w-4" /> Back to public site
          </Link>
          <div className="mt-8 mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
            <LockKeyhole className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Administrator sign in</h1>
          <p className="mt-2 text-sm text-slate-500">Sign in with the administrator credentials configured for this server.</p>

          <form onSubmit={handleLogin} className="mt-7 space-y-5">
            <div>
              <label htmlFor="admin-username" className="mb-1.5 block text-sm font-semibold text-slate-800">Username</label>
              <input id="admin-username" name="username" autoComplete="username" required value={username} onChange={(event) => setUsername(event.target.value)} className="w-full rounded-xl border border-slate-200 px-3.5 py-3 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20" />
            </div>
            <div>
              <label htmlFor="admin-password" className="mb-1.5 block text-sm font-semibold text-slate-800">Password</label>
              <input id="admin-password" name="password" type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-xl border border-slate-200 px-3.5 py-3 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20" />
            </div>
            {loginError && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-3 text-sm text-rose-700">{loginError}</p>}
            <button type="submit" disabled={loginLoading} className="w-full rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-wait disabled:opacity-60">
              {loginLoading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </section>
      </main>
    );
  }

  return (
    <div className="flex-1 bg-slate-50/70 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Navigation & Breadcrumbs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Public Workshop Site</span>
          </Link>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Live MongoDB Synchronized
            </span>

            <button
              onClick={loadDashboardData}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Log out</span>
            </button>
          </div>
        </div>

        {/* Dashboard Hero Header */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/80">
              <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
              <span>NxtWave Growth Intern Challenge</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
              <span>Growth Engine</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">
                Admin Dashboard
              </span>
            </h1>
            <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
              Monitoring attendee acquisitions, viral referral loops, and demographic distribution for the free workshop:
              <span className="font-semibold text-slate-800 block sm:inline sm:ml-1">
                "Build Your First AI Project in 60 Minutes"
              </span>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0">
            <button
              onClick={handleExportCsv}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer"
            >
              <Download className="h-4 w-4" />
              <span>Export Attendee List (CSV)</span>
            </button>
            <span className="text-[11px] text-slate-400 text-center">
              Updated {lastRefreshed.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>

        {/* 1. Growth KPI Cards */}
        {loadError && <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{loadError}</div>}
        {loading && !metrics && <div role="status" className="rounded-xl border border-slate-200 bg-white px-4 py-5 text-sm text-slate-500">Loading live dashboard data…</div>}
        {!loading && !metrics && !loadError && <div className="rounded-xl border border-slate-200 bg-white px-4 py-5 text-sm text-slate-500">No dashboard metrics are available yet.</div>}
        {metrics && <AdminMetricsCards metrics={metrics} />}

        {/* 2. Visual Analytics Charts */}
        {chartData && <AdminCharts data={chartData} />}

        {/* 3. Searchable Student Directory Table */}
        <AdminStudentTable />
      </div>
    </div>
  );
};
