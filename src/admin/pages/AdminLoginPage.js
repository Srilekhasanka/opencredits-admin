import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import { FiEye, FiEyeOff } from 'react-icons/fi';

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAdminAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
      navigate('/admin/coupons');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login">
      <div className="admin-login__card">
        <div className="admin-login__header">
          <div className="admin-login__brand">
            <img src="/images/company-logo.svg" alt="OpenCredits" className="admin-login__logo" />
            <h1 className="admin-login__title">
              Open <strong>Credits</strong>
            </h1>
          </div>
          <p className="admin-login__subtitle">ADMIN PORTAL</p>
        </div>

        {error && <div className="admin-toast admin-toast--error">{error}</div>}

        <form className="admin-login__form" onSubmit={handleSubmit}>
          <div className="admin-field">
            <label className="admin-field__label" htmlFor="admin-email">
              Email Address
            </label>
            <input
              id="admin-email"
              className="admin-field__input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@opencredits.com"
              required
              autoFocus
            />
          </div>

          <div className="admin-field">
            <label className="admin-field__label" htmlFor="admin-password">
              Password
            </label>
            <div className="admin-field__input-wrap">
              <input
                id="admin-password"
                className="admin-field__input"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                className="admin-field__toggle"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="admin-btn admin-btn--primary admin-btn--full"
            disabled={loading || !email || !password}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="admin-login__footer">
          Protected area. Authorized administrators only.
        </p>
      </div>
    </div>
  );
};

export default AdminLoginPage;
