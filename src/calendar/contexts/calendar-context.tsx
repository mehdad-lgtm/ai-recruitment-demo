"use client";

import type { IEvent, IUser, TCalendarView } from "@/calendar/types";
import * as React from "react";

interface CalendarContextValue {
  events: IEvent[];
  users: IUser[];
  selectedUser: string | "all";
  currentDate: Date;
  currentView: TCalendarView;
  setEvents: React.Dispatch<React.SetStateAction<IEvent[]>>;
  setSelectedUser: (id: string | "all") => void;
  setCurrentDate: (date: Date) => void;
  setCurrentView: (view: TCalendarView) => void;
  addEvent: (event: IEvent) => void;
  updateEvent: (id: string | number, event: Partial<IEvent>) => void;
  deleteEvent: (id: string | number) => void;
  getFilteredEvents: () => IEvent[];
}

const CalendarContext = React.createContext<CalendarContextValue | null>(null);

export function CalendarProvider({
  events: initialEvents = [],
  users = [],
  initialView = "month",
  initialDate,
  children,
}: {
  events?: IEvent[];
  users?: IUser[];
  initialView?: TCalendarView;
  initialDate?: Date;
  children: React.ReactNode;
}) {
  const [events, setEvents] = React.useState<IEvent[]>(initialEvents);
  const [selectedUser, setSelectedUser] = React.useState<string | "all">("all");
  const [currentDate, setCurrentDate] = React.useState<Date>(initialDate ?? new Date());
  const [currentView, setCurrentView] = React.useState<TCalendarView>(initialView);

  const addEvent = React.useCallback((event: IEvent) => {
    setEvents((prev) => [...prev, event]);
  }, []);

  const updateEvent = React.useCallback((id: string | number, updates: Partial<IEvent>) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...updates } : e))
    );
  }, []);

  const deleteEvent = React.useCallback((id: string | number) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const getFilteredEvents = React.useCallback(() => {
    if (selectedUser === "all") return events;
    return events.filter((e) => e.user?.id === selectedUser);
  }, [events, selectedUser]);

  const value = React.useMemo(
    () => ({
      events,
      users,
      selectedUser,
      currentDate,
      currentView,
      setEvents,
      setSelectedUser,
      setCurrentDate,
      setCurrentView,
      addEvent,
      updateEvent,
      deleteEvent,
      getFilteredEvents,
    }),
    [events, users, selectedUser, currentDate, currentView, addEvent, updateEvent, deleteEvent, getFilteredEvents]
  );

  return <CalendarContext.Provider value={value}>{children}</CalendarContext.Provider>;
}

export function useCalendar() {
  const ctx = React.useContext(CalendarContext);
  if (!ctx) throw new Error("useCalendar must be used within CalendarProvider");
  return ctx;
}
