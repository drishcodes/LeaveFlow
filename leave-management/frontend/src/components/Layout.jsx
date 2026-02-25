import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const navItems = {
  employee: [
    { label: 'Overview', path: '/employee', icon: '◈' },
    { label: 'Apply Leave', path: '/employee/apply', icon: '⊕' },
    { label: 'My Leaves', path: '/employee/leaves', icon: '◎' },
  ],
  manager: [
    { label: 'Dashboard', path: '/manager', icon: '◈' },
    { label: 'Leave Requests', path: '/manager/requests', icon: '◎' },
    { label: 'My Leaves', path: '/employee/leaves', icon: '☆' },
  ],
  admin: [
    { label: 'Admin Panel', path: '/admin', icon: '◈' },
    { label: 'Dashboard', path: '/manager', icon: '⊞' },
    { label: 'Leave Requests', path: '/manager/requests', icon: '◎' },
    { label: 'My Leaves', path: '/employee/leaves', icon: '☆' },
  ],
};

const roleColors = {
  employee: 'bg-clay-500',
  manager: 'bg-sage-500',
  admin: 'bg-ink-700',
};

const roleLabels = {
  employee: 'Employee',
  manager: 'Manager',
  admin: 'Administrator',
};

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const items = navItems[user?.role] || navItems.employee;

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-cream flex">
      {/* Sidebar */}
      <aside className={`${collapsed ? 'w-16' : 'w-64'} transition-all duration-300 bg-ink-950 flex flex-col relative z-10`}>
        {/* Logo */}
        <div className="p-5 border-b border-ink-800">
          {collapsed ? (
            <div className="w-8 h-8 bg-clay-500 rounded flex items-center justify-center">
              <span className="text-cream font-display font-bold text-sm">L</span>
            </div>
          ) : (
            <div>
              <h1 className="font-display text-xl text-cream font-semibold tracking-wide">
                Leave<span className="text-clay-400">Flow</span>
              </h1>
              <p className="text-ink-400 text-xs mt-0.5 font-body">HR Management Suite</p>
            </div>
          )}
        </div>

        {/* User info */}
        {!collapsed && (
          <div className="px-4 py-4 border-b border-ink-800">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-full ${roleColors[user?.role]} flex items-center justify-center flex-shrink-0`}>
                <span className="text-cream font-display font-semibold text-sm">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-cream text-sm font-medium truncate">{user?.name}</p>
                <span className="text-ink-400 text-xs">{roleLabels[user?.role]}</span>
              </div>
            </div>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1">
          {items.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 group
                  ${active
                    ? 'bg-ink-800 text-cream'
                    : 'text-ink-400 hover:text-cream hover:bg-ink-900'
                  }`}
              >
                <span className={`text-base flex-shrink-0 ${active ? 'text-clay-400' : 'group-hover:text-clay-400'}`}>
                  {item.icon}
                </span>
                {!collapsed && (
                  <span className="text-sm font-body font-medium">{item.label}</span>
                )}
                {active && !collapsed && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-clay-400"></span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom actions */}
        <div className="p-3 border-t border-ink-800 space-y-1">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-ink-400 hover:text-cream hover:bg-ink-900 transition-all text-sm"
          >
            <span>{collapsed ? '→' : '←'}</span>
            {!collapsed && <span className="font-body">Collapse</span>}
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-ink-400 hover:text-red-400 hover:bg-ink-900 transition-all text-sm"
          >
            <span>⊗</span>
            {!collapsed && <span className="font-body">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="min-h-full p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
