// Calendar Types
export type TEventColor = "blue" | "green" | "red" | "yellow" | "purple" | "orange" | "gray";

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
