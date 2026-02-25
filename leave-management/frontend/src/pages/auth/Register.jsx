import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const departments = ['Engineering', 'Design', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations', 'Legal', 'General'];

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', department: 'General', role: 'employee' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) {
      return toast.error('Password must be at least 6 characters');
    }
    setLoading(true);
    try {
      const user = await register(form);
      toast.success(`Account created! Welcome, ${user.name.split(' ')[0]}!`);
      navigate('/employee');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg animate-fade-up">
        <div className="text-center mb-8">
          <Link to="/login" className="font-display text-3xl text-ink-900 font-semibold">
            Leave<span className="text-clay-500">Flow</span>
          </Link>
          <p className="text-ink-500 text-sm font-body mt-2">Create your employee account</p>
          <div className="rule-line mt-4"></div>
        </div>

        <div className="bg-white rounded-2xl shadow-card p-8 border border-ink-100">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-xs font-medium text-ink-600 mb-2 uppercase tracking-wider font-body">Full Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="John Doe"
                  required
                  className="w-full bg-parchment border border-ink-200 rounded-lg px-4 py-3 text-ink-900 text-sm font-body placeholder-ink-300 focus:border-clay-400 transition-all"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-xs font-medium text-ink-600 mb-2 uppercase tracking-wider font-body">Email Address</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="you@company.com"
                  required
                  className="w-full bg-parchment border border-ink-200 rounded-lg px-4 py-3 text-ink-900 text-sm font-body placeholder-ink-300 focus:border-clay-400 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-ink-600 mb-2 uppercase tracking-wider font-body">Department</label>
                <select
                  value={form.department}
                  onChange={e => setForm({ ...form, department: e.target.value })}
                  className="w-full bg-parchment border border-ink-200 rounded-lg px-4 py-3 text-ink-900 text-sm font-body focus:border-clay-400 transition-all"
                >
                  {departments.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-ink-600 mb-2 uppercase tracking-wider font-body">Role</label>
                <select
                  value={form.role}
                  onChange={e => setForm({ ...form, role: e.target.value })}
                  className="w-full bg-parchment border border-ink-200 rounded-lg px-4 py-3 text-ink-900 text-sm font-body focus:border-clay-400 transition-all"
                >
                  <option value="employee">Employee</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="col-span-2">
                <label className="block text-xs font-medium text-ink-600 mb-2 uppercase tracking-wider font-body">Password</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="Minimum 6 characters"
                  required
                  minLength={6}
                  className="w-full bg-parchment border border-ink-200 rounded-lg px-4 py-3 text-ink-900 text-sm font-body placeholder-ink-300 focus:border-clay-400 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-clay-500 hover:bg-clay-600 text-cream py-3 rounded-lg font-body font-medium text-sm transition-all duration-150 shadow-paper flex items-center justify-center gap-2 disabled:opacity-60 mt-2"
            >
              {loading ? (
                <><span className="w-4 h-4 border-2 border-cream border-t-transparent rounded-full animate-spin"></span> Creating...</>
              ) : 'Create Account →'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-ink-500 mt-6 font-body">
          Already have an account?{' '}
          <Link to="/login" className="text-clay-600 hover:text-clay-500 font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
