import apiService from '../../services/apiService';
import { API_ENDPOINTS } from '../../config/constants';

/**
 * Admin Service — Coupons, Courses & Universities (real API)
 */

// ─── Service ────────────────────────────────────────────────────────────

class AdminService {
  // ─── Coupons (Real API) ──────────────────────────────────
  async getCoupons(params = {}) {
    const url = API_ENDPOINTS.ADMIN.COUPONS.LIST({ page: 0, limit: 50, ...params });
    const res = await apiService.get(url);
    const payload = res.payload ?? res.data ?? res;
    return Array.isArray(payload) ? payload : payload?.coupons ?? payload?.items ?? payload?.rows ?? [];
  }

  async createCoupon(data) {
    const res = await apiService.post(API_ENDPOINTS.ADMIN.COUPONS.CREATE, data);
    return res.payload ?? res.data ?? res;
  }

  async updateCoupon(id, data) {
    const res = await apiService.put(API_ENDPOINTS.ADMIN.COUPONS.UPDATE(id), data);
    return res.payload ?? res.data ?? res;
  }

  async deleteCoupon(id) {
    const res = await apiService.delete(API_ENDPOINTS.ADMIN.COUPONS.DELETE(id));
    return res.payload ?? res.data ?? res;
  }

  // ─── Courses (Real API) ─────────────────────────────────
  async getCourses(params = {}) {
    const url = API_ENDPOINTS.ADMIN.COURSES.LIST(params);
    const res = await apiService.get(url);
    const payload = res.payload ?? res.data ?? res;
    return Array.isArray(payload) ? payload : payload?.courses ?? payload?.items ?? payload?.rows ?? [];
  }

  async createCourse(data) {
    const res = await apiService.post(API_ENDPOINTS.ADMIN.COURSES.CREATE, data);
    return res.payload ?? res.data ?? res;
  }

  async updateCourse(id, data) {
    const res = await apiService.put(API_ENDPOINTS.ADMIN.COURSES.UPDATE(id), data);
    return res.payload ?? res.data ?? res;
  }

  async deleteCourse(id) {
    const res = await apiService.delete(API_ENDPOINTS.ADMIN.COURSES.DELETE(id));
    return res.payload ?? res.data ?? res;
  }

  // ─── Universities (Real API) ────────────────────────────
  async getUniversities(params = {}) {
    const url = API_ENDPOINTS.ADMIN.UNIVERSITIES.LIST(params);
    const res = await apiService.get(url);
    const payload = res.payload ?? res.data ?? res;
    return Array.isArray(payload) ? payload : payload?.universities ?? payload?.items ?? payload?.rows ?? [];
  }

  async getUniversity(id) {
    const res = await apiService.get(API_ENDPOINTS.ADMIN.UNIVERSITIES.GET(id));
    return res.payload ?? res.data ?? res;
  }

  async createUniversity(data) {
    const res = await apiService.post(API_ENDPOINTS.ADMIN.UNIVERSITIES.CREATE, data);
    return res.payload ?? res.data ?? res;
  }

  async updateUniversity(id, data) {
    const res = await apiService.put(API_ENDPOINTS.ADMIN.UNIVERSITIES.UPDATE(id), data);
    return res.payload ?? res.data ?? res;
  }

  async deleteUniversity(id) {
    const res = await apiService.delete(API_ENDPOINTS.ADMIN.UNIVERSITIES.DELETE(id));
    return res.payload ?? res.data ?? res;
  }
}

export default new AdminService();
