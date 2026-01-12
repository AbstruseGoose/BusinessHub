import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, UserRole } from '@businesshub/shared';
import { api } from '@/lib/api';
import { socketService } from '@/lib/socket';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        try {
          console.log('Login API call to:', api.defaults.baseURL + '/auth/login');
          const response = await api.post('/auth/login', { email, password });
          console.log('Login response:', response.data);
          const { token, user } = response.data;
          
          localStorage.setItem('token', token);
          set({ user, token, isAuthenticated: true });
          
          // Connect to WebSocket
          socketService.connect(token);
        } catch (error) {
          console.error('Login failed:', error);
          throw error;
        }
      },

      register: async (email: string, password: string, name: string) => {
        try {
          const response = await api.post('/auth/register', { email, password, name });
          const { token, user } = response.data;
          
          localStorage.setItem('token', token);
          set({ user, token, isAuthenticated: true });
          
          // Connect to WebSocket
          socketService.connect(token);
        } catch (error) {
          console.error('Registration failed:', error);
          throw error;
        }
      },

      logout: () => {
        localStorage.removeItem('token');
        socketService.disconnect();
        set({ user: null, token: null, isAuthenticated: false });
      },

      setUser: (user: User) => {
        set({ user });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
