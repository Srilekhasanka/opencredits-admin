import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from 'react';
import authService from '../../services/authService';

const AdminAuthContext = createContext();
const ADMIN_KEY = 'oc_admin_user';

export const useAdminAuth = () => {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return ctx;
};

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Hydrate from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(ADMIN_KEY);
    if (stored) {
      const user = JSON.parse(stored);
      if (user.role === 'admin') {
        setAdmin(user);
        setIsAuthenticated(true);
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await authService.signin({ email, password });
    const user = res.payload?.user ?? res.user;

    if (user?.role !== 'admin') {
      authService.clearAuthData();
      throw new Error('Access denied. Admin privileges required.');
    }

    localStorage.setItem(ADMIN_KEY, JSON.stringify(user));
    setAdmin(user);
    setIsAuthenticated(true);
    return user;
  }, []);

  const logout = useCallback(() => {
    authService.clearAuthData();
    localStorage.removeItem(ADMIN_KEY);
    setAdmin(null);
    setIsAuthenticated(false);
  }, []);

  if (loading) return null;

  return (
    <AdminAuthContext.Provider value={{ admin, isAuthenticated, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
};
