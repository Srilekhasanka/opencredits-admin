import { HTTP_METHODS } from '../config/constants';
import authService from './authService';

class ApiService {
  constructor() {
    this._onSessionExpired = null;
    this._refreshPromise = null;
  }

  onSessionExpired(cb) {
    this._onSessionExpired = cb;
  }

  async request(url, options = {}) {
    const token = authService.getAccessToken();
    const headers = { ...options.headers };

    if (options.method && options.method !== 'GET' && options.method !== 'HEAD') {
      headers['Content-Type'] = headers['Content-Type'] || 'application/json';
    }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config = { ...options, headers };
    let response = await fetch(url, config);

    // Handle token expiration with mutex refresh
    if (response.status === 401 && token) {
      try {
        if (!this._refreshPromise) {
          this._refreshPromise = authService.refreshToken().finally(() => {
            this._refreshPromise = null;
          });
        }
        await this._refreshPromise;

        const newToken = authService.getAccessToken();
        if (newToken) {
          headers['Authorization'] = `Bearer ${newToken}`;
          response = await fetch(url, { ...config, headers });
        }
      } catch {
        authService.clearAuthData();
        if (this._onSessionExpired) this._onSessionExpired();
        throw new Error('Session expired. Please login again.');
      }
    }

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || `Request failed with status ${response.status}`);
    }
    return data;
  }

  async get(url, options = {}) {
    return this.request(url, { ...options, method: HTTP_METHODS.GET });
  }

  async post(url, body, options = {}) {
    return this.request(url, {
      ...options,
      method: HTTP_METHODS.POST,
      body: JSON.stringify(body),
    });
  }

  async put(url, body, options = {}) {
    return this.request(url, {
      ...options,
      method: HTTP_METHODS.PUT,
      body: JSON.stringify(body),
    });
  }

  async patch(url, body, options = {}) {
    return this.request(url, {
      ...options,
      method: HTTP_METHODS.PATCH,
      body: JSON.stringify(body),
    });
  }

  async delete(url, options = {}) {
    return this.request(url, { ...options, method: HTTP_METHODS.DELETE });
  }
}

export default new ApiService();
