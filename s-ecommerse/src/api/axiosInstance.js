// src/api/axiosInstance.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://127.0.0.1:8000/api', // ← change to production URL later
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically add token to every request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Optional: auto-logout on 401
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default API;