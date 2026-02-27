export const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL ||
  'https://gnh3rb7x-2994.inc1.devtunnels.ms/oc-be/api/v1';

export const API_ENDPOINTS = {
  AUTH: {
    SIGNIN: `${API_BASE_URL}/auth/login`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
    REFRESH_TOKEN: `${API_BASE_URL}/auth/refresh-token`,
    PROFILE: `${API_BASE_URL}/auth/profile`,
  },
  ADMIN: {
    COUPONS: {
      LIST: (params = {}) => {
        const q = new URLSearchParams();
        if (params.page != null) q.set('page', params.page);
        if (params.limit) q.set('limit', params.limit);
        if (params.search) q.set('search', params.search);
        if (params.is_active != null) q.set('is_active', params.is_active);
        const qs = q.toString();
        return `${API_BASE_URL}/coupons/${qs ? `?${qs}` : ''}`;
      },
      CREATE: `${API_BASE_URL}/coupons/`,
      GET: (id) => `${API_BASE_URL}/coupons/${id}`,
      UPDATE: (id) => `${API_BASE_URL}/coupons/${id}`,
      DELETE: (id) => `${API_BASE_URL}/coupons/${id}`,
    },
    COURSES: {
      LIST: (params = {}) => {
        const q = new URLSearchParams();
        if (params.search) q.set('search', params.search);
        const qs = q.toString();
        return `${API_BASE_URL}/courses${qs ? `?${qs}` : ''}`;
      },
      CREATE: `${API_BASE_URL}/courses/`,
      GET: (id) => `${API_BASE_URL}/courses/${id}`,
      UPDATE: (id) => `${API_BASE_URL}/courses/${id}`,
      DELETE: (id) => `${API_BASE_URL}/courses/${id}`,
    },
    UNIVERSITIES: {
      LIST: (params = {}) => {
        const q = new URLSearchParams();
        if (params.search) q.set('search', params.search);
        if (params.is_partner != null) q.set('is_partner', params.is_partner);
        if (params.state_code) q.set('state_code', params.state_code);
        if (params.page != null) q.set('page', params.page);
        if (params.limit) q.set('limit', params.limit);
        const qs = q.toString();
        return `${API_BASE_URL}/universities/${qs ? `?${qs}` : ''}`;
      },
      GET: (id) => `${API_BASE_URL}/universities/${id}`,
      CREATE: `${API_BASE_URL}/universities/`,
      UPDATE: (id) => `${API_BASE_URL}/universities/${id}`,
      DELETE: (id) => `${API_BASE_URL}/universities/${id}`,
    },
  },
};

export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
};

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'oc_admin_access_token',
  REFRESH_TOKEN: 'oc_admin_refresh_token',
  USER_DATA: 'oc_admin_user_data',
};
