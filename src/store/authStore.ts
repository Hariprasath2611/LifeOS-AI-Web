import { create } from 'zustand';

export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  emailVerified: boolean;
  createdAt: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  verifyEmail: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  clearError: () => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: false,
  error: null,
  initialized: false,

  initialize: () => {
    const savedUser = localStorage.getItem('lifeos_user');
    if (savedUser) {
      set({ user: JSON.parse(savedUser), initialized: true });
    } else {
      set({ initialized: true });
    }
  },

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      // Mock Firebase API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      if (password.length < 6) {
        throw new Error("Password must be at least 6 characters.");
      }

      const mockUser: User = {
        uid: 'user_' + Math.random().toString(36).substr(2, 9),
        email,
        displayName: email.split('@')[0],
        emailVerified: true,
        createdAt: new Date().toISOString(),
      };

      localStorage.setItem('lifeos_user', JSON.stringify(mockUser));
      set({ user: mockUser, loading: false });
    } catch (err: any) {
      set({ error: err.message || "Failed to log in", loading: false });
      throw err;
    }
  },

  register: async (email, password, name) => {
    set({ loading: true, error: null });
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (password.length < 6) {
        throw new Error("Password must be at least 6 characters.");
      }

      const mockUser: User = {
        uid: 'user_' + Math.random().toString(36).substr(2, 9),
        email,
        displayName: name || email.split('@')[0],
        emailVerified: false,
        createdAt: new Date().toISOString(),
      };

      localStorage.setItem('lifeos_user', JSON.stringify(mockUser));
      set({ user: mockUser, loading: false });
    } catch (err: any) {
      set({ error: err.message || "Failed to register", loading: false });
      throw err;
    }
  },

  logout: async () => {
    set({ loading: true });
    await new Promise((resolve) => setTimeout(resolve, 500));
    localStorage.removeItem('lifeos_user');
    set({ user: null, loading: false });
  },

  forgotPassword: async (email) => {
    set({ loading: true, error: null });
    try {
      console.log("Mock sending password reset link to:", email);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // Simulation success
      set({ loading: false });
    } catch (err: any) {
      set({ error: err.message || "Failed to send reset link", loading: false });
      throw err;
    }
  },

  verifyEmail: async () => {
    set({ loading: true, error: null });
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const currentUser = get().user;
      if (currentUser) {
        const updatedUser = { ...currentUser, emailVerified: true };
        localStorage.setItem('lifeos_user', JSON.stringify(updatedUser));
        set({ user: updatedUser });
      }
      set({ loading: false });
    } catch (err: any) {
      set({ error: err.message || "Email verification failed", loading: false });
      throw err;
    }
  },

  loginWithGoogle: async () => {
    set({ loading: true, error: null });
    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      const mockUser: User = {
        uid: 'google_user_' + Math.random().toString(36).substr(2, 9),
        email: 'emerald.coder@gmail.com',
        displayName: 'Emerald Coder',
        photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop',
        emailVerified: true,
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem('lifeos_user', JSON.stringify(mockUser));
      set({ user: mockUser, loading: false });
    } catch (err: any) {
      set({ error: err.message || "Google Login failed", loading: false });
      throw err;
    }
  },

  clearError: () => set({ error: null }),
}));
