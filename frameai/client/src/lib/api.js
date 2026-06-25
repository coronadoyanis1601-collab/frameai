import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' }
});

// Inject token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('frameai_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('frameai_token');
      localStorage.removeItem('frameai_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
