import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name.split(' ')[0]}!`);
      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'manager') navigate('/manager');
      else navigate('/employee');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex">
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-ink-950 flex-col justify-between p-12 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-clay-500 opacity-10"></div>
        <div className="absolute -bottom-40 -right-20 w-96 h-96 rounded-full bg-sage-500 opacity-10"></div>
        <div className="absolute top-1/3 right-0 w-64 h-64 rounded-full bg-ink-800 opacity-60"></div>

        {/* Logo */}
        <div className="relative z-10">
          <h1 className="font-display text-4xl text-cream font-semibold">
            Leave<span className="text-clay-400">Flow</span>
          </h1>
          <div className="w-12 h-0.5 bg-clay-500 mt-3"></div>
        </div>

        {/* Quote */}
        <div className="relative z-10">
          <p className="font-display text-3xl text-cream leading-relaxed italic">
            "Work-life balance<br />starts with<br />great HR tools."
          </p>
          <div className="mt-8 flex gap-4">
            <div className="text-center">
              <p className="text-clay-400 font-display text-2xl font-semibold">500+</p>
              <p className="text-ink-400 text-xs font-body">Employees</p>
            </div>
            <div className="w-px bg-ink-700"></div>
            <div className="text-center">
              <p className="text-sage-400 font-display text-2xl font-semibold">99%</p>
              <p className="text-ink-400 text-xs font-body">Satisfaction</p>
            </div>
            <div className="w-px bg-ink-700"></div>
            <div className="text-center">
              <p className="text-cream font-display text-2xl font-semibold">24/7</p>
              <p className="text-ink-400 text-xs font-body">Available</p>
            </div>
          </div>
        </div>

        {/* Bottom pattern */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-ink-700 to-transparent"></div>
      </div>

      {/* Right login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8 py-12">
        <div className="w-full max-w-md animate-fade-up">
          {/* Mobile logo */}
          <div className="lg:hidden mb-8 text-center">
            <h1 className="font-display text-3xl text-ink-900 font-semibold">
              Leave<span className="text-clay-500">Flow</span>
            </h1>
          </div>

          <div>
            <h2 className="font-display text-3xl text-ink-900 font-semibold">Welcome back</h2>
            <p className="text-ink-500 text-sm font-body mt-2">Sign in to your account to continue</p>
            <div className="rule-line mt-4 mb-6"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-ink-600 mb-2 uppercase tracking-wider font-body">Email Address</label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="you@company.com"
                required
                className="w-full bg-parchment border border-ink-200 rounded-lg px-4 py-3 text-ink-900 text-sm font-body placeholder-ink-300 focus:border-clay-400 focus:ring-1 focus:ring-clay-300 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-ink-600 mb-2 uppercase tracking-wider font-body">Password</label>
              <input
                type="password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                required
                className="w-full bg-parchment border border-ink-200 rounded-lg px-4 py-3 text-ink-900 text-sm font-body placeholder-ink-300 focus:border-clay-400 focus:ring-1 focus:ring-clay-300 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-ink-900 hover:bg-ink-800 text-cream py-3 rounded-lg font-body font-medium text-sm transition-all duration-150 shadow-paper flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <><span className="w-4 h-4 border-2 border-cream border-t-transparent rounded-full animate-spin"></span> Signing in...</>
              ) : 'Sign In →'}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-6 p-4 bg-parchment rounded-lg border border-ink-100">
            <p className="text-xs font-medium text-ink-500 uppercase tracking-wider mb-2 font-body">Demo Credentials</p>
            <div className="space-y-1.5 text-xs font-mono text-ink-600">
              <p>admin@demo.com / admin123</p>
              <p>manager@demo.com / manager123</p>
              <p>employee@demo.com / employee123</p>
            </div>
          </div>

          <p className="text-center text-sm text-ink-500 mt-6 font-body">
            New employee?{' '}
            <Link to="/register" className="text-clay-600 hover:text-clay-500 font-medium">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
