"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { eachDayOfInterval, endOfMonth, endOfWeek, format, isSameMonth, isToday, parseISO, startOfMonth, startOfWeek } from "date-fns";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useMemo } from "react";
import { useCalendar } from "./calendar-context";
import type { ICalendarEvent, TEventColor } from "./types";

const eventColorClasses: Record<TEventColor, string> = {
  blue: "bg-blue-100 border-blue-200 text-blue-800 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-200",
  green: "bg-green-100 border-green-200 text-green-800 dark:bg-green-950 dark:border-green-800 dark:text-green-200",
  red: "bg-red-100 border-red-200 text-red-800 dark:bg-red-950 dark:border-red-800 dark:text-red-200",
  yellow: "bg-yellow-100 border-yellow-200 text-yellow-800 dark:bg-yellow-950 dark:border-yellow-800 dark:text-yellow-200",
  purple: "bg-purple-100 border-purple-200 text-purple-800 dark:bg-purple-950 dark:border-purple-800 dark:text-purple-200",
  orange: "bg-orange-100 border-orange-200 text-orange-800 dark:bg-orange-950 dark:border-orange-800 dark:text-orange-200",
  gray: "bg-gray-100 border-gray-200 text-gray-800 dark:bg-gray-950 dark:border-gray-800 dark:text-gray-200",
};

const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface CalendarMonthViewProps {
  onEventClick?: (event: ICalendarEvent) => void;
  onAddEvent?: (date: Date) => void;
}

export function CalendarMonthView({ onEventClick, onAddEvent }: CalendarMonthViewProps) {
  const { selectedDate, setSelectedDate, events, selectedUserId } = useCalendar();

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(selectedDate);
    const monthEnd = endOfMonth(selectedDate);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  }, [selectedDate]);

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      if (selectedUserId !== "all" && event.user.id !== selectedUserId) {
        return false;
      }
      return true;
    });
  }, [events, selectedUserId]);

  const getDayEvents = (date: Date) => {
    return filteredEvents.filter((event) => {
      const eventStart = parseISO(event.startDate);
      const eventEnd = parseISO(event.endDate);
      const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
      const dayEnd = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);
      return eventStart <= dayEnd && eventEnd >= dayStart;
    });
  };

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(selectedDate);
    if (direction === "prev") {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setSelectedDate(newDate);
  };

  const goToToday = () => {
    setSelectedDate(new Date());
  };

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      {/* Calendar Header */}
      <div className="px-6 py-4 border-b border-border bg-muted/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold text-foreground">
              {format(selectedDate, "MMMM yyyy")}
            </h2>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => navigateMonth("prev")}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => navigateMonth("next")}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={goToToday}>
              Today
            </Button>
            {onAddEvent && (
              <Button size="sm" onClick={() => onAddEvent(selectedDate)}>
                <Plus className="h-4 w-4 mr-1" />
                Add Event
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Week Days Header */}
      <div className="grid grid-cols-7 border-b border-border">
        {WEEK_DAYS.map((day) => (
          <div
            key={day}
            className="py-3 text-center text-sm font-medium text-muted-foreground border-r border-border last:border-r-0"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7">
        {calendarDays.map((day, index) => {
          const dayEvents = getDayEvents(day);
          const isCurrentMonth = isSameMonth(day, selectedDate);
          const isCurrentDay = isToday(day);
          const maxVisibleEvents = 3;

          return (
            <div
              key={day.toISOString()}
              className={cn(
                "min-h-[120px] p-2 border-r border-b border-border last:border-r-0 cursor-pointer hover:bg-muted/30 transition-colors",
                !isCurrentMonth && "bg-muted/20",
                isCurrentDay && "bg-primary/5"
              )}
              onClick={() => setSelectedDate(day)}
            >
              <div className="flex items-center justify-between mb-1">
                <span
                  className={cn(
                    "flex items-center justify-center w-7 h-7 text-sm font-medium rounded-full",
                    isCurrentDay && "bg-primary text-primary-foreground",
                    !isCurrentMonth && !isCurrentDay && "text-muted-foreground"
                  )}
                >
                  {format(day, "d")}
                </span>
                {dayEvents.length > maxVisibleEvents && (
                  <span className="text-xs text-muted-foreground">
                    +{dayEvents.length - maxVisibleEvents} more
                  </span>
                )}
              </div>

              <div className="space-y-1">
                {dayEvents.slice(0, maxVisibleEvents).map((event) => (
                  <button
                    key={event.id}
                    className={cn(
                      "w-full text-left px-2 py-1 text-xs font-medium rounded border truncate",
                      eventColorClasses[event.color]
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick?.(event);
                    }}
                  >
                    {event.title}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
