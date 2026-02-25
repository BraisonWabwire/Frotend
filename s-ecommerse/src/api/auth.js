// src/api/auth.js
import API from './axiosInstance'; // ← make sure this file exists

// ────────────────────────────────────────────────
// Logout – clears tokens & user data
// ────────────────────────────────────────────────
export const logout = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
  // Force redirect to login (you can also use navigate if inside component)
  window.location.href = '/login';
};

// ────────────────────────────────────────────────
// Helper: Get current user from localStorage
// ────────────────────────────────────────────────
export const getCurrentUser = () => {
  try {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

// ────────────────────────────────────────────────
// Optional: Login & Register (if not already present)
// ────────────────────────────────────────────────
export const login = async (credentials) => {
  const res = await API.post('/auth/login/', credentials);
  const { token, user } = res.data;
  localStorage.setItem('authToken', token);
  localStorage.setItem('user', JSON.stringify(user));
  return user;
};

export const register = async (data) => {
  const res = await API.post('/auth/register/', data);
  const { token, user } = res.data;
  localStorage.setItem('authToken', token);
  localStorage.setItem('user', JSON.stringify(user));
  return user;
};