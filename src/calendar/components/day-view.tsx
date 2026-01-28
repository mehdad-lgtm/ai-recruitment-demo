"use client";

import { useCalendar } from "@/calendar/contexts/calendar-context";
import type { IEvent } from "@/calendar/types";
import { getEventColorClasses } from "@/calendar/types";
import { cn } from "@/lib/utils";
import {
    addMonths,
    format,
    getHours,
    getMinutes,
    isSameDay,
    isToday,
    parseISO,
    setHours,
    setMinutes,
    startOfMonth,
    subMonths,
} from "date-fns";
import { Calendar, ChevronLeft, ChevronRight, Clock, User } from "lucide-react";
import * as React from "react";

// Working hours for display (8 AM to 9 PM)
const WORK_HOURS = Array.from({ length: 14 }, (_, i) => i + 8);

interface DayViewProps {
  onEventClick?: (event: IEvent) => void;
}

export function DayView({ onEventClick }: DayViewProps) {
  const { currentDate, getFilteredEvents, setCurrentDate } = useCalendar();
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const events = getFilteredEvents().filter((e) =>
    isSameDay(parseISO(e.startDate), currentDate)
  );

  // Scroll to current time on mount
  React.useEffect(() => {
    if (scrollRef.current && isToday(currentDate)) {
      const now = new Date();
      const hours = now.getHours();
      const scrollPosition = (hours - 8) * 60; // 60px per hour
      scrollRef.current.scrollTop = Math.max(0, scrollPosition - 100);
    }
  }, [currentDate]);

  const currentTimeIndicator = React.useMemo(() => {
    if (!isToday(currentDate)) return null;
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    if (hours < 8 || hours > 21) return null;
    const topPosition = ((hours - 8) * 60) + minutes;
    return topPosition;
  }, [currentDate]);

  // Get the current event happening now
  const currentEvent = React.useMemo(() => {
    const now = new Date();
    if (!isToday(currentDate)) return null;
    return events.find((e) => {
      const start = parseISO(e.startDate);
      const end = parseISO(e.endDate);
      return now >= start && now <= end;
    });
  }, [events, currentDate]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
      {/* Main Day Grid */}
      <div className="lg:col-span-3 bg-card/60 rounded-2xl border border-border/40 overflow-hidden">
        {/* Day Header */}
        <div className="p-4 border-b border-border/40 bg-muted/20">
          <div className="text-lg font-semibold">
            {format(currentDate, "EEE d")}
          </div>
        </div>

        {/* Time Grid */}
        <div
          ref={scrollRef}
          className="relative overflow-y-auto"
          style={{ height: "600px" }}
        >
          <div className="relative" style={{ height: `${WORK_HOURS.length * 60}px` }}>
            {/* Hour Lines */}
            {WORK_HOURS.map((hour, idx) => (
              <div
                key={hour}
                className="absolute left-0 right-0 border-t border-border/30"
                style={{ top: `${idx * 60}px` }}
              >
                <div className="absolute -top-3 left-2 text-xs text-muted-foreground bg-card px-1">
                  {format(setHours(setMinutes(new Date(), 0), hour), "hh a")}
                </div>
              </div>
            ))}

            {/* Current Time Indicator */}
            {currentTimeIndicator !== null && (
              <div
                className="absolute left-0 right-0 z-20 flex items-center"
                style={{ top: `${currentTimeIndicator}px` }}
              >
                <div className="w-2 h-2 rounded-full bg-rose-500" />
                <div className="flex-1 h-0.5 bg-rose-500" />
                <span className="text-xs text-rose-500 bg-card px-1 font-medium">
                  {format(new Date(), "h:mm a")}
                </span>
              </div>
            )}

            {/* Events */}
            <div className="absolute left-16 right-4 top-0 bottom-0">
              {events.map((event) => {
                const start = parseISO(event.startDate);
                const end = parseISO(event.endDate);
                const startHour = getHours(start);
                const startMinute = getMinutes(start);
                const endHour = getHours(end);
                const endMinute = getMinutes(end);

                const topPos = (startHour - 8) * 60 + startMinute;
                const duration = (endHour - startHour) * 60 + (endMinute - startMinute);
                const height = Math.max(duration, 30);

                const colorClasses = getEventColorClasses(event.color);

                return (
                  <button
                    key={event.id}
                    onClick={() => onEventClick?.(event)}
                    className={cn(
                      "absolute left-0 right-0 rounded-lg p-2 text-left transition-all hover:shadow-lg hover:scale-[1.02] cursor-pointer overflow-hidden",
                      colorClasses.bg,
                      colorClasses.text
                    )}
                    style={{
                      top: `${topPos}px`,
                      height: `${height}px`,
                    }}
                  >
                    <div className="font-medium text-sm truncate">{event.title}</div>
                    <div className="text-xs opacity-90">
                      {format(start, "h:mm a")} - {format(end, "h:mm a")}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="space-y-4">
        {/* Mini Calendar */}
        <MiniCalendar />

        {/* Current Event Card */}
        {currentEvent && (
          <div className="bg-card/60 rounded-2xl border border-border/40 p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Happening now
            </div>
            <h4 className="font-semibold mb-3">{currentEvent.title}</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              {currentEvent.user && (
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{currentEvent.user.name}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{format(parseISO(currentEvent.startDate), "MMM d, yyyy")}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>
                  {format(parseISO(currentEvent.startDate), "h:mm a")} -{" "}
                  {format(parseISO(currentEvent.endDate), "h:mm a")}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function MiniCalendar() {
  const { currentDate, setCurrentDate } = useCalendar();
  const [viewDate, setViewDate] = React.useState(startOfMonth(currentDate));

  const daysInMonth = React.useMemo(() => {
    const start = startOfMonth(viewDate);
    const days: Date[] = [];
    const startDay = start.getDay();

    // Previous month days
    for (let i = startDay - 1; i >= 0; i--) {
      const d = new Date(start);
      d.setDate(d.getDate() - i - 1);
      days.push(d);
    }

    // Current month days
    const monthDays = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();
    for (let i = 1; i <= monthDays; i++) {
      days.push(new Date(viewDate.getFullYear(), viewDate.getMonth(), i));
    }

    // Next month days to fill the grid
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, i));
    }

    return days;
  }, [viewDate]);

  return (
    <div className="bg-card/60 rounded-2xl border border-border/40 p-4">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-sm">{format(viewDate, "MMMM yyyy")}</h4>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setViewDate(subMonths(viewDate, 1))}
            className="p-1 hover:bg-muted/60 rounded-md transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewDate(addMonths(viewDate, 1))}
            className="p-1 hover:bg-muted/60 rounded-md transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
          <div key={day} className="text-xs text-muted-foreground py-1">
            {day}
          </div>
        ))}
        {daysInMonth.map((date, idx) => {
          const isCurrentMonth = date.getMonth() === viewDate.getMonth();
          const isSelected = isSameDay(date, currentDate);
          const isTodayDate = isToday(date);

          return (
            <button
              key={idx}
              onClick={() => setCurrentDate(date)}
              className={cn(
                "text-xs py-1.5 rounded-md transition-colors",
                !isCurrentMonth && "text-muted-foreground/50",
                isSelected && "bg-primary text-primary-foreground",
                isTodayDate && !isSelected && "bg-muted text-foreground font-semibold",
                isCurrentMonth && !isSelected && !isTodayDate && "hover:bg-muted/60"
              )}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
