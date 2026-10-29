import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Download, 
  ChevronLeft, 
  ChevronRight, 
  Users, 
  RefreshCw 
} from 'lucide-react';
import type { AdminStudent, AdminPagination } from '../../types';
import { adminService } from '../../services';

export const AdminStudentTable: React.FC = () => {
  const [students, setStudents] = useState<AdminStudent[]>([]);
  const [pagination, setPagination] = useState<AdminPagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  const [search, setSearch] = useState('');
  const [batch, setBatch] = useState('all');
  const [referred, setReferred] = useState('all');
  const [loading, setLoading] = useState(true);

  const fetchStudents = async (page = 1) => {
    setLoading(true);
    try {
      const res = await adminService.getStudents({
        search,
        batch,
        referred,
        page,
        limit: 10,
      });

      if (res.success && res.students && res.pagination) {
        setStudents(res.students);
        setPagination(res.pagination);
      }
    } catch {
      // Ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents(1);
  }, [batch, referred]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchStudents(1);
  };

  const handleDownloadCsv = async () => {
    try {
      await adminService.downloadExportCsv();
    } catch (error) {
      window.alert(error instanceof Error ? error.message : 'Could not export registrations.');
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-lg font-bold text-slate-900 tracking-tight">
            Registered Students Directory
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time participant database ({pagination.total} total attendees)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => fetchStudents(pagination.page)}
            title="Refresh database records"
            disabled={loading}
            className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={handleDownloadCsv}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs transition-colors shadow-xs"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="sm:col-span-6 relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, college, or referral code..."
            className="w-full pl-9 pr-20 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-colors"
          />
          <Search className="h-4 w-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
          <button
            type="submit"
            className="absolute right-1.5 top-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-semibold transition-colors"
          >
            Search
          </button>
        </form>

        {/* Batch Filter */}
        <div className="sm:col-span-3">
          <select
            value={batch}
            onChange={(e) => setBatch(e.target.value)}
            className="w-full py-2.5 px-3 rounded-xl border border-slate-200 text-xs text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-colors"
          >
            <option value="all">All Graduation Batches</option>
            <option value="2027">2027 (Core Target)</option>
            <option value="2028">2028 Batch</option>
            <option value="2026">2026 Batch</option>
            <option value="2025">2025 Batch</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Channel Filter */}
        <div className="sm:col-span-3">
          <select
            value={referred}
            onChange={(e) => setReferred(e.target.value)}
            className="w-full py-2.5 px-3 rounded-xl border border-slate-200 text-xs text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-colors"
          >
            <option value="all">All Acquisition Channels</option>
            <option value="referred">Viral (Referred by Peer)</option>
            <option value="direct">Direct Signups</option>
          </select>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200/80">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50/80 text-slate-500 font-semibold border-b border-slate-200/80 uppercase tracking-wider text-[11px]">
            <tr>
              <th className="px-4 py-3.5">Student</th>
              <th className="px-4 py-3.5">College</th>
              <th className="px-4 py-3.5">Batch</th>
              <th className="px-4 py-3.5">Referral Code</th>
              <th className="px-4 py-3.5">Acquisition</th>
              <th className="px-4 py-3.5 text-center">Invites Sent</th>
              <th className="px-4 py-3.5">Registered</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {loading ? (
              <tr>
                <td colSpan={7} className="text-center py-10 text-slate-400">
                  Loading registrations from database...
                </td>
              </tr>
            ) : students.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-10 text-slate-400">
                  No matching student records found.
                </td>
              </tr>
            ) : (
              students.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50/60 transition-colors">
                  {/* Name and Email */}
                  <td className="px-4 py-3.5">
                    <div>
                      <span className="font-semibold text-slate-900 block">
                        {student.name}
                      </span>
                      <span className="text-slate-400 text-[11px] font-mono">
                        {student.email}
                      </span>
                    </div>
                  </td>

                  {/* College */}
                  <td className="px-4 py-3.5 font-medium text-slate-800 max-w-xs truncate">
                    {student.collegeName}
                  </td>

                  {/* Batch */}
                  <td className="px-4 py-3.5">
                    <span className={`px-2 py-0.5 rounded-full font-semibold text-[10px] ${
                      student.graduationYear === '2027'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200/80'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      Class of {student.graduationYear}
                    </span>
                  </td>

                  {/* Referral Code */}
                  <td className="px-4 py-3.5 font-mono font-bold text-indigo-600">
                    {student.referralCode}
                  </td>

                  {/* Channel / Referred By */}
                  <td className="px-4 py-3.5">
                    {student.referredBy ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-violet-700 bg-violet-50 px-2 py-0.5 rounded border border-violet-200">
                        Via {student.referredBy}
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-[11px] text-slate-400 font-medium">
                        Direct
                      </span>
                    )}
                  </td>

                  {/* Referral Count */}
                  <td className="px-4 py-3.5 text-center">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-xs ${
                      student.referralCount > 0
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-50 text-slate-400'
                    }`}>
                      <Users className="h-3 w-3" />
                      <span>{student.referralCount}</span>
                    </span>
                  </td>

                  {/* Registered At */}
                  <td className="px-4 py-3.5 text-slate-400 text-[11px] whitespace-nowrap">
                    {new Date(student.registeredAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 text-xs text-slate-500">
        <div>
          Showing page <span className="font-semibold text-slate-900">{pagination.page}</span> of{' '}
          <span className="font-semibold text-slate-900">{pagination.totalPages}</span> ({pagination.total} registrations)
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchStudents(pagination.page - 1)}
            disabled={pagination.page <= 1 || loading}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-medium"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Previous</span>
          </button>

          <button
            onClick={() => fetchStudents(pagination.page + 1)}
            disabled={pagination.page >= pagination.totalPages || loading}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-medium"
          >
            <span>Next</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
