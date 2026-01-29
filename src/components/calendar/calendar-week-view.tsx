"use client";

import { cn } from "@/lib/utils";
import {
    addDays,
    format,
    getHours,
    getMinutes,
    isSameDay,
    isToday,
    parseISO,
    setHours,
    setMinutes,
    startOfWeek,
} from "date-fns";
import * as React from "react";
import { useCalendar } from "./calendar-context";
import type { ICalendarEvent } from "./types";
import { getEventColorClasses } from "./types";

// Working hours for display (8 AM to 10 PM)
const WORK_HOURS = Array.from({ length: 15 }, (_, i) => i + 8);
const HOUR_HEIGHT = 60; // pixels per hour

interface CalendarWeekViewProps {
  onEventClick?: (event: ICalendarEvent) => void;
  onTimeSlotClick?: (date: Date, hour: number) => void;
}

export function CalendarWeekView({ onEventClick, onTimeSlotClick }: CalendarWeekViewProps) {
  const { selectedDate, getFilteredEvents, visibleHours, workingHours } = useCalendar();
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 0 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const events = getFilteredEvents();

  // All-day events (or multi-day events to show at top)
  const allDayEvents = events.filter((e) => {
    const start = parseISO(e.startDate);
    const end = parseISO(e.endDate);
    const startHour = getHours(start);
    const endHour = getHours(end);
    // Consider events spanning more than 12 hours as all-day
    return endHour - startHour > 12 || !isSameDay(start, end);
  });

  // Scroll to current time on mount
  React.useEffect(() => {
    if (scrollRef.current) {
      const now = new Date();
      const hours = now.getHours();
      const scrollPosition = (hours - 8) * HOUR_HEIGHT;
      scrollRef.current.scrollTop = Math.max(0, scrollPosition - 100);
    }
  }, []);

  const currentTimeIndicator = React.useMemo(() => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    if (hours < 8 || hours > 22) return null;
    const topPosition = (hours - 8) * HOUR_HEIGHT + minutes;
    return topPosition;
  }, []);

  const getEventStyle = (event: ICalendarEvent, date: Date) => {
    const eventStart = parseISO(event.startDate);
    const eventEnd = parseISO(event.endDate);
    
    const startHour = getHours(eventStart);
    const startMinute = getMinutes(eventStart);
    const endHour = getHours(eventEnd);
    const endMinute = getMinutes(eventEnd);

    const topPos = (startHour - 8) * HOUR_HEIGHT + startMinute;
    const duration = (endHour - startHour) * 60 + (endMinute - startMinute);
    const height = Math.max((duration / 60) * HOUR_HEIGHT, 30);

    return { top: `${topPos}px`, height: `${height}px` };
  };

  const getDayEvents = (day: Date) => {
    return events.filter((e) => {
      const start = parseISO(e.startDate);
      return isSameDay(start, day) && !allDayEvents.includes(e);
    });
  };

  const isWorkingHour = (hour: number, dayOfWeek: number) => {
    const dayHours = workingHours[dayOfWeek];
    if (!dayHours) return false;
    return hour >= dayHours.from && hour < dayHours.to;
  };

  return (
    <div className="bg-card/60 rounded-2xl border border-border/40 overflow-hidden">
      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
      {/* All-day Events Row */}
      {allDayEvents.length > 0 && (
        <div className="border-b border-border/40 bg-muted/20">
          <div className="grid grid-cols-8">
            <div className="p-2 border-r border-border/40 flex items-center justify-center">
              <span className="text-xs text-muted-foreground">All day</span>
            </div>
            {weekDays.map((day) => {
              const dayAllDayEvents = allDayEvents.filter(
                (e) =>
                  isSameDay(parseISO(e.startDate), day) ||
                  (parseISO(e.startDate) <= day && parseISO(e.endDate) >= day)
              );
              return (
                <div key={day.toISOString()} className="p-1 border-r border-border/40 last:border-r-0 min-h-10">
                  {dayAllDayEvents.slice(0, 2).map((event) => {
                    const colorClasses = getEventColorClasses(event.color);
                    return (
                      <button
                        key={event.id}
                        onClick={() => onEventClick?.(event)}
                        className={cn(
                          "w-full text-left text-xs p-1 rounded mb-0.5 truncate",
                          colorClasses.bg,
                          colorClasses.text
                        )}
                      >
                        {event.title}
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Week Days Header */}
      <div className="grid grid-cols-8 border-b border-border/40">
        <div className="p-3 border-r border-border/40 w-16" />
        {weekDays.map((day) => (
          <div
            key={day.toISOString()}
            className={cn(
              "py-3 text-center border-r border-border/40 last:border-r-0",
              isToday(day) && "bg-primary/5"
            )}
          >
            <p className="text-xs text-muted-foreground">{format(day, "EEE")}</p>
            <p className={cn(
              "text-lg font-semibold",
              isToday(day) && "text-primary"
            )}>
              {format(day, "d")}
            </p>
          </div>
        ))}
      </div>

      {/* Time Grid */}
      <div
        ref={scrollRef}
        className="relative overflow-y-auto"
        style={{ height: "600px" }}
      >
        <div className="grid grid-cols-8" style={{ height: `${WORK_HOURS.length * HOUR_HEIGHT}px` }}>
          {/* Time Labels */}
          <div className="border-r border-border/40">
            {WORK_HOURS.map((hour, idx) => (
              <div
                key={hour}
                className="h-15 text-right pr-2 text-xs text-muted-foreground border-b border-border/30 flex items-start pt-1"
              >
                {format(setHours(setMinutes(new Date(), 0), hour), "h a")}
              </div>
            ))}
          </div>

          {/* Day Columns */}
          {weekDays.map((day) => {
            const dayEvents = getDayEvents(day);
            const isTodayCol = isToday(day);

            return (
              <div
                key={day.toISOString()}
                className={cn(
                  "relative border-r border-border/40 last:border-r-0",
                  isTodayCol && "bg-primary/5"
                )}
              >
                {/* Hour Slots */}
                {WORK_HOURS.map((hour) => (
                  <div
                    key={hour}
                    className={cn(
                      "h-15 border-b border-border/30 cursor-pointer hover:bg-muted/30 transition-colors",
                      !isWorkingHour(hour, day.getDay()) && "bg-muted/10"
                    )}
                    onClick={() => onTimeSlotClick?.(day, hour)}
                  />
                ))}

                {/* Current Time Indicator */}
                {isTodayCol && currentTimeIndicator !== null && (
                  <div
                    className="absolute left-0 right-0 z-20 flex items-center pointer-events-none"
                    style={{ top: `${currentTimeIndicator}px` }}
                  >
                    <div className="w-2 h-2 rounded-full bg-rose-500" />
                    <div className="flex-1 h-0.5 bg-rose-500" />
                  </div>
                )}

                {/* Events */}
                {dayEvents.map((event) => {
                  const style = getEventStyle(event, day);
                  const colorClasses = getEventColorClasses(event.color);
                  return (
                    <button
                      key={event.id}
                      className={cn(
                        "absolute left-1 right-1 rounded-lg p-1.5 text-left transition-all hover:shadow-lg hover:scale-[1.02] cursor-pointer overflow-hidden",
                        colorClasses.bg,
                        colorClasses.text
                      )}
                      style={style}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEventClick?.(event);
                      }}
                    >
                      <p className="truncate font-medium text-xs">{event.title}</p>
                      <p className="truncate text-[10px] opacity-90">
                        {format(parseISO(event.startDate), "h:mm a")}
                      </p>
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
        </div>
      </div>
    </div>
  );
}
