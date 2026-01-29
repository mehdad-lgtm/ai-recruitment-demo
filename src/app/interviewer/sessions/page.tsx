"use client";

import {
    CalendarContainer,
    CalendarProvider,
    type ICalendarEvent,
    type ICalendarUser
} from "@/components/calendar";
import { ProtectedDashboard } from "@/components/dashboard";
import { Button } from "@/components/ui/button";
import {
    Calendar,
    ChevronRight,
    Clock,
    List,
    User,
    Video
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// Mock data - replace with real API calls
const mockUsers: ICalendarUser[] = [
  { id: "int-001", name: "Leonardo Ramos", picturePath: null },
  { id: "int-002", name: "Michael Doe", picturePath: null },
  { id: "int-003", name: "Alice Johnson", picturePath: null },
  { id: "int-004", name: "Priya Singh", picturePath: null },
  { id: "int-005", name: "Chen Li", picturePath: null },
  { id: "int-006", name: "Amina Khan", picturePath: null },
];

const mockSessions: ICalendarEvent[] = [
  // Happening now
  {
    id: "s-001",
    title: "Interview - John Doe",
    description: "Software Developer position",
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 45 * 60 * 1000).toISOString(),
    color: "blue",
    user: mockUsers[0],
    sessionType: "video",
    candidateId: "c-001",
    status: "scheduled",
  },
  // Overlapping short interview
  {
    id: "s-002",
    title: "Interview - Carlos Mendes",
    description: "Customer Success",
    startDate: new Date(Date.now() + 20 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 65 * 60 * 1000).toISOString(),
    color: "green",
    user: mockUsers[1],
    sessionType: "video",
    candidateId: "c-007",
    status: "scheduled",
  },
  // In a couple hours
  {
    id: "s-003",
    title: "Interview - Sarah Smith",
    description: "Product Manager position",
    startDate: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 2.75 * 60 * 60 * 1000).toISOString(),
    color: "teal",
    user: mockUsers[2],
    sessionType: "in-person",
    candidateId: "c-002",
    status: "scheduled",
  },
  // Later today long panel
  {
    id: "s-004",
    title: "Panel Interview - Team A",
    description: "Multiple interviewers",
    startDate: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
    color: "purple",
    user: mockUsers[3],
    sessionType: "in-person",
    candidateId: "c-008",
    status: "scheduled",
  },
  // Tomorrow
  {
    id: "s-005",
    title: "Interview - Mike Johnson",
    description: "Sales Executive position",
    startDate: new Date(Date.now() + 24 * 60 * 60 * 1000 + 10 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 24 * 60 * 60 * 1000 + 11 * 60 * 60 * 1000).toISOString(),
    color: "orange",
    user: mockUsers[4],
    sessionType: "video",
    candidateId: "c-003",
    status: "scheduled",
  },
  // Multi-day hiring drive
  {
    id: "s-006",
    title: "Campus Hiring Drive",
    description: "On-site campus interviews",
    startDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 9 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000 + 17 * 60 * 60 * 1000).toISOString(),
    color: "yellow",
    user: mockUsers[4],
    sessionType: "in-person",
    candidateId: "c-driving",
    status: "scheduled",
  },
  // All-day event (holiday/block)
  {
    id: "s-007",
    title: "Office Closed - Maintenance",
    description: "Office maintenance - no interviews",
    startDate: new Date().toISOString().split("T")[0] + "T00:00:00.000Z",
    endDate: new Date().toISOString().split("T")[0] + "T23:59:59.000Z",
    color: "red",
    user: mockUsers[0],
    sessionType: "phone",
    candidateId: "",
    status: "scheduled",
  },
  // Past event (yesterday)
  {
    id: "s-008",
    title: "Follow-up - Kevin",
    description: "Phone follow-up after screening",
    startDate: new Date(Date.now() - 24 * 60 * 60 * 1000 + 11 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() - 24 * 60 * 60 * 1000 + 11 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(),
    color: "indigo",
    user: mockUsers[5],
    sessionType: "phone",
    candidateId: "c-009",
    status: "completed",
  },
  // Short technical screen
  {
    id: "s-009",
    title: "Technical Screening - Anna Lee",
    description: "Frontend Developer",
    startDate: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
    color: "teal",
    user: mockUsers[1],
    sessionType: "video",
    candidateId: "c-005",
    status: "scheduled",
  },
  // Evening candidate
  {
    id: "s-010",
    title: "Interview - Emma Liu",
    description: "Data Analyst",
    startDate: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString(),
    color: "pink",
    user: mockUsers[2],
    sessionType: "video",
    candidateId: "c-010",
    status: "scheduled",
  },
];

const upcomingSessions = [
  {
    id: "s-001",
    candidateName: "John Doe",
    position: "Software Developer",
    date: new Date(),
    time: "09:00 AM",
    duration: "45 min",
    type: "Video Call",
    status: "upcoming",
  },
  {
    id: "s-002",
    candidateName: "Sarah Smith",
    position: "Product Manager",
    date: new Date(),
    time: "11:00 AM",
    duration: "45 min",
    type: "In-person",
    status: "upcoming",
  },
  {
    id: "s-003",
    candidateName: "Mike Johnson",
    position: "Sales Executive",
    date: new Date(Date.now() + 24 * 60 * 60 * 1000),
    time: "10:00 AM",
    duration: "30 min",
    type: "Video Call",
    status: "upcoming",
  },
];

export default function SessionsPage() {
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar");

  return (
    <ProtectedDashboard allowedRoles={["admin", "interviewer"]}>
      {/* Page Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">My Sessions</h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              View and manage your interview sessions.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border border-border overflow-hidden">
              <Button
                variant={viewMode === "calendar" ? "default" : "ghost"}
                size="sm"
                className="rounded-none text-xs sm:text-sm"
                onClick={() => setViewMode("calendar")}
              >
                <Calendar className="h-4 w-4 sm:mr-1" />
                <span className="hidden sm:inline">Calendar</span>
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                className="rounded-none text-xs sm:text-sm"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4 sm:mr-1" />
                <span className="hidden sm:inline">List</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {viewMode === "calendar" ? (
        <>
          {/* Calendar with Full Toolbar */}
          <CalendarProvider users={mockUsers} events={mockSessions}>
            <CalendarContainer />
          </CalendarProvider>
        </>
      ) : (
        /* List View */
        <div className="space-y-6">
          {/* Today's Sessions */}
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-border bg-muted/30">
              <h3 className="font-semibold text-foreground text-sm sm:text-base">Today&apos;s Sessions</h3>
            </div>
            <div className="divide-y divide-border">
              {upcomingSessions
                .filter((s) => s.date.toDateString() === new Date().toDateString())
                .map((session, index) => (
                  <div
                    key={session.id}
                    className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0 sm:hidden">
                        <p className="font-medium text-foreground text-sm">{session.candidateName}</p>
                        <p className="text-xs text-muted-foreground">{session.position}</p>
                      </div>
                    </div>
                    <div className="hidden sm:block flex-1 min-w-0">
                      <p className="font-medium text-foreground">{session.candidateName}</p>
                      <p className="text-sm text-muted-foreground">{session.position}</p>
                      <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {session.time}
                        </span>
                        <span>•</span>
                        <span>{session.duration}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Video className="h-3 w-3" />
                          {session.type}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground sm:hidden">
                      <Clock className="h-3 w-3" />
                      <span>{session.time}</span>
                      <span>•</span>
                      <span>{session.duration}</span>
                    </div>
                    <div className="flex gap-2 sm:shrink-0">
                      <Link href={`/interviewer/briefs/${session.id}`}>
                        <Button variant="outline" size="sm" className="text-xs sm:text-sm h-8">
                          View Brief
                        </Button>
                      </Link>
                      {index === 0 && (
                        <Button size="sm" className="text-xs sm:text-sm h-8">
                          Join Now
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              {upcomingSessions.filter((s) => s.date.toDateString() === new Date().toDateString()).length === 0 && (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                  <p className="text-muted-foreground">No sessions scheduled for today</p>
                </div>
              )}
            </div>
          </div>

          {/* Upcoming Sessions */}
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-border bg-muted/30">
              <h3 className="font-semibold text-foreground text-sm sm:text-base">Upcoming Sessions</h3>
            </div>
            <div className="divide-y divide-border">
              {upcomingSessions
                .filter((s) => s.date.toDateString() !== new Date().toDateString())
                .map((session) => (
                  <div
                    key={session.id}
                    className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0 sm:hidden">
                        <p className="font-medium text-foreground text-sm">{session.candidateName}</p>
                        <p className="text-xs text-muted-foreground">{session.position}</p>
                      </div>
                    </div>
                    <div className="hidden sm:block flex-1 min-w-0">
                      <p className="font-medium text-foreground">{session.candidateName}</p>
                      <p className="text-sm text-muted-foreground">{session.position}</p>
                      <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                        <span>{session.date.toLocaleDateString()}</span>
                        <span>•</span>
                        <span>{session.time}</span>
                        <span>•</span>
                        <span>{session.duration}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground sm:hidden">
                      <span>{session.date.toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{session.time}</span>
                    </div>
                    <Link href={`/interviewer/briefs/${session.id}`}>
                      <Button variant="outline" size="sm" className="text-xs sm:text-sm h-8 w-full sm:w-auto">
                        View Brief
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </Link>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </ProtectedDashboard>
  );
}
