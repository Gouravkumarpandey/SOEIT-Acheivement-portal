import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { API_BASE_URL } from '../constants/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor → attach JWT token & handle mock data for demo mode
api.interceptors.request.use(
  async (config) => {
    try {
      let token = null;

      // Try to get token from SecureStore (Native) with proper fallback
      try {
        token = await SecureStore.getItemAsync('soeit_token');
      } catch (e) {
        // SecureStore might not be available on web/certain environments
        console.warn('SecureStore error, trying localStorage:', e.message);
      }

      // If still no token, try localStorage
      if (!token && typeof localStorage !== 'undefined') {
        token = localStorage.getItem('soeit_token');
      }

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        console.warn('No authentication token found for request to:', config.url);
      }

      // MOCK DATA LOGIC: If using demo token, intercept certain GET requests to prevent 401s
      if (token === 'demo-token-123' && config.method === 'get') {
        const url = config.url;
        
        // Helper to wrap data in standard response format
        const mockRes = (data) => ({ 
          data: { success: true, data: data, notices: data, courses: data, internships: data }, 
          status: 200, statusText: 'OK', headers: {}, config 
        });

        if (url.includes('/achievements/my')) {
          return { ...config, adapter: () => Promise.resolve(mockRes([])) };
        }
        if (url.includes('/internships')) {
          return { ...config, adapter: () => Promise.resolve(mockRes([])) };
        }
        if (url.includes('/courses')) {
          return { ...config, adapter: () => Promise.resolve(mockRes([])) };
        }
        if (url.includes('/projects')) {
          return { ...config, adapter: () => Promise.resolve(mockRes([])) };
        }
        if (url.includes('/notices')) {
          const demoNotices = [
            {
              id: 1,
              title: 'Upcoming Hackathon: Code AJU 2026',
              content: 'Registration is open for the annual university hackathon. Teams of 2-4 can apply.',
              type: 'Event',
              createdAt: new Date().toISOString(),
              priority: 'high',
            },
            {
              id: 2,
              title: 'Achievement Verification Deadline',
              content: 'Please submit all achievement documents by the end of the semester for credit processing.',
              type: 'Notice',
              createdAt: new Date().toISOString(),
              priority: 'normal',
            }
          ];
          return { ...config, adapter: () => Promise.resolve(mockRes(demoNotices)) };
        }
      }
    } catch (e) {
      console.warn('Token retrieval error:', e);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor → handle 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // If 401 Unauthorized, only log out if NOT in demo mode
    if (error.response?.status === 401) {
      // Get current token to check if it's demo
      let token = null;
      if (typeof localStorage !== 'undefined') {
        token = localStorage.getItem('soeit_token');
      }
      if (!token && Platform.OS !== 'web') {
        token = await SecureStore.getItemAsync('soeit_token').catch(() => null);
      }

      // If it's a real token (not demo), then clear session and logout
      if (token && token !== 'demo-token-123') {
        if (Platform.OS === 'web') {
          localStorage.removeItem('soeit_token');
          localStorage.removeItem('soeit_user');
        } else {
          await SecureStore.deleteItemAsync('soeit_token');
          await SecureStore.deleteItemAsync('soeit_user');
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
