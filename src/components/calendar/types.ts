// Calendar Types
export type TEventColor = "blue" | "green" | "red" | "yellow" | "purple" | "orange" | "gray" | "pink" | "indigo" | "teal";

export type TCalendarView = "day" | "week" | "month" | "year" | "agenda";

export type TBadgeVariant = "dot" | "colored" | "mixed";

// Working hours configuration (key is day of week: 0=Sunday to 6=Saturday)
export type TWorkingHours = Record<number, { from: number; to: number }>;

// Visible hours range for week/day views
export type TVisibleHours = { from: number; to: number };

// User interface for calendar
export interface ICalendarUser {
  id: string;
  name: string;
  picturePath: string | null;
  role?: string;
  color?: TEventColor;
}

// Event interface
export interface ICalendarEvent {
  id: string;
  startDate: string; // ISO string format
  endDate: string; // ISO string format
  title: string;
  color: TEventColor;
  description: string;
  user: ICalendarUser;
  // Extended fields for recruitment
  candidateId?: string;
  interviewerId?: string;
  sessionType?: "video" | "in-person" | "phone";
  status?: "scheduled" | "completed" | "cancelled" | "no-show";
}

// Calendar cell for month view
export interface ICalendarCell {
  day: number;
  currentMonth: boolean;
  date: Date;
}

// Interview session for the recruitment system
export interface IInterviewSession {
  id: string;
  interviewerId: string;
  interviewerName: string;
  sessionDate: Date;
  startTime: string;
  endTime: string;
  capacity: number;
  currentCount: number;
  status: "available" | "full" | "closed";
  candidates: Array<{
    id: string;
    name: string;
    status: "scheduled" | "confirmed" | "completed" | "no-show";
  }>;
}

// Availability slot
export interface IAvailabilitySlot {
  id: string;
  dayOfWeek: number; // 0-6
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  isRecurring: boolean;
  specificDate?: Date;
}

// Color mapping utilities - enhanced with modern styles
export const eventColorMap: Record<TEventColor, { bg: string; text: string; border: string }> = {
  blue: { bg: "bg-blue-500/90", text: "text-white", border: "border-blue-600" },
  green: { bg: "bg-emerald-500/90", text: "text-white", border: "border-emerald-600" },
  red: { bg: "bg-rose-500/90", text: "text-white", border: "border-rose-600" },
  yellow: { bg: "bg-amber-400/90", text: "text-gray-900", border: "border-amber-500" },
  purple: { bg: "bg-purple-500/90", text: "text-white", border: "border-purple-600" },
  orange: { bg: "bg-orange-500/90", text: "text-white", border: "border-orange-600" },
  gray: { bg: "bg-gray-500/90", text: "text-white", border: "border-gray-600" },
  pink: { bg: "bg-pink-500/90", text: "text-white", border: "border-pink-600" },
  indigo: { bg: "bg-indigo-500/90", text: "text-white", border: "border-indigo-600" },
  teal: { bg: "bg-teal-500/90", text: "text-white", border: "border-teal-600" },
};

export const eventColorClassesLight: Record<TEventColor, string> = {
  blue: "bg-blue-100 border-blue-200 text-blue-800 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-200",
  green: "bg-green-100 border-green-200 text-green-800 dark:bg-green-950 dark:border-green-800 dark:text-green-200",
  red: "bg-red-100 border-red-200 text-red-800 dark:bg-red-950 dark:border-red-800 dark:text-red-200",
  yellow: "bg-yellow-100 border-yellow-200 text-yellow-800 dark:bg-yellow-950 dark:border-yellow-800 dark:text-yellow-200",
  purple: "bg-purple-100 border-purple-200 text-purple-800 dark:bg-purple-950 dark:border-purple-800 dark:text-purple-200",
  orange: "bg-orange-100 border-orange-200 text-orange-800 dark:bg-orange-950 dark:border-orange-800 dark:text-orange-200",
  gray: "bg-gray-100 border-gray-200 text-gray-800 dark:bg-gray-950 dark:border-gray-800 dark:text-gray-200",
  pink: "bg-pink-100 border-pink-200 text-pink-800 dark:bg-pink-950 dark:border-pink-800 dark:text-pink-200",
  indigo: "bg-indigo-100 border-indigo-200 text-indigo-800 dark:bg-indigo-950 dark:border-indigo-800 dark:text-indigo-200",
  teal: "bg-teal-100 border-teal-200 text-teal-800 dark:bg-teal-950 dark:border-teal-800 dark:text-teal-200",
};

export function getEventColorClasses(color?: TEventColor) {
  return eventColorMap[color || "blue"];
}
