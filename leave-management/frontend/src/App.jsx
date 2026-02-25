import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import EmployeeDashboard from './pages/employee/Dashboard';
import ApplyLeave from './pages/employee/ApplyLeave';
import MyLeaves from './pages/employee/MyLeaves';
import ManagerDashboard from './pages/manager/Dashboard';
import LeaveRequests from './pages/manager/LeaveRequests';
import AdminPanel from './pages/admin/AdminPanel';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) return (
    <div className="min-h-screen bg-cream flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-clay-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-ink-500 text-sm font-body">Loading...</p>
      </div>
    </div>
  );

  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === 'admin') return <Navigate to="/admin" replace />;
    if (user.role === 'manager') return <Navigate to="/manager" replace />;
    return <Navigate to="/employee" replace />;
  }
  return children;
};

const RoleRedirect = () => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'admin') return <Navigate to="/admin" replace />;
  if (user.role === 'manager') return <Navigate to="/manager" replace />;
  return <Navigate to="/employee" replace />;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1e1a16',
              color: '#faf8f5',
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '14px',
              borderRadius: '8px',
              padding: '12px 16px',
            },
            success: { iconTheme: { primary: '#447f62', secondary: '#faf8f5' } },
            error: { iconTheme: { primary: '#d95f2e', secondary: '#faf8f5' } },
          }}
        />
        <Routes>
          <Route path="/" element={<RoleRedirect />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Employee Routes */}
          <Route path="/employee" element={
            <ProtectedRoute allowedRoles={['employee', 'manager', 'admin']}>
              <EmployeeDashboard />
            </ProtectedRoute>
          } />
          <Route path="/employee/apply" element={
            <ProtectedRoute allowedRoles={['employee', 'manager', 'admin']}>
              <ApplyLeave />
            </ProtectedRoute>
          } />
          <Route path="/employee/leaves" element={
            <ProtectedRoute allowedRoles={['employee', 'manager', 'admin']}>
              <MyLeaves />
            </ProtectedRoute>
          } />

          {/* Manager Routes */}
          <Route path="/manager" element={
            <ProtectedRoute allowedRoles={['manager', 'admin']}>
              <ManagerDashboard />
            </ProtectedRoute>
          } />
          <Route path="/manager/requests" element={
            <ProtectedRoute allowedRoles={['manager', 'admin']}>
              <LeaveRequests />
            </ProtectedRoute>
          } />

          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminPanel />
            </ProtectedRoute>
          } />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
