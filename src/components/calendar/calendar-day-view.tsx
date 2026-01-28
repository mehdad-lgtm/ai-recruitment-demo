"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import { ChevronLeft, ChevronRight, Clock, Plus, User } from "lucide-react";
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

const eventBorderColors: Record<TEventColor, string> = {
  blue: "border-l-blue-500",
  green: "border-l-green-500",
  red: "border-l-red-500",
  yellow: "border-l-yellow-500",
  purple: "border-l-purple-500",
  orange: "border-l-orange-500",
  gray: "border-l-gray-500",
};

interface CalendarDayViewProps {
  onEventClick?: (event: ICalendarEvent) => void;
  onAddEvent?: (date: Date, hour: number) => void;
}

export function CalendarDayView({ onEventClick, onAddEvent }: CalendarDayViewProps) {
  const { selectedDate, setSelectedDate, events, selectedUserId, visibleHours, workingHours, users } = useCalendar();

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
      const dayStart = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), 0, 0, 0);
      const dayEnd = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), 23, 59, 59);
      return eventStart <= dayEnd && eventEnd >= dayStart;
    });
  }, [events, selectedUserId, selectedDate]);

  // Get currently happening events
  const currentEvents = useMemo(() => {
    const now = new Date();
    return filteredEvents.filter((event) => {
      const start = parseISO(event.startDate);
      const end = parseISO(event.endDate);
      return now >= start && now <= end;
    });
  }, [filteredEvents]);

  const getEventStyle = (event: ICalendarEvent) => {
    const eventStart = parseISO(event.startDate);
    const eventEnd = parseISO(event.endDate);
    
    const dayStart = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), visibleHours.from, 0, 0);
    const dayEnd = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), visibleHours.to + 1, 0, 0);
    
    const clampedStart = eventStart < dayStart ? dayStart : eventStart;
    const clampedEnd = eventEnd > dayEnd ? dayEnd : eventEnd;
    
    const startMinutes = (clampedStart.getHours() - visibleHours.from) * 60 + clampedStart.getMinutes();
    const endMinutes = (clampedEnd.getHours() - visibleHours.from) * 60 + clampedEnd.getMinutes();
    
    const top = (startMinutes / 60) * 60;
    const height = Math.max(((endMinutes - startMinutes) / 60) * 60, 40);
    
    return { top: `${top}px`, height: `${height}px` };
  };

  const navigateDay = (direction: "prev" | "next") => {
    const newDate = new Date(selectedDate);
    if (direction === "prev") {
      newDate.setDate(newDate.getDate() - 1);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    setSelectedDate(newDate);
  };

  const goToToday = () => {
    setSelectedDate(new Date());
  };

  const isWorkingHour = (hour: number) => {
    const dayOfWeek = selectedDate.getDay();
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
              {format(selectedDate, "EEEE, MMMM d, yyyy")}
            </h2>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => navigateDay("prev")}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => navigateDay("next")}
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

      <div className="grid grid-cols-3 gap-6 p-6">
        {/* Time Grid - 2 columns */}
        <div className="col-span-2 max-h-[600px] overflow-y-auto border border-border rounded-lg">
          <div className="relative">
            {/* Hour slots */}
            {hours.map((hour) => (
              <div
                key={hour}
                className={cn(
                  "flex border-b border-border",
                  !isWorkingHour(hour) && "bg-muted/20"
                )}
              >
                <div className="w-16 text-right pr-2 text-xs text-muted-foreground flex items-start pt-1 h-[60px] shrink-0 border-r border-border">
                  {format(new Date().setHours(hour, 0, 0, 0), "h a")}
                </div>
                <div
                  className="flex-1 h-[60px] cursor-pointer hover:bg-muted/30 transition-colors"
                  onClick={() => onAddEvent?.(selectedDate, hour)}
                />
              </div>
            ))}

            {/* Events overlay */}
            <div className="absolute inset-0 pointer-events-none" style={{ marginLeft: "64px" }}>
              {filteredEvents.map((event) => {
                const style = getEventStyle(event);
                return (
                  <button
                    key={event.id}
                    className={cn(
                      "absolute left-1 right-1 rounded-lg px-3 py-2 text-left shadow-md pointer-events-auto border-l-4",
                      eventColorClasses[event.color]
                    )}
                    style={style}
                    onClick={() => onEventClick?.(event)}
                  >
                    <p className="font-semibold text-sm truncate">{event.title}</p>
                    <p className="text-xs opacity-90">
                      {format(parseISO(event.startDate), "h:mm a")} - {format(parseISO(event.endDate), "h:mm a")}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar - Current Events */}
        <div className="space-y-4">
          <div className="bg-muted/30 rounded-lg p-4 border border-border">
            <h3 className="text-sm font-semibold text-foreground mb-3">
              Happening Now
            </h3>
            {currentEvents.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">
                No events happening right now
              </p>
            ) : (
              <div className="space-y-3">
                {currentEvents.map((event) => {
                  const user = users.find((u) => u.id === event.user.id);
                  return (
                    <button
                      key={event.id}
                      className={cn(
                        "w-full text-left p-3 rounded-lg border-l-4 bg-card border border-border hover:shadow-md transition-shadow",
                        eventBorderColors[event.color]
                      )}
                      onClick={() => onEventClick?.(event)}
                    >
                      <p className="font-semibold text-sm text-foreground">
                        {event.title}
                      </p>
                      <div className="mt-2 space-y-1">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>
                            {format(parseISO(event.startDate), "h:mm a")} - {format(parseISO(event.endDate), "h:mm a")}
                          </span>
                        </div>
                        {user && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <User className="h-3 w-3" />
                            <span>{user.name}</span>
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Day Summary */}
          <div className="bg-muted/30 rounded-lg p-4 border border-border">
            <h3 className="text-sm font-semibold text-foreground mb-3">
              Day Summary
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total events</span>
                <span className="font-medium text-foreground">{filteredEvents.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Working hours</span>
                <span className="font-medium text-foreground">
                  {workingHours[selectedDate.getDay()]?.from || 0}:00 - {workingHours[selectedDate.getDay()]?.to || 0}:00
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
