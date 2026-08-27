import api from './api';

// ─── Auth ────────────────────────────────────────────────
export const authService = {
  register: (data) => api.post('/auth/register/', data),
  login: (data) => api.post('/auth/login/', data),
  getProfile: () => api.get('/auth/profile/'),
  updateProfile: (data) => api.patch('/auth/profile/', data),
};

// ─── Agent ───────────────────────────────────────────────
export const agentService = {
  getMyProfile: () => api.get('/agents/me/'),
  updateMyProfile: (data) => api.patch('/agents/me/', data),
  getStats: () => api.get('/agents/stats/'),
  bulkUpload: (formData) => api.post('/agents/bulk-upload/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};

// ─── Documents ───────────────────────────────────────────
export const documentService = {
  upload: (formData) => api.post('/documents/upload/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  list: () => api.get('/documents/'),
};

// ─── Family Details ──────────────────────────────────────
export const familyService = {
  list: () => api.get('/family/'),
  create: (data) => api.post('/family/', data),
  update: (id, data) => api.patch(`/family/${id}/`, data),
  delete: (id) => api.delete(`/family/${id}/`),
};

// ─── Custom Fields ───────────────────────────────────────
export const customFieldService = {
  list: () => api.get('/custom-fields/'),
  create: (data) => api.post('/custom-fields/', data),
  update: (id, data) => api.patch(`/custom-fields/${id}/`, data),
  delete: (id) => api.delete(`/custom-fields/${id}/`),
};

// ─── Referrals ───────────────────────────────────────────
export const referralService = {
  generate: (data) => api.post('/referrals/generate/', data),
  myCodes: () => api.get('/referrals/my-codes/'),
  validate: (code) => api.post('/referrals/validate/', { code }),
  track: (code) => api.post(`/referrals/track/${code}/`),
  analytics: () => api.get('/referrals/analytics/'),
};

// ─── Products ────────────────────────────────────────────
export const productService = {
  list: (params) => api.get('/products/live/', { params }),
  detail: (slug) => api.get(`/products/live/${slug}/`),
  categories: () => api.get('/products/categories/'),
};

// ─── Orders ──────────────────────────────────────────────
export const orderService = {
  myOrders: () => api.get('/orders/my-orders/'),
};

// ─── Commissions ─────────────────────────────────────────
export const commissionService = {
  myCommissions: () => api.get('/commissions/my-commissions/'),
};
