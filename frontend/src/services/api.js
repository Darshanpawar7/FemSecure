import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),
};

// Profile API
export const profileAPI = {
  update: (profileData) => api.put('/profile', profileData),
  updateLocation: (locationData) => api.put('/profile/location', locationData),
};

// Contacts API
export const contactsAPI = {
  getAll: () => api.get('/contacts'),
  create: (contactData) => api.post('/contacts', contactData),
  delete: (id) => api.delete(`/contacts/${id}`),
};

// Reports API
export const reportsAPI = {
  getAll: () => api.get('/reports'),
  create: (reportData) => api.post('/reports', reportData),
  delete: (id) => api.delete(`/reports/${id}`),
};

export default api;