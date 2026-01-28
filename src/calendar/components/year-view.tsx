"use client";

import { useCalendar } from "@/calendar/contexts/calendar-context";
import type { IEvent } from "@/calendar/types";
import { cn } from "@/lib/utils";
import {
    addDays,
    addMonths,
    endOfMonth,
    format,
    isSameDay,
    isSameMonth,
    isToday,
    parseISO,
    startOfMonth,
    startOfWeek,
    startOfYear,
} from "date-fns";

interface YearViewProps {
  onEventClick?: (event: IEvent) => void;
  onDayClick?: (date: Date) => void;
}

export function YearView({ onEventClick, onDayClick }: YearViewProps) {
  const { currentDate, getFilteredEvents, setCurrentDate, setCurrentView } = useCalendar();

  const events = getFilteredEvents();
  const yearStart = startOfYear(currentDate);
  const months = Array.from({ length: 12 }, (_, i) => addMonths(yearStart, i));

  const handleMonthClick = (month: Date) => {
    setCurrentDate(month);
    setCurrentView("month");
  };

  const handleDayClick = (date: Date) => {
    setCurrentDate(date);
    if (onDayClick) {
      onDayClick(date);
    } else {
      setCurrentView("day");
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {months.map((month) => (
        <MonthMiniCalendar
          key={month.toISOString()}
          month={month}
          events={events}
          currentDate={currentDate}
          onMonthClick={() => handleMonthClick(month)}
          onDayClick={handleDayClick}
          onEventClick={onEventClick}
        />
      ))}
    </div>
  );
}

interface MonthMiniCalendarProps {
  month: Date;
  events: IEvent[];
  currentDate: Date;
  onMonthClick: () => void;
  onDayClick: (date: Date) => void;
  onEventClick?: (event: IEvent) => void;
}

function MonthMiniCalendar({
  month,
  events,
  currentDate,
  onMonthClick,
  onDayClick,
}: MonthMiniCalendarProps) {
  const monthStart = startOfMonth(month);
  const monthEnd = endOfMonth(month);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });

  // Generate 6 weeks of days
  const days = Array.from({ length: 42 }, (_, i) => addDays(calendarStart, i));

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Get events count per day for this month
  const getEventCountForDay = (date: Date) => {
    return events.filter((e) => isSameDay(parseISO(e.startDate), date)).length;
  };

  return (
    <div className="bg-card/60 rounded-2xl border border-border/40 overflow-hidden">
      {/* Month Header */}
      <button
        onClick={onMonthClick}
        className="w-full p-3 text-left font-semibold hover:bg-muted/40 transition-colors border-b border-border/40"
      >
        {format(month, "MMMM")}
      </button>

      {/* Mini Calendar */}
      <div className="p-2">
        {/* Week Day Headers */}
        <div className="grid grid-cols-7 mb-1">
          {weekDays.map((day) => (
            <div
              key={day}
              className="text-[10px] text-center text-muted-foreground font-medium py-1"
            >
              {day.slice(0, 1)}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-0.5">
          {days.map((day, idx) => {
            const isCurrentMonth = isSameMonth(day, month);
            const isTodayDate = isToday(day);
            const isSelected = isSameDay(day, currentDate);
            const eventCount = getEventCountForDay(day);

            if (!isCurrentMonth) {
              return <div key={idx} className="aspect-square" />;
            }

            return (
              <button
                key={idx}
                onClick={() => onDayClick(day)}
                className={cn(
                  "aspect-square flex flex-col items-center justify-center text-xs rounded-md transition-colors relative",
                  isTodayDate && "bg-primary text-primary-foreground",
                  isSelected && !isTodayDate && "bg-muted ring-2 ring-primary",
                  !isTodayDate && !isSelected && "hover:bg-muted/60"
                )}
              >
                <span className={cn("leading-none", !isCurrentMonth && "text-muted-foreground/50")}>
                  {format(day, "d")}
                </span>
                {eventCount > 0 && (
                  <span
                    className={cn(
                      "text-[8px] font-medium mt-0.5",
                      isTodayDate ? "text-primary-foreground/80" : "text-primary"
                    )}
                  >
                    +{eventCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
