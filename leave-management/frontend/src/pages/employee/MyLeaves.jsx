import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import StatusBadge from '../../components/StatusBadge';
import API from '../../utils/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export default function MyLeaves() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const fetchLeaves = () => {
    setLoading(true);
    API.get('/leaves/my')
      .then(res => setLeaves(res.data.leaves))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchLeaves(); }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this leave request?')) return;
    try {
      await API.delete(`/leaves/${id}`);
      toast.success('Leave request cancelled');
      fetchLeaves();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel');
    }
  };

  const filtered = filter === 'all' ? leaves : leaves.filter(l => l.status === filter);

  return (
    <Layout>
      {/* Header */}
      <div className="flex items-center justify-between mb-8 animate-fade-up">
        <div>
          <h1 className="font-display text-3xl text-ink-900 font-semibold">My Leave History</h1>
          <p className="text-ink-500 text-sm font-body mt-1">Track all your leave requests and their status</p>
        </div>
        <Link
          to="/employee/apply"
          className="bg-ink-900 hover:bg-ink-800 text-cream px-5 py-2.5 rounded-lg font-body text-sm font-medium transition-all flex items-center gap-2 shadow-paper"
        >
          + Apply Leave
        </Link>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 mb-6 p-1 bg-parchment rounded-lg w-fit animate-fade-up stagger-1">
        {['all', 'pending', 'approved', 'rejected'].map(f => (
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

      {/* Leave list */}
      <div className="space-y-3 animate-fade-up stagger-2">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-7 h-7 border-2 border-clay-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-ink-100">
            <p className="text-ink-400 font-body">No {filter === 'all' ? '' : filter} leaves found.</p>
          </div>
        ) : (
          filtered.map(leave => (
            <div key={leave._id} className="bg-white rounded-xl border border-ink-100 shadow-paper p-5 hover:shadow-card transition-all">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-medium text-ink-800 font-body capitalize">{leave.leaveType} Leave</h3>
                    <StatusBadge status={leave.status} />
                  </div>
                  <div className="flex items-center gap-4 text-sm text-ink-500 font-body">
                    <span>
                      {format(new Date(leave.startDate), 'MMM d')} – {format(new Date(leave.endDate), 'MMM d, yyyy')}
                    </span>
                    <span className="w-1 h-1 bg-ink-300 rounded-full"></span>
                    <span>{leave.totalDays} day{leave.totalDays !== 1 ? 's' : ''}</span>
                    <span className="w-1 h-1 bg-ink-300 rounded-full"></span>
                    <span>Applied {format(new Date(leave.createdAt), 'MMM d, yyyy')}</span>
                  </div>
                  <p className="text-sm text-ink-500 font-body mt-2 italic">"{leave.reason}"</p>
                  {leave.reviewComment && (
                    <div className="mt-2 px-3 py-2 bg-parchment rounded-lg">
                      <p className="text-xs text-ink-500 font-body">
                        <span className="font-medium">Manager comment:</span> {leave.reviewComment}
                      </p>
                    </div>
                  )}
                </div>
                {leave.status === 'pending' && (
                  <button
                    onClick={() => handleCancel(leave._id)}
                    className="ml-4 text-xs text-red-400 hover:text-red-600 font-body border border-red-200 hover:border-red-400 px-3 py-1.5 rounded-lg transition-all"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </Layout>
  );
}
