"use client";

import { CalendarProvider } from "@/components/calendar/calendar-context";
import { CalendarWeekView } from "@/components/calendar/calendar-week-view";
import type { ICalendarEvent, ICalendarUser } from "@/components/calendar/types";
import { ProtectedDashboard } from "@/components/dashboard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { addDays, addWeeks, format, startOfWeek, subWeeks } from "date-fns";
import {
    Calendar,
    Check,
    ChevronLeft,
    ChevronRight,
    Clock,
    Copy,
    Plus,
    Save,
    Settings,
    X
} from "lucide-react";
import { useState } from "react";

// Mock current user
const currentUser: ICalendarUser = {
  id: "u-002",
  name: "Jane Interviewer",
  role: "interviewer",
  color: "green",
};

// Days of the week for availability settings
const daysOfWeek = [
  { key: "monday", label: "Monday" },
  { key: "tuesday", label: "Tuesday" },
  { key: "wednesday", label: "Wednesday" },
  { key: "thursday", label: "Thursday" },
  { key: "friday", label: "Friday" },
  { key: "saturday", label: "Saturday" },
  { key: "sunday", label: "Sunday" },
];

// Default working hours
const defaultWorkingHours = {
  monday: { enabled: true, start: "09:00", end: "17:00" },
  tuesday: { enabled: true, start: "09:00", end: "17:00" },
  wednesday: { enabled: true, start: "09:00", end: "17:00" },
  thursday: { enabled: true, start: "09:00", end: "17:00" },
  friday: { enabled: true, start: "09:00", end: "17:00" },
  saturday: { enabled: false, start: "09:00", end: "17:00" },
  sunday: { enabled: false, start: "09:00", end: "17:00" },
};

// Mock availability slots
const mockAvailabilitySlots: ICalendarEvent[] = [
  {
    id: "av-001",
    title: "Available",
    startDate: new Date(new Date().setHours(9, 0, 0, 0)),
    endDate: new Date(new Date().setHours(12, 0, 0, 0)),
    color: "green",
    user: currentUser,
  },
  {
    id: "av-002",
    title: "Available",
    startDate: new Date(new Date().setHours(14, 0, 0, 0)),
    endDate: new Date(new Date().setHours(17, 0, 0, 0)),
    color: "green",
    user: currentUser,
  },
  {
    id: "av-003",
    title: "Available",
    startDate: addDays(new Date().setHours(10, 0, 0, 0), 1),
    endDate: addDays(new Date().setHours(16, 0, 0, 0), 1),
    color: "green",
    user: currentUser,
  },
];

// Blocked times (existing meetings, sessions, etc.)
const blockedSlots: ICalendarEvent[] = [
  {
    id: "bl-001",
    title: "Interview: John Doe",
    startDate: new Date(new Date().setHours(10, 0, 0, 0)),
    endDate: new Date(new Date().setHours(11, 0, 0, 0)),
    color: "blue",
    user: currentUser,
  },
  {
    id: "bl-002",
    title: "Team Meeting",
    startDate: addDays(new Date().setHours(14, 0, 0, 0), 2),
    endDate: addDays(new Date().setHours(15, 0, 0, 0), 2),
    color: "purple",
    user: currentUser,
  },
];

function AvailabilityContent() {
  const [view, setView] = useState<"calendar" | "settings">("calendar");
  const [workingHours, setWorkingHours] = useState(defaultWorkingHours);
  const [hasChanges, setHasChanges] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState(new Date());
  const [availabilitySlots, setAvailabilitySlots] = useState(mockAvailabilitySlots);
  const [showQuickAdd, setShowQuickAdd] = useState(false);

  const weekStart = startOfWeek(selectedWeek, { weekStartsOn: 1 });
  const weekEnd = addDays(weekStart, 6);

  const handleWorkingHoursChange = (day: string, field: "enabled" | "start" | "end", value: boolean | string) => {
    setWorkingHours((prev) => ({
      ...prev,
      [day]: {
        ...prev[day as keyof typeof prev],
        [field]: value,
      },
    }));
    setHasChanges(true);
  };

  const handleSaveSettings = () => {
    // API call to save working hours
    setHasChanges(false);
    // Show success toast
  };

  const handleCopyToNextWeek = () => {
    // Copy current week's availability to next week
    const nextWeekSlots = availabilitySlots.map((slot) => ({
      ...slot,
      id: `${slot.id}-copy`,
      startDate: addWeeks(new Date(slot.startDate), 1),
      endDate: addWeeks(new Date(slot.endDate), 1),
    }));
    setAvailabilitySlots([...availabilitySlots, ...nextWeekSlots]);
  };

  const allEvents = [...availabilitySlots, ...blockedSlots];

  return (
    <>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Availability</h1>
          <p className="text-muted-foreground mt-1">
            Set your available time slots for interviews.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-muted rounded-lg p-1">
            <button
              className={cn(
                "px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
                view === "calendar"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
              onClick={() => setView("calendar")}
            >
              <Calendar className="h-4 w-4 inline-block mr-1" />
              Calendar
            </button>
            <button
              className={cn(
                "px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
                view === "settings"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
              onClick={() => setView("settings")}
            >
              <Settings className="h-4 w-4 inline-block mr-1" />
              Settings
            </button>
          </div>
        </div>
      </div>

      {view === "calendar" ? (
        <div className="space-y-6">
          {/* Calendar Header */}
          <div className="flex items-center justify-between bg-card rounded-xl border border-border p-4">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setSelectedWeek(subWeeks(selectedWeek, 1))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setSelectedWeek(addWeeks(selectedWeek, 1))}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <h2 className="text-lg font-semibold text-foreground ml-2">
                {format(weekStart, "MMM d")} - {format(weekEnd, "MMM d, yyyy")}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedWeek(new Date())}
                className="ml-2"
              >
                Today
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={handleCopyToNextWeek}>
                <Copy className="h-4 w-4 mr-2" />
                Copy to Next Week
              </Button>
              <Button onClick={() => setShowQuickAdd(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Availability
              </Button>
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-6 bg-card rounded-xl border border-border p-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500/20 border border-green-500 rounded" />
              <span className="text-sm text-muted-foreground">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500/20 border border-blue-500 rounded" />
              <span className="text-sm text-muted-foreground">Scheduled Interview</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-purple-500/20 border border-purple-500 rounded" />
              <span className="text-sm text-muted-foreground">Meeting</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-muted border border-border rounded" />
              <span className="text-sm text-muted-foreground">Outside Working Hours</span>
            </div>
          </div>

          {/* Calendar View */}
          <CalendarProvider
            initialEvents={allEvents}
            initialUsers={[currentUser]}
            initialWorkingHours={{ start: 8, end: 18 }}
            initialVisibleHours={{ start: 7, end: 19 }}
          >
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <CalendarWeekView />
            </div>
          </CalendarProvider>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-card rounded-xl border border-border p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <Check className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {availabilitySlots.length * 3}h
                  </p>
                  <p className="text-sm text-muted-foreground">Available This Week</p>
                </div>
              </div>
            </div>
            <div className="bg-card rounded-xl border border-border p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Calendar className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {blockedSlots.length}
                  </p>
                  <p className="text-sm text-muted-foreground">Scheduled Sessions</p>
                </div>
              </div>
            </div>
            <div className="bg-card rounded-xl border border-border p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <Clock className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {availabilitySlots.length * 3 - blockedSlots.length}h
                  </p>
                  <p className="text-sm text-muted-foreground">Free Time Left</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Settings View */
        <div className="space-y-6">
          {/* Working Hours Settings */}
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="p-6 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground">Default Working Hours</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Set your regular working hours. These will be used as defaults when adding availability.
              </p>
            </div>
            <div className="divide-y divide-border">
              {daysOfWeek.map((day) => {
                const dayConfig = workingHours[day.key as keyof typeof workingHours];
                return (
                  <div key={day.key} className="p-4 flex items-center gap-4">
                    <div className="w-32">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={dayConfig.enabled}
                          onChange={(e) =>
                            handleWorkingHoursChange(day.key, "enabled", e.target.checked)
                          }
                          className="rounded border-border"
                        />
                        <span className={cn(
                          "font-medium",
                          dayConfig.enabled ? "text-foreground" : "text-muted-foreground"
                        )}>
                          {day.label}
                        </span>
                      </label>
                    </div>
                    {dayConfig.enabled && (
                      <div className="flex items-center gap-2">
                        <input
                          type="time"
                          value={dayConfig.start}
                          onChange={(e) =>
                            handleWorkingHoursChange(day.key, "start", e.target.value)
                          }
                          className="px-3 py-1.5 bg-muted border border-border rounded-lg text-sm"
                        />
                        <span className="text-muted-foreground">to</span>
                        <input
                          type="time"
                          value={dayConfig.end}
                          onChange={(e) =>
                            handleWorkingHoursChange(day.key, "end", e.target.value)
                          }
                          className="px-3 py-1.5 bg-muted border border-border rounded-lg text-sm"
                        />
                      </div>
                    )}
                    {!dayConfig.enabled && (
                      <span className="text-sm text-muted-foreground">Unavailable</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Interview Preferences */}
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="p-6 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground">Interview Preferences</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Configure how interviews are scheduled for you.
              </p>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Minimum Notice</p>
                  <p className="text-sm text-muted-foreground">
                    How much notice do you need before an interview?
                  </p>
                </div>
                <select className="px-3 py-2 bg-muted border border-border rounded-lg text-sm">
                  <option>30 minutes</option>
                  <option>1 hour</option>
                  <option>2 hours</option>
                  <option>4 hours</option>
                  <option>1 day</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Buffer Between Interviews</p>
                  <p className="text-sm text-muted-foreground">
                    Time gap between consecutive interviews.
                  </p>
                </div>
                <select className="px-3 py-2 bg-muted border border-border rounded-lg text-sm">
                  <option>No buffer</option>
                  <option>15 minutes</option>
                  <option>30 minutes</option>
                  <option>1 hour</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Max Interviews Per Day</p>
                  <p className="text-sm text-muted-foreground">
                    Maximum number of interviews in a day.
                  </p>
                </div>
                <select className="px-3 py-2 bg-muted border border-border rounded-lg text-sm">
                  <option>Unlimited</option>
                  <option>3</option>
                  <option>5</option>
                  <option>8</option>
                  <option>10</option>
                </select>
              </div>
            </div>
          </div>

          {/* Save Button */}
          {hasChanges && (
            <div className="flex justify-end">
              <Button onClick={handleSaveSettings}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Quick Add Modal */}
      {showQuickAdd && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card rounded-xl border border-border w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Add Availability</h3>
              <button onClick={() => setShowQuickAdd(false)}>
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Date</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm"
                  defaultValue={format(new Date(), "yyyy-MM-dd")}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Start Time</label>
                  <input
                    type="time"
                    className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm"
                    defaultValue="09:00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">End Time</label>
                  <input
                    type="time"
                    className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm"
                    defaultValue="17:00"
                  />
                </div>
              </div>
              <div>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded border-border" />
                  <span className="text-sm text-foreground">Repeat weekly</span>
                </label>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setShowQuickAdd(false)}>
                Cancel
              </Button>
              <Button onClick={() => setShowQuickAdd(false)}>
                Add Availability
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function AvailabilityPage() {
  return (
    <ProtectedDashboard allowedRoles={["admin", "interviewer"]}>
      <AvailabilityContent />
    </ProtectedDashboard>
  );
}
