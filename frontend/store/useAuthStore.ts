import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { User } from '@/types/user';

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  user: User | null;
  setAuth: (data: { token: string; refreshToken?: string | null; user: User }) => void;
  clearAuth: () => void;
}

const secureStoreStorage = {
  getItem: async (name: string) => {
    const value = await SecureStore.getItemAsync(name);
    return value ?? null;
  },
  setItem: async (name: string, value: string) => {
    await SecureStore.setItemAsync(name, value);
  },
  removeItem: async (name: string) => {
    await SecureStore.deleteItemAsync(name);
  }
};

const webStorage = {
  getItem: async (name: string) => {
    if (typeof window === 'undefined') return null;
    return window.localStorage.getItem(name);
  },
  setItem: async (name: string, value: string) => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(name, value);
  },
  removeItem: async (name: string) => {
    if (typeof window === 'undefined') return;
    window.localStorage.removeItem(name);
  }
};

const storageAdapter = Platform.OS === 'web' ? webStorage : secureStoreStorage;

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      refreshToken: null,
      user: null,
      setAuth: ({ token, refreshToken = null, user }) => set({ token, refreshToken, user }),
      clearAuth: () => set({ token: null, refreshToken: null, user: null })
    }),
    {
      name: 'safescout-auth',
      storage: createJSONStorage(() => storageAdapter),
      partialize: (state) => ({ token: state.token, refreshToken: state.refreshToken, user: state.user })
    }
  )
);
