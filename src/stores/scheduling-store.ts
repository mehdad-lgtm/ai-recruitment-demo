import type { SelectInterviewAssignment, SelectInterviewSession } from "@/db/schema/zod";
import { create } from "zustand";

interface SessionWithAssignments extends SelectInterviewSession {
  assignments?: SelectInterviewAssignment[];
}

interface SchedulingState {
  // Sessions
  sessions: SessionWithAssignments[];
  currentSession: SessionWithAssignments | null;
  
  // Selected date for calendar view
  selectedDate: Date;
  
  // View mode
  viewMode: "day" | "week" | "month";
  
  // Loading state
  isLoading: boolean;
  
  // Actions
  setSessions: (sessions: SessionWithAssignments[]) => void;
  setCurrentSession: (session: SessionWithAssignments | null) => void;
  setSelectedDate: (date: Date) => void;
  setViewMode: (mode: "day" | "week" | "month") => void;
  setLoading: (loading: boolean) => void;
  addAssignmentToSession: (sessionId: string, assignment: SelectInterviewAssignment) => void;
  removeAssignmentFromSession: (sessionId: string, assignmentId: string) => void;
}

export const useSchedulingStore = create<SchedulingState>()((set) => ({
  sessions: [],
  currentSession: null,
  selectedDate: new Date(),
  viewMode: "week",
  isLoading: false,

  setSessions: (sessions) => set({ sessions }),

  setCurrentSession: (session) => set({ currentSession: session }),

  setSelectedDate: (date) => set({ selectedDate: date }),

  setViewMode: (mode) => set({ viewMode: mode }),

  setLoading: (isLoading) => set({ isLoading }),

  addAssignmentToSession: (sessionId, assignment) =>
    set((state) => ({
      sessions: state.sessions.map((s) =>
        s.id === sessionId
          ? {
              ...s,
              assignments: [...(s.assignments || []), assignment],
              currentCount: (s.currentCount || 0) + 1,
            }
          : s
      ),
    })),

  removeAssignmentFromSession: (sessionId, assignmentId) =>
    set((state) => ({
      sessions: state.sessions.map((s) =>
        s.id === sessionId
          ? {
              ...s,
              assignments: (s.assignments || []).filter((a) => a.id !== assignmentId),
              currentCount: Math.max((s.currentCount || 0) - 1, 0),
            }
          : s
      ),
    })),
}));
