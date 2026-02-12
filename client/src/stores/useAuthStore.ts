import { create } from 'zustand';
import type { IUser, IUserCreate, IUserLogin } from '@dear-days/shared';
import * as authService from '@/services/auth.service';

interface AuthState {
  user: IUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  login: (data: IUserLogin) => Promise<void>;
  register: (data: IUserCreate) => Promise<void>;
  logout: () => void;
  loadUser: () => Promise<void>;
  clearError: () => void;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

/**
 * Zustand store for authentication state.
 */
export const useAuthStore = create<AuthState & AuthActions>()((set) => ({
  ...initialState,

  login: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const auth = await authService.login(data);
      set({
        user: { id: '', ...auth.user } as IUser,
        isAuthenticated: true,
        isLoading: false,
      });
      // Fetch full user profile with id
      const user = await authService.getMe();
      set({ user });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      set({ error: message, isLoading: false });
      throw err;
    }
  },

  register: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const auth = await authService.register(data);
      set({
        user: { id: '', ...auth.user } as IUser,
        isAuthenticated: true,
        isLoading: false,
      });
      const user = await authService.getMe();
      set({ user });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registration failed';
      set({ error: message, isLoading: false });
      throw err;
    }
  },

  logout: () => {
    authService.clearTokens();
    set(initialState);
  },

  loadUser: async () => {
    if (!authService.hasToken()) return;
    set({ isLoading: true });
    try {
      const user = await authService.getMe();
      set({ user, isAuthenticated: true, isLoading: false });
    } catch {
      authService.clearTokens();
      set(initialState);
    }
  },

  clearError: () => set({ error: null }),
}));
