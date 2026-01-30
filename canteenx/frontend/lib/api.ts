import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (data: any) => api.post('/auth/register', data),
  login: (data: any) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

export const foodAPI = {
  getAll: (params?: any) => api.get('/food', { params }),
  getById: (id: string) => api.get(`/food/${id}`),
  create: (data: any) => api.post('/food', data),
  update: (id: string, data: any) => api.put(`/food/${id}`, data),
  delete: (id: string) => api.delete(`/food/${id}`),
};

export const orderAPI = {
  create: (data: any) => api.post('/orders', data),
  getAll: () => api.get('/orders'),
  getById: (id: string) => api.get(`/orders/${id}`),
  updateStatus: (id: string, data: any) => api.put(`/orders/${id}`, data),
  getStats: () => api.get('/orders/stats'),
};

export default api;
