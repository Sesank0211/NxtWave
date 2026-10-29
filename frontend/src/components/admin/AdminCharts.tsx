import React from 'react';
import '../../utils/chartSetup';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import { TrendingUp, PieChart, Building } from 'lucide-react';
import type { ChartAnalytics } from '../../types';

interface AdminChartsProps {
  data: ChartAnalytics;
}

export const AdminCharts: React.FC<AdminChartsProps> = ({ data }) => {
  // 1. Timeline Line Chart configuration
  const timelineDates = data.timeline.map((t) => t.date);
  const timelineTotals = data.timeline.map((t) => t.total);
  const timelineViral = data.timeline.map((t) => t.viral);

  const lineChartData = {
    labels: timelineDates.length > 0 ? timelineDates : ['Today'],
    datasets: [
      {
        label: 'Total Signups',
        data: timelineTotals.length > 0 ? timelineTotals : [0],
        borderColor: '#2563EB', // Blue 600
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        tension: 0.35,
        fill: true,
        pointBackgroundColor: '#2563EB',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 4,
      },
      {
        label: 'Viral Referrals',
        data: timelineViral.length > 0 ? timelineViral : [0],
        borderColor: '#7C3AED', // Violet 600
        backgroundColor: 'rgba(124, 58, 237, 0.05)',
        tension: 0.35,
        fill: true,
        pointBackgroundColor: '#7C3AED',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 4,
      },
    ],
  };

  const lineChartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          boxWidth: 12,
          font: { family: "'Plus Jakarta Sans', sans-serif", size: 12 },
          color: '#475569',
        },
      },
      tooltip: {
        backgroundColor: '#0F172A',
        titleFont: { family: "'Plus Jakarta Sans', sans-serif", size: 12 },
        bodyFont: { family: "'Plus Jakarta Sans', sans-serif", size: 12 },
        padding: 10,
        cornerRadius: 8,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
          color: '#94A3B8',
          font: { family: "'Plus Jakarta Sans', sans-serif", size: 11 },
        },
        grid: { color: '#F1F5F9' },
      },
      x: {
        ticks: {
          color: '#94A3B8',
          font: { family: "'Plus Jakarta Sans', sans-serif", size: 11 },
        },
        grid: { display: false },
      },
    },
  };

  // 2. Acquisition source Doughnut Chart
  const sourceLabels = data.sourceDistribution.map((item) => item.source);
  const sourceCounts = data.sourceDistribution.map((item) => item.count);

  const doughnutData = {
    labels: sourceLabels.length > 0 ? sourceLabels : ['No registrations'],
    datasets: [
      {
        data: sourceCounts.length > 0 ? sourceCounts : [0],
        backgroundColor: [
          '#2563EB', // Blue 600 (Target)
          '#7C3AED', // Violet 600
          '#06B6D4', // Cyan 500
          '#10B981', // Emerald 500
          '#F59E0B', // Amber 500
        ],
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    ],
  };

  const doughnutOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 10,
          font: { family: "'Plus Jakarta Sans', sans-serif", size: 11 },
          color: '#475569',
        },
      },
    },
    cutout: '70%',
  };

  // 3. Top Colleges Bar Chart
  const collegeLabels = data.topColleges.map((c) => 
    c.college.length > 20 ? `${c.college.slice(0, 18)}...` : c.college
  );
  const collegeCounts = data.topColleges.map((c) => c.count);

  const barChartData = {
    labels: collegeLabels.length > 0 ? collegeLabels : ['No Data'],
    datasets: [
      {
        label: 'Registrations',
        data: collegeCounts.length > 0 ? collegeCounts : [0],
        backgroundColor: '#4F46E5', // Indigo 600
        borderRadius: 6,
      },
    ],
  };

  const barChartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#0F172A',
        padding: 10,
        cornerRadius: 8,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
          color: '#94A3B8',
          font: { family: "'Plus Jakarta Sans', sans-serif", size: 11 },
        },
        grid: { color: '#F1F5F9' },
      },
      x: {
        ticks: {
          color: '#64748B',
          font: { family: "'Plus Jakarta Sans', sans-serif", size: 10 },
          maxRotation: 25,
          minRotation: 0,
        },
        grid: { display: false },
      },
    },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Timeline Chart (8 cols) */}
      <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4.5 w-4.5 text-blue-600" />
            <h3 className="text-base font-bold text-slate-900">Registration Velocity</h3>
          </div>
          <span className="text-xs text-slate-400 font-medium">Daily Timeline</span>
        </div>
        <div className="h-64 sm:h-72 w-full">
          <Line data={lineChartData} options={lineChartOptions} />
        </div>
      </div>

      {/* Acquisition Sources (4 cols) */}
      <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <PieChart className="h-4.5 w-4.5 text-violet-600" />
            <h3 className="text-base font-bold text-slate-900">Acquisition Sources</h3>
          </div>
          <span className="text-xs text-slate-400 font-medium">Referral vs direct</span>
        </div>
        <div className="h-64 sm:h-72 w-full flex items-center justify-center">
          <Doughnut data={doughnutData} options={doughnutOptions} />
        </div>
      </div>

      {/* Top Colleges Representation (12 cols) */}
      <div className="lg:col-span-12 bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Building className="h-4.5 w-4.5 text-indigo-600" />
            <h3 className="text-base font-bold text-slate-900">Top Participating Institutions</h3>
          </div>
          <span className="text-xs text-slate-400 font-medium">Highest Student Density</span>
        </div>
        <div className="h-56 w-full">
          <Bar data={barChartData} options={barChartOptions} />
        </div>
      </div>
    </div>
  );
};
