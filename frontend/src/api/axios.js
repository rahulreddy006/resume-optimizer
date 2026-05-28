// src/api/axios.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Pointing to your Express server
});

// Request Interceptor: Attach the token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login'; // Force redirect to login
    }
    return Promise.reject(error);
  }
);

export default api;