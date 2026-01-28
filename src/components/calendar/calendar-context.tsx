"use client";

import { createContext, useCallback, useContext, useMemo, useState, type Dispatch, type ReactNode, type SetStateAction } from "react";
import type {
    ICalendarEvent,
    ICalendarUser,
    TBadgeVariant,
    TCalendarView,
    TVisibleHours,
    TWorkingHours
} from "./types";

interface ICalendarContext {
  selectedDate: Date;
  setSelectedDate: (date: Date | undefined) => void;
  selectedUserId: string | "all";
  setSelectedUserId: (userId: string | "all") => void;
  currentView: TCalendarView;
  setCurrentView: (view: TCalendarView) => void;
  badgeVariant: TBadgeVariant;
  setBadgeVariant: (variant: TBadgeVariant) => void;
  users: ICalendarUser[];
  workingHours: TWorkingHours;
  setWorkingHours: Dispatch<SetStateAction<TWorkingHours>>;
  visibleHours: TVisibleHours;
  setVisibleHours: Dispatch<SetStateAction<TVisibleHours>>;
  events: ICalendarEvent[];
  setEvents: Dispatch<SetStateAction<ICalendarEvent[]>>;
  // New methods
  addEvent: (event: ICalendarEvent) => void;
  updateEvent: (id: string, updates: Partial<ICalendarEvent>) => void;
  deleteEvent: (id: string) => void;
  getFilteredEvents: () => ICalendarEvent[];
}

const CalendarContext = createContext<ICalendarContext | null>(null);

const DEFAULT_WORKING_HOURS: TWorkingHours = {
  0: { from: 0, to: 0 }, // Sunday - off
  1: { from: 9, to: 18 }, // Monday
  2: { from: 9, to: 18 }, // Tuesday
  3: { from: 9, to: 18 }, // Wednesday
  4: { from: 9, to: 18 }, // Thursday
  5: { from: 9, to: 18 }, // Friday
  6: { from: 9, to: 13 }, // Saturday - half day
};

const DEFAULT_VISIBLE_HOURS: TVisibleHours = { from: 8, to: 19 };

interface CalendarProviderProps {
  children: ReactNode;
  users?: ICalendarUser[];
  events?: ICalendarEvent[];
  initialUsers?: ICalendarUser[];
  initialEvents?: ICalendarEvent[];
  initialDate?: Date;
  initialView?: TCalendarView;
  initialWorkingHours?: { start: number; end: number };
  initialVisibleHours?: { start: number; end: number };
}

export function CalendarProvider({ 
  children, 
  users,
  initialUsers,
  events: initialEventsLegacy,
  initialEvents: initialEventsProp,
  initialDate,
  initialView = "month",
  initialWorkingHours,
  initialVisibleHours
}: CalendarProviderProps) {
  const [badgeVariant, setBadgeVariant] = useState<TBadgeVariant>("colored");
  const [currentView, setCurrentView] = useState<TCalendarView>(initialView);
  const [visibleHours, setVisibleHours] = useState<TVisibleHours>(initialVisibleHours ? { from: initialVisibleHours.start, to: initialVisibleHours.end } : DEFAULT_VISIBLE_HOURS);
  const [workingHours, setWorkingHours] = useState<TWorkingHours>(initialWorkingHours ? { ...DEFAULT_WORKING_HOURS, 1: { from: initialWorkingHours.start, to: initialWorkingHours.end }, 2: { from: initialWorkingHours.start, to: initialWorkingHours.end }, 3: { from: initialWorkingHours.start, to: initialWorkingHours.end }, 4: { from: initialWorkingHours.start, to: initialWorkingHours.end }, 5: { from: initialWorkingHours.start, to: initialWorkingHours.end } } : DEFAULT_WORKING_HOURS);
  const [selectedDate, setSelectedDateState] = useState(initialDate || new Date());
  const [selectedUserId, setSelectedUserId] = useState<string | "all">("all");
  const initialEvents = initialEventsProp || initialEventsLegacy || [];
  const [events, setEvents] = useState<ICalendarEvent[]>(initialEvents);
  const calendarUsers = useMemo(() => initialUsers || users || [], [initialUsers, users]);

  const handleSelectDate = (date: Date | undefined) => {
    if (!date) return;
    setSelectedDateState(date);
  };

  const addEvent = useCallback((event: ICalendarEvent) => {
    setEvents((prev) => [...prev, event]);
  }, []);

  const updateEvent = useCallback((id: string, updates: Partial<ICalendarEvent>) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...updates } : e))
    );
  }, []);

  const deleteEvent = useCallback((id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const getFilteredEvents = useCallback(() => {
    if (selectedUserId === "all") return events;
    return events.filter((e) => e.user?.id === selectedUserId);
  }, [events, selectedUserId]);

  const value = useMemo(() => ({
    selectedDate,
    setSelectedDate: handleSelectDate,
    selectedUserId,
    setSelectedUserId,
    currentView,
    setCurrentView,
    badgeVariant,
    setBadgeVariant,
    users: calendarUsers,
    visibleHours,
    setVisibleHours,
    workingHours,
    setWorkingHours,
    events,
    setEvents,
    addEvent,
    updateEvent,
    deleteEvent,
    getFilteredEvents,
  }), [selectedDate, selectedUserId, currentView, badgeVariant, calendarUsers, visibleHours, workingHours, events, addEvent, updateEvent, deleteEvent, getFilteredEvents]);

  return (
    <CalendarContext.Provider value={value}>
      {children}
    </CalendarContext.Provider>
  );
}

export function useCalendar(): ICalendarContext {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error("useCalendar must be used within a CalendarProvider.");
  }
  return context;
}
