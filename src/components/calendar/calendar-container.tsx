"use client";

import { cn } from "@/lib/utils";
import * as Dialog from "@radix-ui/react-dialog";
import { format, parseISO } from "date-fns";
import { Calendar, Clock, FileText, User, X } from "lucide-react";
import * as React from "react";
import { CalendarAgendaView } from "./calendar-agenda-view";
import { useCalendar } from "./calendar-context";
import { CalendarDayView } from "./calendar-day-view";
import { CalendarMonthView } from "./calendar-month-view";
import { CalendarToolbar } from "./calendar-toolbar";
import { CalendarWeekView } from "./calendar-week-view";
import { CalendarYearView } from "./calendar-year-view";
import type { ICalendarEvent, ICalendarUser, TEventColor } from "./types";

interface CalendarContainerProps {
  className?: string;
  showToolbar?: boolean;
  showUserFilter?: boolean;
  onAddEvent?: () => void;
}

export function CalendarContainer({ 
  className, 
  showToolbar = true,
  showUserFilter = true,
  onAddEvent 
}: CalendarContainerProps) {
  const { currentView, addEvent, users } = useCalendar();
  const [selectedEvent, setSelectedEvent] = React.useState<ICalendarEvent | null>(null);
  const [showAddEventDialog, setShowAddEventDialog] = React.useState(false);

  const handleEventClick = (event: ICalendarEvent) => {
    setSelectedEvent(event);
  };

  const handleAddEvent = () => {
    if (onAddEvent) {
      onAddEvent();
    } else {
      setShowAddEventDialog(true);
    }
  };

  return (
    <div className={cn("mx-auto max-w-screen-2xl", className)}>
      {showToolbar && (
        <CalendarToolbar 
          onAddEvent={handleAddEvent} 
          showUserFilter={showUserFilter}
        />
      )}

      <div className="bg-background/60 p-4 rounded-2xl shadow-sm border border-border/30">
        {currentView === "day" && <CalendarDayView onEventClick={handleEventClick} />}
        {currentView === "week" && <CalendarWeekView onEventClick={handleEventClick} />}
        {currentView === "month" && <CalendarMonthView onEventClick={handleEventClick} />}
        {currentView === "year" && <CalendarYearView onEventClick={handleEventClick} />}
        {currentView === "agenda" && <CalendarAgendaView onEventClick={handleEventClick} />}
      </div>

      {/* Event Detail Dialog */}
      <EventDetailDialog
        event={selectedEvent}
        open={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />

      {/* Add Event Dialog */}
      <AddEventDialog
        open={showAddEventDialog}
        onClose={() => setShowAddEventDialog(false)}
        onAdd={(event) => {
          addEvent(event);
          setShowAddEventDialog(false);
        }}
        users={users}
      />
    </div>
  );
}

// Event Detail Dialog
interface EventDetailDialogProps {
  event: ICalendarEvent | null;
  open: boolean;
  onClose: () => void;
}

function EventDetailDialog({ event, open, onClose }: EventDetailDialogProps) {
  if (!event) return null;

  const startDate = parseISO(event.startDate);
  const endDate = parseISO(event.endDate);

  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-in fade-in-0" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md bg-card rounded-2xl shadow-2xl border border-border/40 p-6 animate-in fade-in-0 zoom-in-95">
          <div className="flex items-start justify-between mb-4">
            <Dialog.Title className="text-xl font-semibold">{event.title}</Dialog.Title>
            <Dialog.Close asChild>
              <button className="p-1 hover:bg-muted/60 rounded-lg transition-colors">
                <X className="h-5 w-5" />
              </button>
            </Dialog.Close>
          </div>

          <div className="space-y-4">
            {event.user && (
              <div className="flex items-center gap-3 text-muted-foreground">
                <User className="h-4 w-4" />
                <span>{event.user.name}</span>
              </div>
            )}

            <div className="flex items-center gap-3 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{format(startDate, "EEEE, MMMM d, yyyy")}</span>
            </div>

            <div className="flex items-center gap-3 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>
                {format(startDate, "h:mm a")} - {format(endDate, "h:mm a")}
              </span>
            </div>

            {event.description && (
              <div className="flex items-start gap-3 text-muted-foreground">
                <FileText className="h-4 w-4 mt-0.5" />
                <p className="text-sm">{event.description}</p>
              </div>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

// Add Event Dialog
interface AddEventDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (event: ICalendarEvent) => void;
  users: ICalendarUser[];
}

function AddEventDialog({ open, onClose, onAdd, users }: AddEventDialogProps) {
  const { selectedDate } = useCalendar();
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [startTime, setStartTime] = React.useState("09:00");
  const [endTime, setEndTime] = React.useState("10:00");
  const [color, setColor] = React.useState<TEventColor>("blue");
  const [userId, setUserId] = React.useState(users[0]?.id || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const [startHour, startMin] = startTime.split(":").map(Number);
    const [endHour, endMin] = endTime.split(":").map(Number);

    const startDate = new Date(selectedDate);
    startDate.setHours(startHour, startMin, 0, 0);

    const endDate = new Date(selectedDate);
    endDate.setHours(endHour, endMin, 0, 0);

    const user = users.find((u) => u.id === userId) || users[0];

    const event: ICalendarEvent = {
      id: crypto.randomUUID(),
      title,
      description,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      color,
      user,
    };

    onAdd(event);
    resetForm();
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setStartTime("09:00");
    setEndTime("10:00");
    setColor("blue");
  };

  const colors: TEventColor[] = ["blue", "green", "red", "yellow", "purple", "orange", "pink", "teal"];

  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-in fade-in-0" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md bg-card rounded-2xl shadow-2xl border border-border/40 p-6 animate-in fade-in-0 zoom-in-95">
          <div className="flex items-start justify-between mb-4">
            <Dialog.Title className="text-xl font-semibold">Add Event</Dialog.Title>
            <Dialog.Close asChild>
              <button className="p-1 hover:bg-muted/60 rounded-lg transition-colors">
                <X className="h-5 w-5" />
              </button>
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Event title"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                rows={3}
                placeholder="Event description (optional)"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">
                  Start Time
                </label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">
                  End Time
                </label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {users.length > 0 && (
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">
                  Assigned To
                </label>
                <select
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Color
              </label>
              <div className="flex flex-wrap gap-2">
                {colors.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={cn(
                      "w-8 h-8 rounded-full transition-all",
                      c === "blue" && "bg-blue-500",
                      c === "green" && "bg-emerald-500",
                      c === "red" && "bg-rose-500",
                      c === "yellow" && "bg-amber-400",
                      c === "purple" && "bg-purple-500",
                      c === "orange" && "bg-orange-500",
                      c === "pink" && "bg-pink-500",
                      c === "teal" && "bg-teal-500",
                      color === c && "ring-2 ring-offset-2 ring-foreground"
                    )}
                  />
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted/60 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Add Event
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
