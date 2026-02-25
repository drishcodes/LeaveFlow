import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import StatusBadge from '../../components/StatusBadge';
import API from '../../utils/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export default function LeaveRequests() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [reviewing, setReviewing] = useState(null);
  const [comment, setComment] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchLeaves = () => {
    setLoading(true);
    const url = filter === 'all' ? '/leaves' : `/leaves?status=${filter}`;
    API.get(url)
      .then(res => setLeaves(res.data.leaves))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchLeaves(); }, [filter]);

  const handleReview = async (leave, status) => {
    setActionLoading(true);
    try {
      await API.put(`/leaves/${leave._id}/review`, { status, reviewComment: comment });
      toast.success(`Leave ${status} successfully`);
      setReviewing(null);
      setComment('');
      fetchLeaves();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <Layout>
      {/* Header */}
      <div className="flex items-center justify-between mb-8 animate-fade-up">
        <div>
          <h1 className="font-display text-3xl text-ink-900 font-semibold">Leave Requests</h1>
          <p className="text-ink-500 text-sm font-body mt-1">Review and manage employee leave applications</p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-1 mb-6 p-1 bg-parchment rounded-lg w-fit animate-fade-up stagger-1">
        {['pending', 'approved', 'rejected', 'all'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-md text-sm font-body font-medium capitalize transition-all ${
              filter === f ? 'bg-white text-ink-800 shadow-paper' : 'text-ink-500 hover:text-ink-700'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-ink-100 shadow-paper overflow-hidden animate-fade-up stagger-2">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-parchment border-b border-ink-100">
                <th className="text-left px-6 py-3 text-xs font-medium text-ink-500 uppercase tracking-wider font-body">Employee</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-ink-500 uppercase tracking-wider font-body">Type</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-ink-500 uppercase tracking-wider font-body">Duration</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-ink-500 uppercase tracking-wider font-body">Days</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-ink-500 uppercase tracking-wider font-body">Status</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-ink-500 uppercase tracking-wider font-body">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-50">
              {loading ? (
                <tr><td colSpan={6} className="text-center py-12">
                  <div className="w-6 h-6 border-2 border-clay-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                </td></tr>
              ) : leaves.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-12 text-ink-400 font-body text-sm">No {filter} requests found</td></tr>
              ) : leaves.map(leave => (
                <tr key={leave._id} className="hover:bg-parchment transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-ink-800 font-body">{leave.employee?.name}</p>
                      <p className="text-xs text-ink-400 font-body">{leave.employee?.department}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-ink-700 font-body capitalize">{leave.leaveType}</td>
                  <td className="px-6 py-4 text-sm text-ink-600 font-body">
                    {format(new Date(leave.startDate), 'MMM d')} – {format(new Date(leave.endDate), 'MMM d, yyyy')}
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mono text-sm text-ink-700">{leave.totalDays}d</span>
                  </td>
                  <td className="px-6 py-4"><StatusBadge status={leave.status} /></td>
                  <td className="px-6 py-4">
                    {leave.status === 'pending' ? (
                      <button
                        onClick={() => { setReviewing(leave); setComment(''); }}
                        className="text-xs text-clay-600 border border-clay-200 hover:bg-clay-50 px-3 py-1.5 rounded-lg font-body transition-all"
                      >
                        Review
                      </button>
                    ) : (
                      <span className="text-xs text-ink-400 font-body">
                        {leave.reviewedBy?.name && `By ${leave.reviewedBy.name}`}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Modal */}
      {reviewing && (
        <div className="fixed inset-0 bg-ink-900 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-float w-full max-w-md animate-fade-up">
            <div className="p-6 border-b border-ink-100">
              <h3 className="font-display text-xl text-ink-900 font-semibold">Review Leave Request</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-parchment rounded-xl p-4">
                <p className="text-sm font-medium text-ink-800 font-body">{reviewing.employee?.name}</p>
                <p className="text-sm text-ink-600 font-body capitalize mt-1">{reviewing.leaveType} Leave · {reviewing.totalDays} days</p>
                <p className="text-xs text-ink-500 font-body mt-1">
                  {format(new Date(reviewing.startDate), 'MMM d')} – {format(new Date(reviewing.endDate), 'MMM d, yyyy')}
                </p>
                <p className="text-sm text-ink-600 font-body mt-3 italic">"{reviewing.reason}"</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-ink-600 mb-2 uppercase tracking-wider font-body">Comment (optional)</label>
                <textarea
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  placeholder="Add a note for the employee..."
                  rows={3}
                  className="w-full bg-parchment border border-ink-200 rounded-lg px-4 py-3 text-ink-900 text-sm font-body focus:border-clay-400 transition-all resize-none"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setReviewing(null)}
                  className="flex-1 border border-ink-200 text-ink-600 py-2.5 rounded-lg font-body text-sm hover:bg-parchment transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleReview(reviewing, 'rejected')}
                  disabled={actionLoading}
                  className="flex-1 border border-red-200 text-red-600 hover:bg-red-50 py-2.5 rounded-lg font-body text-sm transition-all disabled:opacity-60"
                >
                  Reject
                </button>
                <button
                  onClick={() => handleReview(reviewing, 'approved')}
                  disabled={actionLoading}
                  className="flex-1 bg-sage-600 hover:bg-sage-700 text-cream py-2.5 rounded-lg font-body text-sm transition-all disabled:opacity-60"
                >
                  {actionLoading ? '...' : 'Approve'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
