// store/authStore.ts
import { create } from 'zustand';
import { User } from '../types/models';
import { CURRENT_USER, MOCK_COACH_USER } from '../services/mockData';
import { api } from '../services/api';

interface AuthState {
  currentUser: User;
  isCoachMode: boolean;
  isLoading: boolean;
  error: string | null;
  toggleUserMode: () => void;
  updateBio: (bio: string) => void;
  login: (email: string, password: string) => Promise<boolean>;
  register: (
    fullName: string,
    username: string,
    email: string,
    password: string
  ) => Promise<boolean>;
  logout: () => void;
  syncCurrentUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  currentUser: CURRENT_USER,
  isCoachMode: false,
  isLoading: false,
  error: null,

  toggleUserMode: () =>
    set((state) => {
      const isNowCoach = !state.isCoachMode;
      return {
        isCoachMode: isNowCoach,
        currentUser: isNowCoach ? MOCK_COACH_USER : CURRENT_USER,
      };
    }),

  updateBio: (bio: string) =>
    set((state) => ({
      currentUser: { ...state.currentUser, bio },
    })),

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    const res = await api.login(email, password);
    set({ isLoading: false });
    if (res.data?.user) {
      set({
        currentUser: {
          ...CURRENT_USER,
          ...res.data.user,
        },
      });
      return true;
    } else {
      set({ error: res.error || 'Identifiants invalides' });
      return false;
    }
  },

  register: async (fullName: string, username: string, email: string, password: string) => {
    set({ isLoading: true, error: null });
    const res = await api.register(fullName, username, email, password);
    set({ isLoading: false });
    if (res.data?.user) {
      set({
        currentUser: {
          ...CURRENT_USER,
          ...res.data.user,
        },
      });
      return true;
    } else {
      set({ error: res.error || 'Erreur lors de l’inscription' });
      return false;
    }
  },

  logout: () => {
    api.logout();
    set({ currentUser: CURRENT_USER, isCoachMode: false });
  },

  syncCurrentUser: async () => {
    const res = await api.getMe();
    if (res.data) {
      set({
        currentUser: {
          ...CURRENT_USER,
          ...res.data,
        },
      });
    }
  },
}));
