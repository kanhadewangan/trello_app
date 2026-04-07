import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User) => Promise<void>;
  logout: () => void;
}

// Dummy timeout to simulate API loading
const wait = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  login: async (user) => {
    set({ isLoading: true });
    await wait(1000); 
    set({ user, isAuthenticated: true, isLoading: false });
  },
  logout: () => set({ user: null, isAuthenticated: false }),
}));
