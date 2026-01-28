export type TEventColor =
  | "blue"
  | "green"
  | "red"
  | "yellow"
  | "purple"
  | "orange"
  | "gray"
  | "pink"
  | "indigo"
  | "teal";

export type TCalendarView = "day" | "week" | "month" | "year" | "agenda";

export interface IUser {
  id: string;
  name: string;
  picturePath?: string | null;
}

export interface IEvent {
  id: number | string;
  title: string;
  description?: string;
  startDate: string; // ISO
  endDate: string; // ISO
  color?: TEventColor;
  user?: IUser;
}

// Color mapping utilities
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

export function getEventColorClasses(color?: TEventColor) {
  return eventColorMap[color || "blue"];
}
