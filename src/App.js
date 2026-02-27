import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';
import { AdminAuthProvider, useAdminAuth } from './admin/context/AdminAuthContext';
import AdminLayout from './admin/components/AdminLayout';
import AdminLoginPage from './admin/pages/AdminLoginPage';
import AdminCouponsPage from './admin/pages/AdminCouponsPage';
import AdminCoursesPage from './admin/pages/AdminCoursesPage';
import AdminUniversitiesPage from './admin/pages/AdminUniversitiesPage';

import './admin/admin.css';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname]);
  return null;
}

/** Redirects unauthenticated users to login */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAdminAuth();
  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;
  return children;
};

/** Redirects authenticated admins away from login */
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAdminAuth();
  if (isAuthenticated) return <Navigate to="/admin/coupons" replace />;
  return children;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route
        path="/admin/login"
        element={
          <PublicRoute>
            <AdminLoginPage />
          </PublicRoute>
        }
      />

      {/* Protected admin shell */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <Routes>
                <Route path="coupons" element={<AdminCouponsPage />} />
                <Route path="courses" element={<AdminCoursesPage />} />
                <Route path="universities" element={<AdminUniversitiesPage />} />

                <Route path="*" element={<Navigate to="coupons" replace />} />
              </Routes>
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      {/* Catch-all → admin login */}
      <Route path="*" element={<Navigate to="/admin/login" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AdminAuthProvider>
      <Router>
        <ScrollToTop />
        <AppRoutes />
      </Router>
    </AdminAuthProvider>
  );
}

export default App;
