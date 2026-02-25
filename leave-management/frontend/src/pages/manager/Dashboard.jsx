import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import StatusBadge from '../../components/StatusBadge';
import API from '../../utils/api';
import { format } from 'date-fns';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function ManagerDashboard() {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      API.get('/leaves/stats'),
      API.get('/leaves?status=pending'),
    ]).then(([statsRes, leavesRes]) => {
      setStats(statsRes.data.stats);
      setRecent(leavesRes.data.leaves.slice(0, 6));
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const chartData = stats ? {
    labels: ['Pending', 'Approved', 'Rejected'],
    datasets: [{
      data: [stats.pending, stats.approved, stats.rejected],
      backgroundColor: ['#e57d51', '#669e80', '#b91c1c'],
      borderRadius: 8,
      borderWidth: 0,
    }]
  } : null;

  const chartOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      y: { grid: { color: '#f0ebe3' }, ticks: { font: { family: 'DM Sans' } } },
      x: { grid: { display: false }, ticks: { font: { family: 'DM Sans' } } },
    },
  };

  return (
    <Layout>
      {/* Header */}
      <div className="flex items-center justify-between mb-8 animate-fade-up">
        <div>
          <h1 className="font-display text-3xl text-ink-900 font-semibold">Manager Dashboard</h1>
          <p className="text-ink-500 text-sm font-body mt-1">{format(new Date(), 'EEEE, MMMM d, yyyy')}</p>
        </div>
        <Link to="/manager/requests"
          className="bg-ink-900 hover:bg-ink-800 text-cream px-5 py-2.5 rounded-lg font-body text-sm font-medium transition-all shadow-paper">
          View All Requests →
        </Link>
      </div>

      {/* Stats cards */}
      {stats && (
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Requests', value: stats.total, color: 'text-ink-800', bg: 'bg-white' },
            { label: 'Pending', value: stats.pending, color: 'text-clay-600', bg: 'bg-clay-50' },
            { label: 'Approved', value: stats.approved, color: 'text-sage-600', bg: 'bg-sage-50' },
            { label: 'Employees', value: stats.totalEmployees, color: 'text-ink-700', bg: 'bg-ink-50' },
          ].map((s, i) => (
            <div key={s.label} className={`${s.bg} rounded-xl p-5 border border-ink-100 shadow-paper animate-fade-up stagger-${i + 1}`}>
              <p className={`font-display text-3xl font-semibold ${s.color}`}>{s.value}</p>
              <p className="text-ink-500 text-xs font-body mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-5 gap-6">
        {/* Chart */}
        <div className="col-span-2 bg-white rounded-xl border border-ink-100 shadow-paper p-6 animate-fade-up stagger-2">
          <h2 className="font-display text-lg text-ink-800 font-semibold mb-4">Leave Overview</h2>
          {chartData && <Bar data={chartData} options={chartOptions} />}
        </div>

        {/* Pending requests */}
        <div className="col-span-3 bg-white rounded-xl border border-ink-100 shadow-paper overflow-hidden animate-fade-up stagger-3">
          <div className="px-6 py-4 border-b border-ink-100 flex items-center justify-between">
            <h2 className="font-display text-lg text-ink-800 font-semibold">Pending Approvals</h2>
            <span className="bg-clay-100 text-clay-700 text-xs font-medium px-2.5 py-1 rounded-full font-body">
              {recent.length} pending
            </span>
          </div>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-6 h-6 border-2 border-clay-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : recent.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-ink-400 font-body text-sm">All caught up! No pending requests.</p>
            </div>
          ) : (
            <div className="divide-y divide-ink-50">
              {recent.map(leave => (
                <div key={leave._id} className="px-6 py-4 flex items-center justify-between hover:bg-parchment transition-colors">
                  <div>
                    <p className="text-sm font-medium text-ink-800 font-body">{leave.employee?.name}</p>
                    <p className="text-xs text-ink-400 font-body mt-0.5">
                      <span className="capitalize">{leave.leaveType}</span> ·{' '}
                      {format(new Date(leave.startDate), 'MMM d')} – {format(new Date(leave.endDate), 'MMM d')} ·{' '}
                      {leave.totalDays} days
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={leave.status} />
                    <Link to="/manager/requests" className="text-xs text-clay-500 hover:text-clay-600 font-body border border-clay-200 px-3 py-1.5 rounded-lg">
                      Review
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
