"use client";

import { cn } from "@/lib/utils";
import {
    endOfMonth,
    format,
    isAfter,
    isBefore,
    isToday,
    parseISO,
    startOfMonth
} from "date-fns";
import { Calendar, Clock } from "lucide-react";
import { useMemo } from "react";
import { useCalendar } from "./calendar-context";
import type { ICalendarEvent } from "./types";
import { getEventColorClasses } from "./types";

interface CalendarAgendaViewProps {
  onEventClick?: (event: ICalendarEvent) => void;
}

export function CalendarAgendaView({ onEventClick }: CalendarAgendaViewProps) {
  const { selectedDate, getFilteredEvents } = useCalendar();

  const events = getFilteredEvents();

  // Group events by date for the current month
  const groupedEvents = useMemo(() => {
    const monthStart = startOfMonth(selectedDate);
    const monthEnd = endOfMonth(selectedDate);

    // Filter events within the current month
    const monthEvents = events.filter((e) => {
      const eventDate = parseISO(e.startDate);
      return !isBefore(eventDate, monthStart) && !isAfter(eventDate, monthEnd);
    });

    // Sort events by date
    const sorted = [...monthEvents].sort((a, b) => 
      new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );

    // Group by date
    const grouped: { [key: string]: ICalendarEvent[] } = {};
    sorted.forEach((event) => {
      const dateKey = format(parseISO(event.startDate), "yyyy-MM-dd");
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(event);
    });

    return grouped;
  }, [events, selectedDate]);

  const sortedDates = Object.keys(groupedEvents).sort();

  if (sortedDates.length === 0) {
    return (
      <div className="bg-card/60 rounded-2xl border border-border/40 p-8 text-center">
        <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No events this month</h3>
        <p className="text-muted-foreground">
          There are no scheduled events for {format(selectedDate, "MMMM yyyy")}.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card/60 rounded-2xl border border-border/40 overflow-hidden">
      <div className="divide-y divide-border/40">
        {sortedDates.map((dateKey) => {
          const date = new Date(dateKey);
          const dayEvents = groupedEvents[dateKey];
          const isTodayDate = isToday(date);

          return (
            <div key={dateKey} className="flex">
              {/* Date Column */}
              <div className={cn(
                "w-24 md:w-32 shrink-0 p-4 border-r border-border/40",
                isTodayDate && "bg-primary/5"
              )}>
                <div className={cn(
                  "text-center",
                  isTodayDate && "text-primary"
                )}>
                  <div className="text-xs text-muted-foreground uppercase font-medium">
                    {format(date, "EEE")}
                  </div>
                  <div className={cn(
                    "text-2xl font-bold",
                    isTodayDate && "text-primary"
                  )}>
                    {format(date, "d")}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {format(date, "MMM")}
                  </div>
                  {isTodayDate && (
                    <div className="mt-1 text-[10px] font-medium text-primary bg-primary/10 rounded-full px-2 py-0.5">
                      Today
                    </div>
                  )}
                </div>
              </div>

              {/* Events Column */}
              <div className="flex-1 p-4 space-y-3">
                {dayEvents.map((event) => {
                  const colorClasses = getEventColorClasses(event.color);
                  return (
                    <button
                      key={event.id}
                      onClick={() => onEventClick?.(event)}
                      className={cn(
                        "w-full text-left p-4 rounded-xl transition-all hover:shadow-md hover:scale-[1.01] cursor-pointer",
                        colorClasses.bg,
                        colorClasses.text
                      )}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold truncate">{event.title}</h4>
                          {event.description && (
                            <p className="text-sm opacity-90 mt-1 line-clamp-2">
                              {event.description}
                            </p>
                          )}
                        </div>
                        <div className="text-right shrink-0">
                          <div className="flex items-center gap-1.5 text-sm opacity-90">
                            <Clock className="h-3.5 w-3.5" />
                            <span>
                              {format(parseISO(event.startDate), "h:mm a")}
                            </span>
                          </div>
                          <div className="text-xs opacity-75 mt-0.5">
                            to {format(parseISO(event.endDate), "h:mm a")}
                          </div>
                        </div>
                      </div>

                      {event.user && (
                        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/20">
                          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
                            {event.user.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-sm opacity-90">{event.user.name}</span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
