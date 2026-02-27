import { API_ENDPOINTS, HTTP_METHODS, STORAGE_KEYS } from '../config/constants';

class AuthService {
  async signin(credentials) {
    const response = await fetch(API_ENDPOINTS.AUTH.SIGNIN, {
      method: HTTP_METHODS.POST,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Sign in failed');
    }

    const { payload } = data;
    if (payload.accessToken) this.setAccessToken(payload.accessToken);
    if (payload.refreshToken) this.setRefreshToken(payload.refreshToken);
    if (payload.user) this.setUserData(payload.user);

    return data;
  }

  async getProfile() {
    const token = this.getAccessToken();
    if (!token) throw new Error('No access token available');

    const response = await fetch(API_ENDPOINTS.AUTH.PROFILE, {
      method: HTTP_METHODS.GET,
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Failed to fetch profile');
    }
    return data;
  }

  async logout() {
    try {
      const token = this.getAccessToken();
      if (token) {
        await fetch(API_ENDPOINTS.AUTH.LOGOUT, {
          method: HTTP_METHODS.POST,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch {
      // Ignore — clear tokens regardless
    } finally {
      this.clearAuthData();
    }
  }

  async refreshToken() {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) throw new Error('No refresh token available');

    const response = await fetch(API_ENDPOINTS.AUTH.REFRESH_TOKEN, {
      method: HTTP_METHODS.POST,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${refreshToken}`,
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    const data = await response.json();
    if (!response.ok || !data.success) {
      this.clearAuthData();
      throw new Error(data.message || 'Token refresh failed');
    }

    if (data.payload?.accessToken) {
      this.setAccessToken(data.payload.accessToken);
    }
    return data;
  }

  // ── Token helpers ──────────────────────────────────────
  setAccessToken(token) {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
  }
  getAccessToken() {
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  }
  setRefreshToken(token) {
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, token);
  }
  getRefreshToken() {
    return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  }
  setUserData(userData) {
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
  }
  getUserData() {
    const data = localStorage.getItem(STORAGE_KEYS.USER_DATA);
    return data ? JSON.parse(data) : null;
  }
  clearAuthData() {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
  }
}

export default new AuthService();
