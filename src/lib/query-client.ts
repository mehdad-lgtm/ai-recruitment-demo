import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Stale time: 5 minutes
      staleTime: 5 * 60 * 1000,
      // Cache time: 30 minutes
      gcTime: 30 * 60 * 1000,
      // Retry failed queries up to 3 times
      retry: 3,
      // Retry delay with exponential backoff
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Refetch on window focus
      refetchOnWindowFocus: true,
      // Don't refetch on reconnect for most queries
      refetchOnReconnect: false,
    },
    mutations: {
      // Retry mutations once
      retry: 1,
    },
  },
});

// Query keys factory for type-safe query keys
export const queryKeys = {
  // Auth
  auth: {
    session: ["auth", "session"] as const,
    user: (userId: string) => ["auth", "user", userId] as const,
  },
  
  // Candidates
  candidates: {
    all: ["candidates"] as const,
    list: (filters: Record<string, unknown>) => ["candidates", "list", filters] as const,
    detail: (id: string) => ["candidates", "detail", id] as const,
    profile: (id: string) => ["candidates", "profile", id] as const,
    memory: (id: string) => ["candidates", "memory", id] as const,
    timeline: (id: string) => ["candidates", "timeline", id] as const,
    communications: (id: string) => ["candidates", "communications", id] as const,
  },
  
  // Recruiters
  recruiters: {
    all: ["recruiters"] as const,
    detail: (id: string) => ["recruiters", "detail", id] as const,
    qrCode: (id: string) => ["recruiters", "qr-code", id] as const,
    candidates: (id: string) => ["recruiters", "candidates", id] as const,
  },
  
  // Interviewers
  interviewers: {
    all: ["interviewers"] as const,
    detail: (id: string) => ["interviewers", "detail", id] as const,
    availability: (id: string) => ["interviewers", "availability", id] as const,
    sessions: (id: string) => ["interviewers", "sessions", id] as const,
  },
  
  // Interview Sessions
  sessions: {
    all: ["sessions"] as const,
    list: (filters: Record<string, unknown>) => ["sessions", "list", filters] as const,
    detail: (id: string) => ["sessions", "detail", id] as const,
    assignments: (id: string) => ["sessions", "assignments", id] as const,
  },
  
  // Communications
  communications: {
    whatsapp: {
      messages: (candidateId: string) => ["communications", "whatsapp", "messages", candidateId] as const,
    },
    voiceCalls: {
      calls: (candidateId: string) => ["communications", "voice-calls", candidateId] as const,
    },
    emails: {
      messages: (candidateId: string) => ["communications", "emails", candidateId] as const,
    },
  },
  
  // Timeline & Events
  timeline: {
    events: (candidateId: string) => ["timeline", "events", candidateId] as const,
  },
  
  // Notifications
  notifications: {
    all: ["notifications"] as const,
    unread: ["notifications", "unread"] as const,
  },
  
  // Admin
  admin: {
    auditLogs: (filters: Record<string, unknown>) => ["admin", "audit-logs", filters] as const,
    systemEvents: (filters: Record<string, unknown>) => ["admin", "system-events", filters] as const,
  },
};
