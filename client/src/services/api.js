// API Configuration and Service for GAU-ID-View Frontend
import axios from 'axios';

// API Base URL - Update this for production
const API_BASE_URL = 'http://localhost:5000';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Authentication API
export const authAPI = {
  // Register new student
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', {
        name: userData.fullName,
        reg_number: userData.registrationNumber,
        email: userData.email,
        department: userData.school,
        password: userData.password
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Registration failed' };
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', {
        reg_number: credentials.reg_number,
        password: credentials.password
      });
      
      // Store auth token and user data
      if (response.data.success && response.data.data.access_token) {
        localStorage.setItem('authToken', response.data.data.access_token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Login failed' };
    }
  },

  // Logout user
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage regardless
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    }
  },

  // Change password
  changePassword: async (passwordData) => {
    try {
      const response = await api.post('/auth/change-password', passwordData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Password change failed' };
    }
  }
};

// Student API
export const studentAPI = {
  // Get student profile
  getProfile: async () => {
    try {
      const response = await api.get('/student/profile');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch profile' };
    }
  },

  // Update student profile
  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/student/profile', profileData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Profile update failed' };
    }
  },

  // Upload photo
  uploadPhoto: async (file) => {
    try {
      const formData = new FormData();
      formData.append('photo', file);
      
      const response = await api.post('/student/upload-photo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Photo upload failed' };
    }
  },

  // Get application status
  getApplicationStatus: async () => {
    try {
      const response = await api.get('/student/application-status');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch application status' };
    }
  },

  // Submit ID application
  submitApplication: async (applicationData) => {
    try {
      const response = await api.post('/student/apply-id', applicationData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Application submission failed' };
    }
  }
};

// Admin API
export const adminAPI = {
  // Get dashboard analytics
  getDashboard: async () => {
    try {
      const response = await api.get('/admin/dashboard');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch dashboard data' };
    }
  },

  // Get all applications
  getApplications: async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters);
      const response = await api.get(`/admin/applications?${params}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch applications' };
    }
  },

  // Update application status
  updateApplicationStatus: async (applicationId, status, notes = '') => {
    try {
      const response = await api.put(`/admin/applications/${applicationId}/status`, {
        status,
        admin_notes: notes
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Status update failed' };
    }
  },

  // Get all users
  getUsers: async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters);
      const response = await api.get(`/admin/users?${params}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch users' };
    }
  },

  // Get system analytics
  getAnalytics: async () => {
    try {
      const response = await api.get('/admin/analytics');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch analytics' };
    }
  }
};

// Utility functions
export const utils = {
  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('authToken');
  },

  // Get current user
  getCurrentUser: () => {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  },

  // Check if user is admin
  isAdmin: () => {
    const user = utils.getCurrentUser();
    return user?.role === 'admin';
  },

  // Format error message
  formatError: (error) => {
    if (typeof error === 'string') return error;
    if (error?.message) return error.message;
    if (error?.errors) {
      return Object.values(error.errors).flat().join(', ');
    }
    return 'An unexpected error occurred';
  }
};

// Health check
export const healthCheck = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    throw new Error('Backend server is not responding');
  }
};

export default api;