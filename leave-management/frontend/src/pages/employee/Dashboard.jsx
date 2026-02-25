import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import StatusBadge from '../../components/StatusBadge';
import { useAuth } from '../../context/AuthContext';
import API from '../../utils/api';
import { format } from 'date-fns';

const BalanceCard = ({ label, used, total, color, delay }) => {
  const remaining = total - used;
  const pct = Math.max(0, Math.min(100, (remaining / total) * 100));
  return (
    <div className={`bg-white rounded-xl p-5 border border-ink-100 shadow-paper animate-fade-up ${delay}`}>
      <div className="flex justify-between items-start mb-3">
        <p className="text-xs font-medium text-ink-400 uppercase tracking-wider font-body">{label}</p>
        <span className={`text-2xl font-display font-semibold ${color}`}>{remaining}</span>
      </div>
      <div className="h-1.5 bg-ink-100 rounded-full overflow-hidden mb-2">
        <div className={`h-full rounded-full ${color.replace('text-', 'bg-')} transition-all duration-700`}
          style={{ width: `${pct}%` }}></div>
      </div>
      <p className="text-xs text-ink-400 font-body">{remaining} of {total} days remaining</p>
    </div>
  );
};

export default function EmployeeDashboard() {
  const { user } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/leaves/my')
      .then(res => setLeaves(res.data.leaves))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const stats = {
    pending: leaves.filter(l => l.status === 'pending').length,
    approved: leaves.filter(l => l.status === 'approved').length,
    rejected: leaves.filter(l => l.status === 'rejected').length,
  };

  const recent = leaves.slice(0, 5);
  const balance = user?.leaveBalance || { annual: 15, sick: 10, casual: 5 };

  return (
    <Layout>
      {/* Header */}
      <div className="flex items-start justify-between mb-8 animate-fade-up">
        <div>
          <p className="text-ink-400 text-sm font-body mb-1">
            {format(new Date(), 'EEEE, MMMM d, yyyy')}
          </p>
          <h1 className="font-display text-3xl text-ink-900 font-semibold">
            Good morning, <span className="text-clay-500">{user?.name?.split(' ')[0]}</span>
          </h1>
          <p className="text-ink-500 text-sm font-body mt-1">{user?.department} · {user?.role}</p>
        </div>
        <Link
          to="/employee/apply"
          className="bg-ink-900 hover:bg-ink-800 text-cream px-5 py-2.5 rounded-lg font-body text-sm font-medium transition-all flex items-center gap-2 shadow-paper"
        >
          <span>+</span> Apply Leave
        </Link>
      </div>

      {/* Leave Balance Cards */}
      <div className="mb-8">
        <p className="text-xs font-medium text-ink-400 uppercase tracking-wider mb-3 font-body">Leave Balance</p>
        <div className="grid grid-cols-3 gap-4">
          <BalanceCard label="Annual Leave" used={0} total={balance.annual} color="text-clay-500" delay="stagger-1" />
          <BalanceCard label="Sick Leave" used={0} total={balance.sick} color="text-sage-500" delay="stagger-2" />
          <BalanceCard label="Casual Leave" used={0} total={balance.casual} color="text-ink-600" delay="stagger-3" />
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Pending', value: stats.pending, color: 'text-clay-500', bg: 'bg-clay-50' },
          { label: 'Approved', value: stats.approved, color: 'text-sage-600', bg: 'bg-sage-50' },
          { label: 'Rejected', value: stats.rejected, color: 'text-red-600', bg: 'bg-red-50' },
        ].map((s, i) => (
          <div key={s.label} className={`${s.bg} rounded-xl p-4 border border-ink-100 animate-fade-up stagger-${i + 2}`}>
            <p className={`font-display text-3xl font-semibold ${s.color}`}>{s.value}</p>
            <p className="text-ink-500 text-xs font-body mt-1">{s.label} Requests</p>
          </div>
        ))}
      </div>

      {/* Recent leaves */}
      <div className="bg-white rounded-xl border border-ink-100 shadow-paper overflow-hidden animate-fade-up stagger-4">
        <div className="px-6 py-4 border-b border-ink-100 flex items-center justify-between">
          <h2 className="font-display text-lg text-ink-800 font-semibold">Recent Leave Requests</h2>
          <Link to="/employee/leaves" className="text-clay-500 text-sm font-body hover:text-clay-600">View all →</Link>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-6 h-6 border-2 border-clay-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : recent.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-ink-400 font-body text-sm">No leave requests yet.</p>
            <Link to="/employee/apply" className="text-clay-500 text-sm mt-2 inline-block hover:text-clay-600">Apply for your first leave →</Link>
          </div>
        ) : (
          <div className="divide-y divide-ink-50">
            {recent.map((leave) => (
              <div key={leave._id} className="px-6 py-4 flex items-center justify-between hover:bg-parchment transition-colors">
                <div>
                  <p className="text-sm font-medium text-ink-800 font-body capitalize">{leave.leaveType} Leave</p>
                  <p className="text-xs text-ink-400 font-body mt-0.5">
                    {format(new Date(leave.startDate), 'MMM d')} – {format(new Date(leave.endDate), 'MMM d, yyyy')}
                    <span className="mx-2">·</span>{leave.totalDays} day{leave.totalDays !== 1 ? 's' : ''}
                  </p>
                </div>
                <StatusBadge status={leave.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
