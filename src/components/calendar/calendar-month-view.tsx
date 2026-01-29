"use client";

import { cn } from "@/lib/utils";
import {
    addDays,
    format,
    isSameDay,
    isSameMonth,
    isToday,
    parseISO,
    startOfMonth,
    startOfWeek
} from "date-fns";
import { useMemo } from "react";
import { useCalendar } from "./calendar-context";
import type { ICalendarEvent } from "./types";
import { getEventColorClasses } from "./types";

const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface CalendarMonthViewProps {
  onEventClick?: (event: ICalendarEvent) => void;
  onDayClick?: (date: Date) => void;
}

export function CalendarMonthView({ onEventClick, onDayClick }: CalendarMonthViewProps) {
  const { selectedDate, setSelectedDate, getFilteredEvents, setCurrentView } = useCalendar();

  const events = getFilteredEvents();

  const calendarData = useMemo(() => {
    const monthStart = startOfMonth(selectedDate);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });

    // Generate 6 weeks of days
    const days = Array.from({ length: 42 }, (_, i) => addDays(calendarStart, i));

    return { monthStart, days };
  }, [selectedDate]);

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    if (onDayClick) {
      onDayClick(date);
    } else {
      setCurrentView("day");
    }
  };

  const getDayEvents = (day: Date) => {
    return events.filter((e) => isSameDay(parseISO(e.startDate), day));
  };

  return (
    <div className="bg-card/60 rounded-2xl border border-border/40 overflow-hidden">
      <div className="overflow-x-auto">
        <div className="min-w-[640px]">
      {/* Week Day Headers */}
      <div className="grid grid-cols-7 border-b border-border/40 bg-muted/20">
        {WEEK_DAYS.map((day) => (
          <div
            key={day}
            className="p-3 text-center text-sm font-semibold text-muted-foreground border-r border-border/40 last:border-r-0"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7">
        {calendarData.days.map((day, idx) => {
          const isCurrentMonth = isSameMonth(day, selectedDate);
          const isTodayDate = isToday(day);
          const dayEvents = getDayEvents(day);
          const displayEvents = dayEvents.slice(0, 3);
          const remainingCount = dayEvents.length - 3;

          return (
            <div
              key={idx}
              className={cn(
                "min-h-30 border-r border-b border-border/40 last:border-r-0 p-1 transition-colors",
                !isCurrentMonth && "bg-muted/30",
                isTodayDate && "bg-primary/5"
              )}
            >
              {/* Day Number */}
              <button
                onClick={() => handleDayClick(day)}
                className={cn(
                  "w-7 h-7 flex items-center justify-center text-sm font-medium rounded-full mb-1 transition-colors hover:bg-muted/60",
                  !isCurrentMonth && "text-muted-foreground/50",
                  isTodayDate &&
                    "bg-primary text-primary-foreground hover:bg-primary/90"
                )}
              >
                {format(day, "d")}
              </button>

              {/* Events */}
              <div className="space-y-0.5">
                {displayEvents.map((event) => {
                  const colorClasses = getEventColorClasses(event.color);
                  return (
                    <button
                      key={event.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEventClick?.(event);
                      }}
                      className={cn(
                        "w-full text-left text-xs px-1.5 py-1 rounded truncate transition-all hover:shadow-md cursor-pointer flex items-center gap-1",
                        colorClasses.bg,
                        colorClasses.text
                      )}
                    >
                      <span className="truncate font-medium">{event.title}</span>
                      <span className="text-[10px] opacity-80 shrink-0">
                        {format(parseISO(event.startDate), "h:mm a")}
                      </span>
                    </button>
                  );
                })}
                {remainingCount > 0 && (
                  <button
                    onClick={() => handleDayClick(day)}
                    className="w-full text-left text-xs px-1.5 py-0.5 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <span className="text-primary font-medium">{remainingCount} more...</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
        </div>
      </div>
    </div>
  );
}
