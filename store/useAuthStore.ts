import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { api } from '../services/api';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  isLoading: boolean;
  error: string | null;
  initializeAuth: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const TOKEN_STORAGE_KEY = 'auth_token';

const hasLocalStorage = () => typeof globalThis !== 'undefined' && 'localStorage' in globalThis;

const getStoredToken = async (): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(TOKEN_STORAGE_KEY);
  } catch {
    if (hasLocalStorage()) {
      return globalThis.localStorage.getItem(TOKEN_STORAGE_KEY);
    }
    return null;
  }
};

const setStoredToken = async (token: string): Promise<void> => {
  try {
    await SecureStore.setItemAsync(TOKEN_STORAGE_KEY, token);
    return;
  } catch {
    if (hasLocalStorage()) {
      globalThis.localStorage.setItem(TOKEN_STORAGE_KEY, token);
    }
  }
};

const deleteStoredToken = async (): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync(TOKEN_STORAGE_KEY);
    return;
  } catch {
    if (hasLocalStorage()) {
      globalThis.localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
  }
};

const parseErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    try {
      const parsed = JSON.parse(error.message);
      if (typeof parsed?.message === 'string') {
        return parsed.message;
      }
    } catch {
      // Fallback to plain string when error is not JSON.
    }
    return error.message;
  }
  return 'Something went wrong. Please try again.';
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isHydrated: false,
  isLoading: false,
  error: null,
  initializeAuth: async () => {
    try {
      const token = await getStoredToken();
      set({ token, isAuthenticated: Boolean(token), isHydrated: true });
    } catch {
      set({ token: null, isAuthenticated: false, isHydrated: true });
    }
  },
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.users.login({ email, password });
      await setStoredToken(response.token);

      let user: User = {
        id: email,
        name: email.split('@')[0] || 'User',
        email,
      };
 
      try {
        const foundUser  = await api.users.getByEmail(email);
        user = {
          id: foundUser.id ,
          name: foundUser.name,
          email: foundUser.email,
          avatar: foundUser.avatar,
        };
      } catch {
        // Keep fallback user details when profile fetch fails.
      }

      set({
        user,
        token: response.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      set({
        isLoading: false,
        isAuthenticated: false,
        token: null,
        error: parseErrorMessage(error),
      });
      throw error;
    }
  },
  logout: async () => {
    await deleteStoredToken();
    set({ user: null, token: null, isAuthenticated: false, error: null });
  },
}));
