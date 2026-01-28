"use client";

import { useCalendar } from "@/calendar/contexts/calendar-context";
import type { IEvent } from "@/calendar/types";
import { getEventColorClasses } from "@/calendar/types";
import { cn } from "@/lib/utils";
import {
    addDays,
    endOfWeek,
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

// Working hours for display (8 AM to 10 PM)
const WORK_HOURS = Array.from({ length: 15 }, (_, i) => i + 8);
const HOUR_HEIGHT = 60; // pixels per hour

interface WeekViewProps {
  onEventClick?: (event: IEvent) => void;
}

export function WeekView({ onEventClick }: WeekViewProps) {
  const { currentDate, getFilteredEvents } = useCalendar();
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 0 });
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

  return (
    <div className="bg-card/60 rounded-2xl border border-border/40 overflow-hidden">
      {/* All-day Events Row */}
      {allDayEvents.length > 0 && (
        <div className="border-b border-border/40 bg-muted/20">
          <div className="grid grid-cols-8">
            <div className="p-2 border-r border-border/40 flex items-center justify-center">
              <span className="text-xs text-muted-foreground">All day</span>
            </div>
            {weekDays.map((day) => {
              const dayEvents = allDayEvents.filter(
                (e) =>
                  isSameDay(parseISO(e.startDate), day) ||
                  (parseISO(e.startDate) <= day && parseISO(e.endDate) >= day)
              );
              return (
                <div key={day.toISOString()} className="p-1 border-r border-border/40 last:border-r-0 min-h-[40px]">
                  {dayEvents.slice(0, 2).map((event) => {
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
                  {dayEvents.length > 2 && (
                    <span className="text-xs text-muted-foreground">+{dayEvents.length - 2} more</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Week Header */}
      <div className="grid grid-cols-8 border-b border-border/40 bg-muted/20">
        <div className="p-3 border-r border-border/40" />
        {weekDays.map((day) => (
          <div
            key={day.toISOString()}
            className={cn(
              "p-3 text-center border-r border-border/40 last:border-r-0",
              isToday(day) && "bg-primary/5"
            )}
          >
            <div className="text-sm font-medium">{format(day, "EEE")}</div>
            <div
              className={cn(
                "text-lg font-semibold",
                isToday(day) &&
                  "w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto"
              )}
            >
              {format(day, "d")}
            </div>
          </div>
        ))}
      </div>

      {/* Time Grid */}
      <div ref={scrollRef} className="overflow-y-auto" style={{ height: "600px" }}>
        <div className="grid grid-cols-8" style={{ height: `${WORK_HOURS.length * HOUR_HEIGHT}px` }}>
          {/* Time Column */}
          <div className="border-r border-border/40 relative">
            {WORK_HOURS.map((hour, idx) => (
              <div
                key={hour}
                className="absolute left-0 right-0 border-t border-border/30"
                style={{ top: `${idx * HOUR_HEIGHT}px`, height: `${HOUR_HEIGHT}px` }}
              >
                <span className="absolute -top-2.5 left-2 text-xs text-muted-foreground bg-card px-1">
                  {format(setHours(setMinutes(new Date(), 0), hour), "hh a")}
                </span>
              </div>
            ))}
          </div>

          {/* Day Columns */}
          {weekDays.map((day, dayIdx) => {
            const dayEvents = events.filter((e) => {
              const start = parseISO(e.startDate);
              return isSameDay(start, day) && !allDayEvents.includes(e);
            });

            return (
              <div
                key={day.toISOString()}
                className={cn(
                  "relative border-r border-border/40 last:border-r-0",
                  isToday(day) && "bg-primary/5"
                )}
              >
                {/* Hour Lines */}
                {WORK_HOURS.map((_, idx) => (
                  <div
                    key={idx}
                    className="absolute left-0 right-0 border-t border-border/30"
                    style={{ top: `${idx * HOUR_HEIGHT}px` }}
                  />
                ))}

                {/* Current Time Indicator */}
                {isToday(day) && currentTimeIndicator !== null && (
                  <div
                    className="absolute left-0 right-0 z-20"
                    style={{ top: `${currentTimeIndicator}px` }}
                  >
                    <div className="h-0.5 bg-rose-500 relative">
                      <div className="absolute -left-1 -top-1 w-2 h-2 rounded-full bg-rose-500" />
                    </div>
                  </div>
                )}

                {/* Events */}
                {dayEvents.map((event) => {
                  const start = parseISO(event.startDate);
                  const end = parseISO(event.endDate);
                  const startHour = getHours(start);
                  const startMinute = getMinutes(start);
                  const endHour = getHours(end);
                  const endMinute = getMinutes(end);

                  const topPos = (startHour - 8) * HOUR_HEIGHT + startMinute;
                  const duration = (endHour - startHour) * HOUR_HEIGHT + endMinute - startMinute;
                  const height = Math.max(duration, 25);

                  const colorClasses = getEventColorClasses(event.color);

                  return (
                    <button
                      key={event.id}
                      onClick={() => onEventClick?.(event)}
                      className={cn(
                        "absolute left-1 right-1 rounded-md p-1.5 text-left transition-all hover:shadow-lg hover:z-10 cursor-pointer overflow-hidden",
                        colorClasses.bg,
                        colorClasses.text
                      )}
                      style={{
                        top: `${topPos}px`,
                        height: `${height}px`,
                      }}
                    >
                      <div className="font-medium text-xs truncate">{event.title}</div>
                      {height > 35 && (
                        <div className="text-[10px] opacity-90">
                          {format(start, "h:mm a")} - {format(end, "h:mm a")}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
