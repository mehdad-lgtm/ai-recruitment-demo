import {
    addDays,
    eachDayOfInterval,
    endOfMonth,
    endOfWeek,
    format,
    isSameDay,
    isSameMonth,
    isWithinInterval,
    parseISO,
    startOfMonth,
    startOfWeek
} from "date-fns";
import type { ICalendarCell, ICalendarEvent, TWorkingHours } from "./types";

/**
 * Get calendar cells for a month view
 */
export function getCalendarCells(date: Date): ICalendarCell[] {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  return days.map((day) => ({
    day: day.getDate(),
    currentMonth: isSameMonth(day, date),
    date: day,
  }));
}

/**
 * Get events for a specific day
 */
export function getDayEvents(events: ICalendarEvent[], date: Date): ICalendarEvent[] {
  return events.filter((event) => {
    const eventStart = parseISO(event.startDate);
    const eventEnd = parseISO(event.endDate);
    const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
    const dayEnd = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);
    
    return eventStart <= dayEnd && eventEnd >= dayStart;
  });
}

/**
 * Get events for a specific week
 */
export function getWeekEvents(events: ICalendarEvent[], date: Date): ICalendarEvent[] {
  const dayOfWeek = date.getDay();
  const weekStart = new Date(date);
  weekStart.setDate(date.getDate() - dayOfWeek);
  weekStart.setHours(0, 0, 0, 0);

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);

  return events.filter((event) => {
    const eventStart = parseISO(event.startDate);
    const eventEnd = parseISO(event.endDate);
    return eventStart <= weekEnd && eventEnd >= weekStart;
  });
}

/**
 * Get events for a specific month
 */
export function getMonthEvents(events: ICalendarEvent[], date: Date): ICalendarEvent[] {
  const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
  const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);

  return events.filter((event) => {
    const eventStart = parseISO(event.startDate);
    const eventEnd = parseISO(event.endDate);
    return eventStart <= monthEnd && eventEnd >= monthStart;
  });
}

/**
 * Check if a time is within working hours
 */
export function isWorkingHour(hour: number, dayOfWeek: number, workingHours: TWorkingHours): boolean {
  const dayHours = workingHours[dayOfWeek];
  if (!dayHours) return false;
  return hour >= dayHours.from && hour < dayHours.to;
}

/**
 * Get visible hours array
 */
export function getVisibleHours(from: number, to: number): number[] {
  const hours: number[] = [];
  for (let i = from; i <= to; i++) {
    hours.push(i);
  }
  return hours;
}

/**
 * Format time for display
 */
export function formatTime(date: Date): string {
  return format(date, "h:mm a");
}

/**
 * Format date for display
 */
export function formatDate(date: Date, formatStr: string = "MMM d, yyyy"): string {
  return format(date, formatStr);
}

/**
 * Calculate event block position and height for day/week view
 */
export function getEventBlockStyle(
  event: ICalendarEvent,
  visibleStartHour: number
): { top: number; height: number } {
  const startDate = parseISO(event.startDate);
  const endDate = parseISO(event.endDate);
  
  const eventStartMinutes = startDate.getHours() * 60 + startDate.getMinutes();
  const eventEndMinutes = endDate.getHours() * 60 + endDate.getMinutes();
  const visibleStartMinutes = visibleStartHour * 60;
  
  const top = Math.max(0, eventStartMinutes - visibleStartMinutes);
  const height = eventEndMinutes - eventStartMinutes;
  
  // Convert to pixels (1 hour = 60px)
  return {
    top: (top / 60) * 60, // pixels
    height: Math.max((height / 60) * 60, 30), // minimum 30px height
  };
}

/**
 * Check if two events overlap
 */
export function eventsOverlap(event1: ICalendarEvent, event2: ICalendarEvent): boolean {
  const start1 = parseISO(event1.startDate);
  const end1 = parseISO(event1.endDate);
  const start2 = parseISO(event2.startDate);
  const end2 = parseISO(event2.endDate);
  
  return start1 < end2 && end1 > start2;
}

/**
 * Group overlapping events
 */
export function groupOverlappingEvents(events: ICalendarEvent[]): ICalendarEvent[][] {
  if (events.length === 0) return [];
  
  const sorted = [...events].sort((a, b) => 
    parseISO(a.startDate).getTime() - parseISO(b.startDate).getTime()
  );
  
  const groups: ICalendarEvent[][] = [];
  let currentGroup: ICalendarEvent[] = [sorted[0]];
  
  for (let i = 1; i < sorted.length; i++) {
    const event = sorted[i];
    const overlapsWithGroup = currentGroup.some((e) => eventsOverlap(e, event));
    
    if (overlapsWithGroup) {
      currentGroup.push(event);
    } else {
      groups.push(currentGroup);
      currentGroup = [event];
    }
  }
  
  groups.push(currentGroup);
  return groups;
}

/**
 * Get the days of the week starting from a given date
 */
export function getWeekDays(date: Date): Date[] {
  const start = startOfWeek(date, { weekStartsOn: 0 });
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
}

/**
 * Check if an event is happening now
 */
export function isEventNow(event: ICalendarEvent): boolean {
  const now = new Date();
  const start = parseISO(event.startDate);
  const end = parseISO(event.endDate);
  
  return isWithinInterval(now, { start, end });
}

/**
 * Get single day events (events that start and end on the same day)
 */
export function getSingleDayEvents(events: ICalendarEvent[]): ICalendarEvent[] {
  return events.filter((event) => {
    const start = parseISO(event.startDate);
    const end = parseISO(event.endDate);
    return isSameDay(start, end);
  });
}

/**
 * Get multi-day events
 */
export function getMultiDayEvents(events: ICalendarEvent[]): ICalendarEvent[] {
  return events.filter((event) => {
    const start = parseISO(event.startDate);
    const end = parseISO(event.endDate);
    return !isSameDay(start, end);
  });
}

/**
 * Week days labels
 */
export const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const WEEK_DAYS_FULL = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
