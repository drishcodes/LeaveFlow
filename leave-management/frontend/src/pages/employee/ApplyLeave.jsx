import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';
import API from '../../utils/api';
import toast from 'react-hot-toast';

const leaveTypes = [
  { value: 'annual', label: 'Annual Leave', desc: 'Planned vacation or personal time', color: 'border-clay-300 bg-clay-50' },
  { value: 'sick', label: 'Sick Leave', desc: 'Medical illness or health issues', color: 'border-sage-300 bg-sage-50' },
  { value: 'casual', label: 'Casual Leave', desc: 'Short unplanned personal matters', color: 'border-ink-300 bg-ink-50' },
  { value: 'unpaid', label: 'Unpaid Leave', desc: 'Extended leave without pay', color: 'border-yellow-300 bg-yellow-50' },
];

export default function ApplyLeave() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    leaveType: '',
    startDate: '',
    endDate: '',
    reason: '',
  });
  const [loading, setLoading] = useState(false);

  const calcDays = () => {
    if (!form.startDate || !form.endDate) return 0;
    const ms = new Date(form.endDate) - new Date(form.startDate);
    if (ms < 0) return 0;
    return Math.round(ms / (1000 * 60 * 60 * 24)) + 1;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.leaveType) return toast.error('Please select a leave type');
    if (calcDays() <= 0) return toast.error('End date must be after start date');

    setLoading(true);
    try {
      await API.post('/leaves', form);
      toast.success('Leave request submitted!');
      navigate('/employee/leaves');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit');
    } finally {
      setLoading(false);
    }
  };

  const balance = user?.leaveBalance || {};
  const days = calcDays();

  return (
    <Layout>
      <div className="max-w-2xl mx-auto animate-fade-up">
        {/* Header */}
        <div className="mb-8">
          <button onClick={() => navigate(-1)} className="text-ink-400 hover:text-ink-600 text-sm font-body mb-4 flex items-center gap-1">
            ← Back
          </button>
          <h1 className="font-display text-3xl text-ink-900 font-semibold">Apply for Leave</h1>
          <p className="text-ink-500 text-sm font-body mt-1">Fill out the form below to submit your leave request</p>
          <div className="rule-line mt-4"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Leave Type */}
          <div>
            <label className="block text-xs font-medium text-ink-600 mb-3 uppercase tracking-wider font-body">Leave Type</label>
            <div className="grid grid-cols-2 gap-3">
              {leaveTypes.map((type) => (
                <button
                  type="button"
                  key={type.value}
                  onClick={() => setForm({ ...form, leaveType: type.value })}
                  className={`p-4 rounded-xl border-2 text-left transition-all duration-150 ${
                    form.leaveType === type.value
                      ? `${type.color} border-opacity-100`
                      : 'border-ink-100 bg-white hover:border-ink-200'
                  }`}
                >
                  <p className="font-medium text-sm text-ink-800 font-body">{type.label}</p>
                  <p className="text-xs text-ink-400 font-body mt-0.5">{type.desc}</p>
                  {type.value !== 'unpaid' && balance[type.value] !== undefined && (
                    <p className="text-xs font-mono text-ink-500 mt-2">{balance[type.value]} days available</p>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-ink-600 mb-2 uppercase tracking-wider font-body">Start Date</label>
              <input
                type="date"
                value={form.startDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={e => setForm({ ...form, startDate: e.target.value })}
                required
                className="w-full bg-parchment border border-ink-200 rounded-lg px-4 py-3 text-ink-900 text-sm font-body focus:border-clay-400 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-ink-600 mb-2 uppercase tracking-wider font-body">End Date</label>
              <input
                type="date"
                value={form.endDate}
                min={form.startDate || new Date().toISOString().split('T')[0]}
                onChange={e => setForm({ ...form, endDate: e.target.value })}
                required
                className="w-full bg-parchment border border-ink-200 rounded-lg px-4 py-3 text-ink-900 text-sm font-body focus:border-clay-400 transition-all"
              />
            </div>
          </div>

          {/* Duration indicator */}
          {days > 0 && (
            <div className="bg-ink-900 rounded-lg px-5 py-3 flex items-center justify-between animate-fade-up">
              <p className="text-cream text-sm font-body">Total duration</p>
              <p className="text-cream font-display text-lg font-semibold">{days} day{days !== 1 ? 's' : ''}</p>
            </div>
          )}

          {/* Reason */}
          <div>
            <label className="block text-xs font-medium text-ink-600 mb-2 uppercase tracking-wider font-body">Reason</label>
            <textarea
              value={form.reason}
              onChange={e => setForm({ ...form, reason: e.target.value })}
              placeholder="Briefly describe the reason for your leave request..."
              required
              rows={4}
              className="w-full bg-parchment border border-ink-200 rounded-lg px-4 py-3 text-ink-900 text-sm font-body placeholder-ink-300 focus:border-clay-400 transition-all resize-none"
            />
          </div>

          {/* Submit */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 border border-ink-200 text-ink-600 py-3 rounded-lg font-body font-medium text-sm hover:bg-parchment transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-clay-500 hover:bg-clay-600 text-cream py-3 rounded-lg font-body font-medium text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <><span className="w-4 h-4 border-2 border-cream border-t-transparent rounded-full animate-spin"></span> Submitting...</>
              ) : 'Submit Request →'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
