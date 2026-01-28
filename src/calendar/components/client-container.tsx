"use client";

import { AgendaView } from "@/calendar/components/agenda-view";
import { DayView } from "@/calendar/components/day-view";
import { MonthView } from "@/calendar/components/month-view";
import { CalendarToolbar } from "@/calendar/components/toolbar";
import { WeekView } from "@/calendar/components/week-view";
import { YearView } from "@/calendar/components/year-view";
import { useCalendar } from "@/calendar/contexts/calendar-context";
import type { IEvent, TEventColor } from "@/calendar/types";
import { cn } from "@/lib/utils";
import * as Dialog from "@radix-ui/react-dialog";
import { format, parseISO } from "date-fns";
import { Calendar, Clock, FileText, User, X } from "lucide-react";
import * as React from "react";

interface ClientContainerProps {
  className?: string;
}

export function ClientContainer({ className }: ClientContainerProps) {
  const { currentView, addEvent, users } = useCalendar();
  const [selectedEvent, setSelectedEvent] = React.useState<IEvent | null>(null);
  const [showAddEvent, setShowAddEvent] = React.useState(false);

  const handleEventClick = (event: IEvent) => {
    setSelectedEvent(event);
  };

  const handleAddEvent = () => {
    setShowAddEvent(true);
  };

  return (
    <div className={cn("mx-auto max-w-screen-2xl p-4", className)}>
      <CalendarToolbar onAddEvent={handleAddEvent} />

      <div className="bg-background/60 p-4 rounded-2xl shadow-sm border border-border/30">
        {currentView === "day" && <DayView onEventClick={handleEventClick} />}
        {currentView === "week" && <WeekView onEventClick={handleEventClick} />}
        {currentView === "month" && <MonthView onEventClick={handleEventClick} />}
        {currentView === "year" && <YearView onEventClick={handleEventClick} />}
        {currentView === "agenda" && <AgendaView onEventClick={handleEventClick} />}
      </div>

      {/* Event Detail Dialog */}
      <EventDetailDialog
        event={selectedEvent}
        open={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />

      {/* Add Event Dialog */}
      <AddEventDialog
        open={showAddEvent}
        onClose={() => setShowAddEvent(false)}
        onAdd={(event) => {
          addEvent(event);
          setShowAddEvent(false);
        }}
        users={users}
      />
    </div>
  );
}

// Event Detail Dialog
interface EventDetailDialogProps {
  event: IEvent | null;
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
                <span>{event.description}</span>
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-end">
            <Dialog.Close asChild>
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors">
                Close
              </button>
            </Dialog.Close>
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
  onAdd: (event: IEvent) => void;
  users: { id: string; name: string }[];
}

function AddEventDialog({ open, onClose, onAdd, users }: AddEventDialogProps) {
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [startDate, setStartDate] = React.useState("");
  const [startTime, setStartTime] = React.useState("");
  const [endTime, setEndTime] = React.useState("");
  const [selectedUser, setSelectedUser] = React.useState(users[0]?.id || "");
  const [color, setColor] = React.useState<TEventColor>("blue");

  const colors: TEventColor[] = ["blue", "green", "red", "yellow", "purple", "orange", "pink", "indigo", "teal"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !startDate || !startTime || !endTime) return;

    const start = new Date(`${startDate}T${startTime}`);
    const end = new Date(`${startDate}T${endTime}`);
    const user = users.find((u) => u.id === selectedUser);

    onAdd({
      id: Date.now(),
      title,
      description,
      startDate: start.toISOString(),
      endDate: end.toISOString(),
      color,
      user: user ? { id: user.id, name: user.name } : undefined,
    });

    // Reset form
    setTitle("");
    setDescription("");
    setStartDate("");
    setStartTime("");
    setEndTime("");
    setColor("blue");
  };

  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-in fade-in-0" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md bg-card rounded-2xl shadow-2xl border border-border/40 p-6 animate-in fade-in-0 zoom-in-95 max-h-[90vh] overflow-y-auto">
          <div className="flex items-start justify-between mb-4">
            <Dialog.Title className="text-xl font-semibold">Add Event</Dialog.Title>
            <Dialog.Close asChild>
              <button className="p-1 hover:bg-muted/60 rounded-lg transition-colors">
                <X className="h-5 w-5" />
              </button>
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium mb-1.5">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Event title"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-1.5">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                rows={3}
                placeholder="Event description (optional)"
              />
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium mb-1.5">Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Time */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Start Time</label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">End Time</label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* User */}
            {users.length > 0 && (
              <div>
                <label className="block text-sm font-medium mb-1.5">Assign to</label>
                <select
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Color */}
            <div>
              <label className="block text-sm font-medium mb-1.5">Color</label>
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
                      c === "indigo" && "bg-indigo-500",
                      c === "teal" && "bg-teal-500",
                      color === c && "ring-2 ring-offset-2 ring-foreground"
                    )}
                  />
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-4">
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="px-4 py-2 bg-muted text-foreground rounded-lg font-medium text-sm hover:bg-muted/80 transition-colors"
                >
                  Cancel
                </button>
              </Dialog.Close>
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors"
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
