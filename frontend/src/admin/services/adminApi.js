import axios from 'axios';

const API_BASE = 'http://127.0.0.1:8000/api'; // ← change only if your backend port is different

const adminApi = axios.create({
  baseURL: API_BASE,
});

// Auto-add JWT token to every request
adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 (token expired) → you can improve later
adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

export default adminApi;