import type { SelectCandidate, SelectCandidateMemory, SelectCandidateProfile } from "@/db/schema/zod";
import { create } from "zustand";

interface CandidateWithDetails extends SelectCandidate {
  profile?: SelectCandidateProfile | null;
  memory?: SelectCandidateMemory | null;
}

interface CandidateState {
  // Current candidate being viewed/edited
  currentCandidate: CandidateWithDetails | null;
  
  // List of candidates (for Recruiter portal list view)
  candidates: CandidateWithDetails[];
  
  // Filters
  filters: {
    state?: string;
    source?: string;
    search?: string;
    dateRange?: {
      from: Date;
      to: Date;
    };
  };
  
  // Pagination
  pagination: {
    page: number;
    pageSize: number;
    total: number;
  };
  
  // Loading states
  isLoading: boolean;
  
  // Actions
  setCurrentCandidate: (candidate: CandidateWithDetails | null) => void;
  setCandidates: (candidates: CandidateWithDetails[]) => void;
  updateCandidate: (id: string, updates: Partial<CandidateWithDetails>) => void;
  setFilters: (filters: Partial<CandidateState["filters"]>) => void;
  setPagination: (pagination: Partial<CandidateState["pagination"]>) => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

const initialState = {
  currentCandidate: null,
  candidates: [],
  filters: {},
  pagination: {
    page: 1,
    pageSize: 20,
    total: 0,
  },
  isLoading: false,
};

export const useCandidateStore = create<CandidateState>()((set) => ({
  ...initialState,

  setCurrentCandidate: (candidate) => set({ currentCandidate: candidate }),

  setCandidates: (candidates) => set({ candidates }),

  updateCandidate: (id, updates) =>
    set((state) => ({
      candidates: state.candidates.map((c) =>
        c.id === id ? { ...c, ...updates } : c
      ),
      currentCandidate:
        state.currentCandidate?.id === id
          ? { ...state.currentCandidate, ...updates }
          : state.currentCandidate,
    })),

  setFilters: (filters) =>
    set((state) => ({
      filters: { ...state.filters, ...filters },
      pagination: { ...state.pagination, page: 1 }, // Reset to page 1 on filter change
    })),

  setPagination: (pagination) =>
    set((state) => ({
      pagination: { ...state.pagination, ...pagination },
    })),

  setLoading: (isLoading) => set({ isLoading }),

  reset: () => set(initialState),
}));
