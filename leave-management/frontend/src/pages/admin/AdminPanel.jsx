import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import API from '../../utils/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const roles = ['employee', 'manager', 'admin'];

const roleColors = {
  employee: 'bg-clay-100 text-clay-700',
  manager: 'bg-sage-100 text-sage-700',
  admin: 'bg-ink-100 text-ink-700',
};

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editBalance, setEditBalance] = useState(null);
  const [balanceForm, setBalanceForm] = useState({ annual: 15, sick: 10, casual: 5 });

  const fetchUsers = () => {
    setLoading(true);
    API.get('/users')
      .then(res => setUsers(res.data.users))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleRoleChange = async (userId, role) => {
    try {
      await API.put(`/users/${userId}/role`, { role });
      toast.success('Role updated');
      fetchUsers();
    } catch (err) {
      toast.error('Failed to update role');
    }
  };

  const handleToggleStatus = async (userId) => {
    try {
      await API.put(`/users/${userId}/status`);
      toast.success('Status updated');
      fetchUsers();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handleDeleteUser = async (userId, name) => {
    if (!window.confirm(`Delete ${name}? This cannot be undone.`)) return;
    try {
      await API.delete(`/users/${userId}`);
      toast.success('User deleted');
      fetchUsers();
    } catch (err) {
      toast.error('Failed to delete user');
    }
  };

  const handleSaveBalance = async () => {
    try {
      await API.put(`/users/${editBalance._id}/balance`, { leaveBalance: balanceForm });
      toast.success('Leave balance updated');
      setEditBalance(null);
      fetchUsers();
    } catch (err) {
      toast.error('Failed to update balance');
    }
  };

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.department?.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total: users.length,
    employees: users.filter(u => u.role === 'employee').length,
    managers: users.filter(u => u.role === 'manager').length,
    admins: users.filter(u => u.role === 'admin').length,
  };

  return (
    <Layout>
      {/* Header */}
      <div className="flex items-center justify-between mb-8 animate-fade-up">
        <div>
          <h1 className="font-display text-3xl text-ink-900 font-semibold">Admin Panel</h1>
          <p className="text-ink-500 text-sm font-body mt-1">Manage users, roles, and permissions</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Users', value: stats.total, color: 'text-ink-800' },
          { label: 'Employees', value: stats.employees, color: 'text-clay-600' },
          { label: 'Managers', value: stats.managers, color: 'text-sage-600' },
          { label: 'Admins', value: stats.admins, color: 'text-ink-700' },
        ].map((s, i) => (
          <div key={s.label} className={`bg-white rounded-xl p-5 border border-ink-100 shadow-paper animate-fade-up stagger-${i + 1}`}>
            <p className={`font-display text-3xl font-semibold ${s.color}`}>{s.value}</p>
            <p className="text-ink-500 text-xs font-body mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="mb-4 animate-fade-up stagger-2">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, email, or department..."
          className="w-full max-w-md bg-white border border-ink-200 rounded-lg px-4 py-2.5 text-ink-900 text-sm font-body placeholder-ink-300 focus:border-clay-400 transition-all shadow-paper"
        />
      </div>

      {/* Users table */}
      <div className="bg-white rounded-xl border border-ink-100 shadow-paper overflow-hidden animate-fade-up stagger-3">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-parchment border-b border-ink-100">
                <th className="text-left px-6 py-3 text-xs font-medium text-ink-500 uppercase tracking-wider font-body">User</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-ink-500 uppercase tracking-wider font-body">Role</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-ink-500 uppercase tracking-wider font-body">Dept</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-ink-500 uppercase tracking-wider font-body">Leave Balance</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-ink-500 uppercase tracking-wider font-body">Status</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-ink-500 uppercase tracking-wider font-body">Joined</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-ink-500 uppercase tracking-wider font-body">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-50">
              {loading ? (
                <tr><td colSpan={7} className="text-center py-12">
                  <div className="w-6 h-6 border-2 border-clay-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                </td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-12 text-ink-400 font-body text-sm">No users found</td></tr>
              ) : filtered.map(user => (
                <tr key={user._id} className="hover:bg-parchment transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full ${roleColors[user.role]} flex items-center justify-center text-xs font-semibold font-body`}>
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-ink-800 font-body">{user.name}</p>
                        <p className="text-xs text-ink-400 font-body">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={user.role}
                      onChange={e => handleRoleChange(user._id, e.target.value)}
                      className={`text-xs font-medium px-2.5 py-1 rounded-full border-0 font-body cursor-pointer ${roleColors[user.role]} focus:ring-1 focus:ring-clay-300`}
                    >
                      {roles.map(r => <option key={r} value={r} className="bg-white text-ink-800">{r}</option>)}
                    </select>
                  </td>
                  <td className="px-6 py-4 text-sm text-ink-600 font-body">{user.department}</td>
                  <td className="px-6 py-4">
                    <div className="text-xs text-ink-500 font-mono">
                      A:{user.leaveBalance?.annual} S:{user.leaveBalance?.sick} C:{user.leaveBalance?.casual}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleToggleStatus(user._id)}
                      className={`text-xs font-medium px-2.5 py-1 rounded-full font-body transition-all ${
                        user.isActive ? 'bg-sage-100 text-sage-700 hover:bg-sage-200' : 'bg-red-100 text-red-700 hover:bg-red-200'
                      }`}
                    >
                      {user.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-xs text-ink-400 font-body">
                    {format(new Date(user.createdAt), 'MMM d, yyyy')}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => { setEditBalance(user); setBalanceForm(user.leaveBalance); }}
                        className="text-xs text-clay-500 hover:text-clay-700 font-body border border-clay-200 hover:border-clay-400 px-2.5 py-1 rounded-lg transition-all"
                      >
                        Balance
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user._id, user.name)}
                        className="text-xs text-red-400 hover:text-red-600 font-body border border-red-200 hover:border-red-400 px-2.5 py-1 rounded-lg transition-all"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Balance Edit Modal */}
      {editBalance && (
        <div className="fixed inset-0 bg-ink-900 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-float w-full max-w-sm animate-fade-up">
            <div className="p-5 border-b border-ink-100">
              <h3 className="font-display text-lg text-ink-900 font-semibold">Edit Leave Balance</h3>
              <p className="text-sm text-ink-500 font-body mt-0.5">{editBalance.name}</p>
            </div>
            <div className="p-5 space-y-4">
              {[
                { key: 'annual', label: 'Annual Leave' },
                { key: 'sick', label: 'Sick Leave' },
                { key: 'casual', label: 'Casual Leave' },
              ].map(({ key, label }) => (
                <div key={key} className="flex items-center justify-between">
                  <label className="text-sm font-body text-ink-700">{label}</label>
                  <input
                    type="number"
                    value={balanceForm[key]}
                    onChange={e => setBalanceForm({ ...balanceForm, [key]: +e.target.value })}
                    min={0}
                    max={365}
                    className="w-20 bg-parchment border border-ink-200 rounded-lg px-3 py-2 text-center text-sm font-mono text-ink-900 focus:border-clay-400"
                  />
                </div>
              ))}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setEditBalance(null)}
                  className="flex-1 border border-ink-200 text-ink-600 py-2.5 rounded-lg font-body text-sm hover:bg-parchment transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveBalance}
                  className="flex-1 bg-ink-900 hover:bg-ink-800 text-cream py-2.5 rounded-lg font-body text-sm transition-all"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
