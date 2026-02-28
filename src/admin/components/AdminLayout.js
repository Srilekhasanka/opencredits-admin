import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import {
  FiTag,
  FiBookOpen,
  FiMapPin,
  FiLogOut,
  FiMenu,
  FiX,
} from 'react-icons/fi';

const NAV_ITEMS = [
  { label: 'Coupons', icon: <FiTag />, path: '/admin/coupons' },
  { label: 'Courses', icon: <FiBookOpen />, path: '/admin/courses' },
  { label: 'Universities', icon: <FiMapPin />, path: '/admin/universities' },
];

const AdminLayout = ({ children }) => {
  const { admin, logout } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => setSidebarOpen(false), [location.pathname]);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 820) setSidebarOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const initials = admin
    ? `${(admin.first_name || '')[0] || ''}${(admin.last_name || '')[0] || ''}`.toUpperCase() || 'A'
    : 'A';

  return (
    <div className="admin-shell">
      {/* Mobile header */}
      <div className="admin-shell__mobile-header">
        <button
          className="admin-shell__hamburger"
          type="button"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}
        >
          {sidebarOpen ? <FiX /> : <FiMenu />}
        </button>
        <span className="admin-shell__brand-mobile">
          <img src="/images/company-logo.svg" alt="OpenCredits" className="admin-shell__logo-mobile" />
          Open <strong>Credits</strong>{' '}
          <span className="admin-shell__badge">Admin</span>
        </span>
      </div>

      {sidebarOpen && (
        <div
          className="admin-shell__overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'is-open' : ''}`}>
        <Link to="/admin/coupons" className="admin-sidebar__brand">
          <img src="/images/company-logo.svg" alt="OpenCredits" className="admin-sidebar__logo" />
          <span className="admin-sidebar__brand-text">
            Open <strong>Credits</strong>
          </span>
          <span className="admin-sidebar__badge">Admin</span>
        </Link>

        <nav className="admin-sidebar__nav">
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`admin-sidebar__item ${isActive ? 'is-active' : ''}`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="admin-sidebar__footer">
          <div className="admin-sidebar__user">
            <div className="admin-sidebar__avatar">{initials}</div>
            <div className="admin-sidebar__user-info">
              <span className="admin-sidebar__user-name">
                {admin?.first_name} {admin?.last_name}
              </span>
              <span className="admin-sidebar__user-role">Administrator</span>
            </div>
          </div>
          <button
            className="admin-sidebar__item admin-sidebar__item--logout"
            type="button"
            onClick={handleLogout}
          >
            <FiLogOut />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      <main className="admin-main">{children}</main>
    </div>
  );
};

export default AdminLayout;
