import { create } from 'zustand';
import api from '../services/api';
import { connectSocket, disconnectSocket } from '../services/socket';

const initialUser = JSON.parse(localStorage.getItem('codesync_user') || 'null');
const initialToken = localStorage.getItem('codesync_token') || null;

export const useAuthStore = create((set, get) => ({
  user: initialUser,
  token: initialToken,
  isAuthenticated: !!initialToken,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token, ...userData } = res.data;

      localStorage.setItem('codesync_token', token);
      localStorage.setItem('codesync_user', JSON.stringify(userData));

      connectSocket(token);

      set({
        user: userData,
        token: token,
        isAuthenticated: true,
        isLoading: false
      });
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  register: async (name, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post('/auth/register', { name, email, password });
      const { token, ...userData } = res.data;

      localStorage.setItem('codesync_token', token);
      localStorage.setItem('codesync_user', JSON.stringify(userData));

      connectSocket(token);

      set({
        user: userData,
        token: token,
        isAuthenticated: true,
        isLoading: false
      });
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  logout: () => {
    localStorage.removeItem('codesync_token');
    localStorage.removeItem('codesync_user');
    disconnectSocket();
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      error: null
    });
  },

  clearError: () => set({ error: null })
}));
