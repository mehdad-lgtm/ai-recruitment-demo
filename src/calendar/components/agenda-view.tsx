"use client";

import { useCalendar } from "@/calendar/contexts/calendar-context";
import type { IEvent } from "@/calendar/types";
import { getEventColorClasses } from "@/calendar/types";
import { cn } from "@/lib/utils";
import {
    compareAsc,
    endOfMonth,
    format,
    isSameDay,
    parseISO,
    startOfMonth,
} from "date-fns";
import { Calendar, Clock, FileText, User } from "lucide-react";
import * as React from "react";

interface AgendaViewProps {
  onEventClick?: (event: IEvent) => void;
}

export function AgendaView({ onEventClick }: AgendaViewProps) {
  const { currentDate, getFilteredEvents } = useCalendar();

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);

  // Filter events within current month and sort by date
  const events = getFilteredEvents()
    .filter((e) => {
      const start = parseISO(e.startDate);
      return start >= monthStart && start <= monthEnd;
    })
    .map((e) => ({ ...e, parsedStart: parseISO(e.startDate) }))
    .sort((a, b) => compareAsc(a.parsedStart, b.parsedStart));

  // Group events by date
  const groupedEvents = React.useMemo(() => {
    const groups: { date: Date; events: typeof events }[] = [];
    let currentGroup: (typeof groups)[0] | null = null;

    events.forEach((event) => {
      if (!currentGroup || !isSameDay(currentGroup.date, event.parsedStart)) {
        currentGroup = { date: event.parsedStart, events: [] };
        groups.push(currentGroup);
      }
      currentGroup.events.push(event);
    });

    return groups;
  }, [events]);

  if (events.length === 0) {
    return (
      <div className="bg-card/60 rounded-2xl border border-border/40 p-12 text-center">
        <Calendar className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
        <h3 className="text-lg font-semibold mb-2">No events this month</h3>
        <p className="text-muted-foreground">
          Events scheduled for {format(currentDate, "MMMM yyyy")} will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {groupedEvents.map((group) => (
        <div key={group.date.toISOString()} className="space-y-2">
          {/* Date Header */}
          <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm py-2">
            <h3 className="text-sm font-semibold text-muted-foreground">
              {format(group.date, "EEEE, MMMM d, yyyy")}
            </h3>
          </div>

          {/* Events for this date */}
          <div className="space-y-2">
            {group.events.map((event) => (
              <AgendaEventCard
                key={event.id}
                event={event}
                onClick={() => onEventClick?.(event)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

interface AgendaEventCardProps {
  event: IEvent;
  onClick?: () => void;
}

function AgendaEventCard({ event, onClick }: AgendaEventCardProps) {
  const colorClasses = getEventColorClasses(event.color);
  const startDate = parseISO(event.startDate);
  const endDate = parseISO(event.endDate);

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left bg-card/80 rounded-xl border border-border/40 p-4 transition-all hover:shadow-lg hover:border-primary/30 cursor-pointer group"
      )}
    >
      <div className="flex items-start gap-4">
        {/* Color Indicator */}
        <div
          className={cn(
            "w-1.5 h-full min-h-[60px] rounded-full shrink-0",
            colorClasses.bg
          )}
        />

        <div className="flex-1 min-w-0">
          {/* Title */}
          <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
            {event.title}
          </h4>

          {/* Meta Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
            {/* User */}
            {event.user && (
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 shrink-0" />
                <span className="truncate">{event.user.name}</span>
              </div>
            )}

            {/* Date */}
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 shrink-0" />
              <span>{format(startDate, "MMM d, yyyy")}</span>
            </div>

            {/* Time */}
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 shrink-0" />
              <span>
                {format(startDate, "h:mm a")} - {format(endDate, "h:mm a")}
              </span>
            </div>

            {/* Description */}
            {event.description && (
              <div className="flex items-start gap-2 sm:col-span-2">
                <FileText className="h-4 w-4 shrink-0 mt-0.5" />
                <span className="line-clamp-2">{event.description}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}
