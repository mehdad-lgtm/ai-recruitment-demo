"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { addDays, format, isToday, parseISO, startOfWeek } from "date-fns";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useMemo } from "react";
import { useCalendar } from "./calendar-context";
import type { ICalendarEvent, TEventColor } from "./types";

const eventColorClasses: Record<TEventColor, string> = {
  blue: "bg-blue-500/90 border-blue-600 text-white",
  green: "bg-green-500/90 border-green-600 text-white",
  red: "bg-red-500/90 border-red-600 text-white",
  yellow: "bg-yellow-500/90 border-yellow-600 text-white",
  purple: "bg-purple-500/90 border-purple-600 text-white",
  orange: "bg-orange-500/90 border-orange-600 text-white",
  gray: "bg-gray-500/90 border-gray-600 text-white",
};

interface CalendarWeekViewProps {
  onEventClick?: (event: ICalendarEvent) => void;
  onAddEvent?: (date: Date, hour: number) => void;
}

export function CalendarWeekView({ onEventClick, onAddEvent }: CalendarWeekViewProps) {
  const { selectedDate, setSelectedDate, events, selectedUserId, visibleHours, workingHours } = useCalendar();

  const weekDays = useMemo(() => {
    const start = startOfWeek(selectedDate, { weekStartsOn: 0 });
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  }, [selectedDate]);

  const hours = useMemo(() => {
    const result: number[] = [];
    for (let i = visibleHours.from; i <= visibleHours.to; i++) {
      result.push(i);
    }
    return result;
  }, [visibleHours]);

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      if (selectedUserId !== "all" && event.user.id !== selectedUserId) {
        return false;
      }
      const eventStart = parseISO(event.startDate);
      const eventEnd = parseISO(event.endDate);
      const weekStart = weekDays[0];
      const weekEnd = addDays(weekDays[6], 1);
      return eventStart < weekEnd && eventEnd > weekStart;
    });
  }, [events, selectedUserId, weekDays]);

  const getDayEvents = (date: Date) => {
    return filteredEvents.filter((event) => {
      const eventStart = parseISO(event.startDate);
      const eventEnd = parseISO(event.endDate);
      const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
      const dayEnd = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);
      return eventStart <= dayEnd && eventEnd >= dayStart;
    });
  };

  const getEventStyle = (event: ICalendarEvent, date: Date) => {
    const eventStart = parseISO(event.startDate);
    const eventEnd = parseISO(event.endDate);
    
    // Clamp to current day
    const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate(), visibleHours.from, 0, 0);
    const dayEnd = new Date(date.getFullYear(), date.getMonth(), date.getDate(), visibleHours.to + 1, 0, 0);
    
    const clampedStart = eventStart < dayStart ? dayStart : eventStart;
    const clampedEnd = eventEnd > dayEnd ? dayEnd : eventEnd;
    
    const startMinutes = (clampedStart.getHours() - visibleHours.from) * 60 + clampedStart.getMinutes();
    const endMinutes = (clampedEnd.getHours() - visibleHours.from) * 60 + clampedEnd.getMinutes();
    
    const top = (startMinutes / 60) * 60; // 60px per hour
    const height = Math.max(((endMinutes - startMinutes) / 60) * 60, 24); // minimum 24px
    
    return { top: `${top}px`, height: `${height}px` };
  };

  const navigateWeek = (direction: "prev" | "next") => {
    const newDate = new Date(selectedDate);
    if (direction === "prev") {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setDate(newDate.getDate() + 7);
    }
    setSelectedDate(newDate);
  };

  const goToToday = () => {
    setSelectedDate(new Date());
  };

  const isWorkingHour = (hour: number, dayOfWeek: number) => {
    const dayHours = workingHours[dayOfWeek];
    if (!dayHours) return false;
    return hour >= dayHours.from && hour < dayHours.to;
  };

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      {/* Calendar Header */}
      <div className="px-6 py-4 border-b border-border bg-muted/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold text-foreground">
              {format(weekDays[0], "MMM d")} - {format(weekDays[6], "MMM d, yyyy")}
            </h2>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => navigateWeek("prev")}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => navigateWeek("next")}
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
              <Button size="sm" onClick={() => onAddEvent(selectedDate, 9)}>
                <Plus className="h-4 w-4 mr-1" />
                Add Event
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Week Days Header */}
      <div className="grid grid-cols-8 border-b border-border">
        <div className="py-3 text-center text-sm font-medium text-muted-foreground border-r border-border w-16" />
        {weekDays.map((day) => (
          <div
            key={day.toISOString()}
            className={cn(
              "py-3 text-center border-r border-border last:border-r-0",
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
      <div className="max-h-[600px] overflow-y-auto">
        <div className="grid grid-cols-8">
          {/* Time Labels */}
          <div className="border-r border-border w-16">
            {hours.map((hour) => (
              <div
                key={hour}
                className="h-[60px] text-right pr-2 text-xs text-muted-foreground border-b border-border flex items-start pt-1"
              >
                {format(new Date().setHours(hour, 0, 0, 0), "h a")}
              </div>
            ))}
          </div>

          {/* Day Columns */}
          {weekDays.map((day, dayIndex) => {
            const dayEvents = getDayEvents(day);

            return (
              <div
                key={day.toISOString()}
                className={cn(
                  "relative border-r border-border last:border-r-0",
                  isToday(day) && "bg-primary/5"
                )}
              >
                {/* Hour slots */}
                {hours.map((hour) => (
                  <div
                    key={hour}
                    className={cn(
                      "h-[60px] border-b border-border cursor-pointer hover:bg-muted/30 transition-colors",
                      !isWorkingHour(hour, day.getDay()) && "bg-muted/20"
                    )}
                    onClick={() => onAddEvent?.(day, hour)}
                  />
                ))}

                {/* Events */}
                {dayEvents.map((event) => {
                  const style = getEventStyle(event, day);
                  return (
                    <button
                      key={event.id}
                      className={cn(
                        "absolute left-1 right-1 rounded px-2 py-1 text-xs font-medium truncate border-l-2 shadow-sm",
                        eventColorClasses[event.color]
                      )}
                      style={style}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEventClick?.(event);
                      }}
                    >
                      <p className="truncate font-semibold">{event.title}</p>
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
  );
}
