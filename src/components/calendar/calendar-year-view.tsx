"use client";

import { cn } from "@/lib/utils";
import {
    endOfMonth,
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

interface CalendarYearViewProps {
  onEventClick?: (event: ICalendarEvent) => void;
  onMonthClick?: (date: Date) => void;
}

export function CalendarYearView({ onEventClick, onMonthClick }: CalendarYearViewProps) {
  const { selectedDate, setSelectedDate, getFilteredEvents, setCurrentView } = useCalendar();

  const events = getFilteredEvents();

  const months = useMemo(() => {
    const year = selectedDate.getFullYear();
    return Array.from({ length: 12 }, (_, i) => new Date(year, i, 1));
  }, [selectedDate]);

  const handleMonthClick = (date: Date) => {
    setSelectedDate(date);
    if (onMonthClick) {
      onMonthClick(date);
    } else {
      setCurrentView("month");
    }
  };

  const getMonthEvents = (month: Date) => {
    return events.filter((e) => {
      const eventDate = parseISO(e.startDate);
      return isSameMonth(eventDate, month);
    });
  };

  return (
    <div className="bg-card/60 rounded-2xl border border-border/40 p-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold">{selectedDate.getFullYear()}</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {months.map((month) => {
          const monthEvents = getMonthEvents(month);
          return (
            <MiniMonth
              key={month.toISOString()}
              month={month}
              events={monthEvents}
              selectedDate={selectedDate}
              onMonthClick={handleMonthClick}
              onDayClick={(date) => {
                setSelectedDate(date);
                setCurrentView("day");
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

interface MiniMonthProps {
  month: Date;
  events: ICalendarEvent[];
  selectedDate: Date;
  onMonthClick: (date: Date) => void;
  onDayClick: (date: Date) => void;
}

function MiniMonth({ month, events, selectedDate, onMonthClick, onDayClick }: MiniMonthProps) {
  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(month), { weekStartsOn: 0 });
    const end = endOfMonth(month);
    
    // Get 6 weeks worth of days
    const allDays: (Date | null)[] = [];
    let current = start;
    
    while (allDays.length < 42) {
      allDays.push(current);
      current = new Date(current);
      current.setDate(current.getDate() + 1);
    }
    
    return allDays;
  }, [month]);

  const hasEvents = (day: Date) => {
    return events.some((e) => isSameDay(parseISO(e.startDate), day));
  };

  return (
    <div className="bg-card rounded-xl border border-border/40 p-3 hover:shadow-md transition-shadow">
      <button
        onClick={() => onMonthClick(month)}
        className="w-full text-left text-sm font-semibold mb-2 hover:text-primary transition-colors"
      >
        {format(month, "MMMM")}
      </button>

      <div className="grid grid-cols-7 gap-0.5 text-center">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <div key={i} className="text-[9px] text-muted-foreground font-medium">
            {d}
          </div>
        ))}
        {days.slice(0, 35).map((day, idx) => {
          if (!day) return <div key={idx} className="w-5 h-5" />;
          
          const isCurrentMonth = isSameMonth(day, month);
          const isTodayDate = isToday(day);
          const hasEventsOnDay = hasEvents(day);

          if (!isCurrentMonth) {
            return <div key={idx} className="w-5 h-5" />;
          }

          return (
            <button
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                onDayClick(day);
              }}
              className={cn(
                "w-5 h-5 text-[10px] rounded-full flex items-center justify-center relative transition-colors",
                isTodayDate && "bg-primary text-primary-foreground font-bold",
                !isTodayDate && "hover:bg-muted/60",
                !isCurrentMonth && "text-muted-foreground/30"
              )}
            >
              {format(day, "d")}
              {hasEventsOnDay && !isTodayDate && (
                <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
              )}
            </button>
          );
        })}
      </div>

      {events.length > 0 && (
        <div className="mt-2 text-[10px] text-muted-foreground">
          {events.length} event{events.length !== 1 ? "s" : ""}
        </div>
      )}
    </div>
  );
}
