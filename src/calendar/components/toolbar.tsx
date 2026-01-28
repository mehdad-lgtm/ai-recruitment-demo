"use client";

import { useCalendar } from "@/calendar/contexts/calendar-context";
import type { TCalendarView } from "@/calendar/types";
import { cn } from "@/lib/utils";
import {
    addDays,
    addMonths,
    addWeeks,
    addYears,
    endOfMonth,
    endOfWeek,
    endOfYear,
    format,
    startOfMonth,
    startOfWeek,
    startOfYear,
    subDays,
    subMonths,
    subWeeks,
    subYears,
} from "date-fns";
import {
    Calendar,
    CalendarDays,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Grid3X3,
    LayoutGrid,
    List,
    Plus,
} from "lucide-react";
import * as React from "react";

interface CalendarToolbarProps {
  onAddEvent?: () => void;
}

export function CalendarToolbar({ onAddEvent }: CalendarToolbarProps) {
  const { currentView, currentDate, setCurrentDate, getFilteredEvents } = useCalendar();

  const handlePrevious = () => {
    switch (currentView) {
      case "day":
        setCurrentDate(subDays(currentDate, 1));
        break;
      case "week":
        setCurrentDate(subWeeks(currentDate, 1));
        break;
      case "month":
      case "agenda":
        setCurrentDate(subMonths(currentDate, 1));
        break;
      case "year":
        setCurrentDate(subYears(currentDate, 1));
        break;
    }
  };

  const handleNext = () => {
    switch (currentView) {
      case "day":
        setCurrentDate(addDays(currentDate, 1));
        break;
      case "week":
        setCurrentDate(addWeeks(currentDate, 1));
        break;
      case "month":
      case "agenda":
        setCurrentDate(addMonths(currentDate, 1));
        break;
      case "year":
        setCurrentDate(addYears(currentDate, 1));
        break;
    }
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const dateRangeText = React.useMemo(() => {
    switch (currentView) {
      case "day":
        return format(currentDate, "MMM d, yyyy");
      case "week": {
        const start = startOfWeek(currentDate, { weekStartsOn: 0 });
        const end = endOfWeek(currentDate, { weekStartsOn: 0 });
        return `${format(start, "MMM d, yyyy")} - ${format(end, "MMM d, yyyy")}`;
      }
      case "month":
      case "agenda": {
        const start = startOfMonth(currentDate);
        const end = endOfMonth(currentDate);
        return `${format(start, "MMM d, yyyy")} - ${format(end, "MMM d, yyyy")}`;
      }
      case "year": {
        const start = startOfYear(currentDate);
        const end = endOfYear(currentDate);
        return `${format(start, "MMM d, yyyy")} - ${format(end, "MMM d, yyyy")}`;
      }
    }
  }, [currentView, currentDate]);

  const monthTitle = format(currentDate, "MMMM yyyy");
  const eventCount = getFilteredEvents().length;

  return (
    <div className="bg-card/60 backdrop-blur-sm rounded-2xl p-4 mb-4 shadow-sm border border-border/40">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        {/* Left: Date Navigation */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Today Card */}
          <button
            onClick={handleToday}
            className="bg-primary text-primary-foreground rounded-xl p-3 shadow-md hover:shadow-lg transition-all hover:scale-105 min-w-[60px]"
          >
            <div className="text-xs font-bold uppercase tracking-wide">
              {format(new Date(), "MMM")}
            </div>
            <div className="text-2xl font-bold leading-none">
              {format(new Date(), "dd")}
            </div>
          </button>

          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-1">
              <span className="text-lg font-semibold">{monthTitle}</span>
              <span className="text-sm text-muted-foreground px-2 py-0.5 bg-muted/50 rounded-md">
                {eventCount} events
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={handlePrevious}
                className="p-1.5 hover:bg-muted/60 rounded-lg transition-colors"
                aria-label="Previous"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-sm text-muted-foreground px-2">
                {dateRangeText}
              </span>
              <button
                onClick={handleNext}
                className="p-1.5 hover:bg-muted/60 rounded-lg transition-colors"
                aria-label="Next"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right: View Switcher + User Filter + Add Event */}
        <div className="flex items-center gap-2 flex-wrap">
          <ViewSwitcher />
          <UserFilter />
          <button
            onClick={onAddEvent}
            className="px-4 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium text-sm flex items-center gap-2 hover:bg-primary/90 transition-all shadow-md hover:shadow-lg"
          >
            <Plus className="h-4 w-4" />
            Add Event
          </button>
        </div>
      </div>
    </div>
  );
}

function ViewSwitcher() {
  const { currentView, setCurrentView } = useCalendar();

  const viewConfig: Record<TCalendarView, { icon: React.ElementType; label: string }> = {
    agenda: { icon: List, label: "Agenda" },
    day: { icon: CalendarDays, label: "Day" },
    week: { icon: LayoutGrid, label: "Week" },
    month: { icon: Grid3X3, label: "Month" },
    year: { icon: Calendar, label: "Year" },
  };

  return (
    <div className="flex items-center gap-0.5 bg-muted/40 p-1 rounded-xl border border-border/40">
      {(Object.keys(viewConfig) as TCalendarView[]).map((v) => {
        const Icon = viewConfig[v].icon;
        return (
          <button
            key={v}
            onClick={() => setCurrentView(v)}
            title={viewConfig[v].label}
            className={cn(
              "p-2.5 rounded-lg transition-all",
              currentView === v
                ? "bg-foreground text-background shadow-md"
                : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
            )}
          >
            <Icon className="h-4 w-4" />
          </button>
        );
      })}
    </div>
  );
}

function UserFilter() {
  const { users, selectedUser, setSelectedUser } = useCalendar();
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const displayUsers = users.slice(0, 2);
  const remainingCount = users.length > 2 ? users.length - 2 : 0;

  const selectedUserName =
    selectedUser === "all" ? "All" : users.find((u) => u.id === selectedUser)?.name || "All";

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((s) => !s)}
        className="px-3 py-2.5 bg-muted/40 rounded-xl border border-border/40 flex items-center gap-2 hover:bg-muted/60 transition-colors"
      >
        <div className="flex -space-x-2">
          {displayUsers.map((u) => (
            <div
              key={u.id}
              className="w-6 h-6 rounded-full bg-gradient-to-br from-primary/80 to-primary text-primary-foreground text-xs font-bold flex items-center justify-center border-2 border-background shadow-sm"
            >
              {u.name.charAt(0).toUpperCase()}
            </div>
          ))}
          {remainingCount > 0 && (
            <div className="w-6 h-6 rounded-full bg-muted text-muted-foreground text-xs font-bold flex items-center justify-center border-2 border-background">
              +{remainingCount}
            </div>
          )}
        </div>
        <span className="text-sm font-medium">{selectedUserName}</span>
        <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 min-w-[260px] bg-popover border border-border rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in-0 zoom-in-95">
          <div className="p-2">
            {/* All users option */}
            <button
              className={cn(
                "w-full text-left px-3 py-2.5 rounded-lg transition-colors flex items-center gap-3",
                selectedUser === "all"
                  ? "bg-primary/10 text-primary font-medium"
                  : "hover:bg-muted/50"
              )}
              onClick={() => {
                setSelectedUser("all");
                setOpen(false);
              }}
            >
              <div className="flex -space-x-2">
                {displayUsers.map((u) => (
                  <div
                    key={u.id}
                    className="w-6 h-6 rounded-full bg-gradient-to-br from-primary/80 to-primary text-primary-foreground text-xs font-bold flex items-center justify-center border-2 border-background"
                  >
                    {u.name.charAt(0).toUpperCase()}
                  </div>
                ))}
                {remainingCount > 0 && (
                  <div className="w-6 h-6 rounded-full bg-muted text-muted-foreground text-xs font-bold flex items-center justify-center border-2 border-background">
                    +{remainingCount}
                  </div>
                )}
              </div>
              <span className="text-sm">All</span>
              {selectedUser === "all" && (
                <span className="ml-auto text-primary">✓</span>
              )}
            </button>

            <div className="my-2 h-px bg-border/50" />

            {/* Individual users */}
            {users.map((u) => (
              <button
                key={u.id}
                className={cn(
                  "w-full text-left px-3 py-2.5 rounded-lg transition-colors flex items-center gap-3",
                  selectedUser === u.id
                    ? "bg-primary/10 text-primary font-medium"
                    : "hover:bg-muted/50"
                )}
                onClick={() => {
                  setSelectedUser(u.id);
                  setOpen(false);
                }}
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary/80 to-primary text-primary-foreground text-xs font-bold flex items-center justify-center shadow-sm">
                  {u.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm">{u.name}</span>
                {selectedUser === u.id && (
                  <span className="ml-auto text-primary">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
