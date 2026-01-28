"use client";

import { createContext, useContext, useState, type Dispatch, type ReactNode, type SetStateAction } from "react";
import type {
    ICalendarEvent,
    ICalendarUser,
    TBadgeVariant,
    TVisibleHours,
    TWorkingHours
} from "./types";

interface ICalendarContext {
  selectedDate: Date;
  setSelectedDate: (date: Date | undefined) => void;
  selectedUserId: string | "all";
  setSelectedUserId: (userId: string | "all") => void;
  badgeVariant: TBadgeVariant;
  setBadgeVariant: (variant: TBadgeVariant) => void;
  users: ICalendarUser[];
  workingHours: TWorkingHours;
  setWorkingHours: Dispatch<SetStateAction<TWorkingHours>>;
  visibleHours: TVisibleHours;
  setVisibleHours: Dispatch<SetStateAction<TVisibleHours>>;
  events: ICalendarEvent[];
  setEvents: Dispatch<SetStateAction<ICalendarEvent[]>>;
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
  users: ICalendarUser[];
  events: ICalendarEvent[];
  initialDate?: Date;
}

export function CalendarProvider({ 
  children, 
  users, 
  events: initialEvents,
  initialDate 
}: CalendarProviderProps) {
  const [badgeVariant, setBadgeVariant] = useState<TBadgeVariant>("colored");
  const [visibleHours, setVisibleHours] = useState<TVisibleHours>(DEFAULT_VISIBLE_HOURS);
  const [workingHours, setWorkingHours] = useState<TWorkingHours>(DEFAULT_WORKING_HOURS);
  const [selectedDate, setSelectedDateState] = useState(initialDate || new Date());
  const [selectedUserId, setSelectedUserId] = useState<string | "all">("all");
  const [events, setEvents] = useState<ICalendarEvent[]>(initialEvents);

  const handleSelectDate = (date: Date | undefined) => {
    if (!date) return;
    setSelectedDateState(date);
  };

  return (
    <CalendarContext.Provider
      value={{
        selectedDate,
        setSelectedDate: handleSelectDate,
        selectedUserId,
        setSelectedUserId,
        badgeVariant,
        setBadgeVariant,
        users,
        visibleHours,
        setVisibleHours,
        workingHours,
        setWorkingHours,
        events,
        setEvents,
      }}
    >
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
