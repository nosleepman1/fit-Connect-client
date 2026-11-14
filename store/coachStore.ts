// store/coachStore.ts
import { create } from 'zustand';
import { User, CoachingPlan } from '../types/models';
import { MOCK_COACH_ALEX, MOCK_COACH_SARAH } from '../services/mockData';
import { api } from '../services/api';

interface CoachState {
  coaches: User[];
  selectedSpecialty: string;
  searchQuery: string;
  selectedPlan: CoachingPlan | null;
  isApplyingForCoach: boolean;
  applicationStatus: 'IDLE' | 'SUBMITTED' | 'APPROVED';
  isLoading: boolean;
  fetchCoaches: () => Promise<void>;
  setSpecialty: (specialty: string) => void;
  setSearchQuery: (query: string) => void;
  setSelectedPlan: (plan: CoachingPlan | null) => void;
  submitCertificationApplication: (diplomaName: string) => Promise<void>;
}

export const useCoachStore = create<CoachState>((set, get) => ({
  coaches: [MOCK_COACH_ALEX, MOCK_COACH_SARAH],
  selectedSpecialty: 'TOUS',
  searchQuery: '',
  selectedPlan: null,
  isApplyingForCoach: false,
  applicationStatus: 'IDLE',
  isLoading: false,

  fetchCoaches: async () => {
    set({ isLoading: true });
    const { selectedSpecialty, searchQuery } = get();
    const res = await api.getCoaches(selectedSpecialty, searchQuery);
    set({ isLoading: false });
    if (res.data && Array.isArray(res.data) && res.data.length > 0) {
      set({ coaches: res.data });
    }
  },

  setSpecialty: (specialty) => {
    set({ selectedSpecialty: specialty });
    get()
      .fetchCoaches()
      .catch(() => {});
  },

  setSearchQuery: (query) => {
    set({ searchQuery: query });
  },

  setSelectedPlan: (plan) => set({ selectedPlan: plan }),

  submitCertificationApplication: async (diplomaName) => {
    set({ applicationStatus: 'SUBMITTED' });
    await api.applyForCoachCertification(diplomaName).catch(() => {});
  },
}));
