import axios from 'axios';

// ใช้ environment variable สำหรับ production
// Default เป็น localhost สำหรับ development
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const BASE_URL = API_URL.endsWith('/api') ? API_URL : `${API_URL}/api`;

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 30000 // 30 seconds timeout
});

// เพิ่ม token ใน header ทุกครั้งที่เรียก API
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data)
};

export const homeAPI = {
  getHome: () => api.get('/home/'),
  getProfile: () => api.get('/home/profile')
};

export const cryptoAPI = {
  getCurrentPrice: (symbol) => api.get('/crypto/current', { params: { symbol } }),
  getMultiplePrices: () => api.get('/crypto/multiple'),
  getPriceHistory: (symbol, limit) => api.get('/crypto/history', { params: { symbol, limit } }),
  getLatestPrice: (symbol) => api.get('/crypto/latest', { params: { symbol } }),
  getAllLatestPrices: () => api.get('/crypto/all-latest'),
  getWebSocketInfo: (symbol) => api.get('/crypto/websocket-info', { params: { symbol } })
};

export default api;

