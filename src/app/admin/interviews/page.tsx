"use client";

import { CalendarContainer } from "@/components/calendar/calendar-container";
import { CalendarProvider } from "@/components/calendar/calendar-context";
import type { ICalendarEvent, ICalendarUser } from "@/components/calendar/types";
import { ProtectedDashboard } from "@/components/dashboard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
    Calendar,
    Check,
    Clock,
    Edit,
    List,
    MoreHorizontal,
    Plus,
    Search,
    User,
    Video,
    X
} from "lucide-react";
import { useState } from "react";

// Mock users (interviewers)
const mockInterviewers: ICalendarUser[] = [
  { id: "u-001", name: "Jane Smith", picturePath: null, role: "interviewer", color: "blue" },
  { id: "u-002", name: "Michael Lee", picturePath: null, role: "interviewer", color: "green" },
  { id: "u-003", name: "Sarah Wong", picturePath: null, role: "interviewer", color: "purple" },
  { id: "u-004", name: "David Chen", picturePath: null, role: "interviewer", color: "orange" },
];

// Mock interview sessions
const mockSessions: ICalendarEvent[] = [
  {
    id: "s-001",
    title: "John Doe - Software Developer",
    description: "Technical interview",
    startDate: new Date(new Date().setHours(9, 0, 0, 0)).toISOString(),
    endDate: new Date(new Date().setHours(10, 0, 0, 0)).toISOString(),
    color: "blue",
    user: mockInterviewers[0],
  },
  {
    id: "s-002",
    title: "Sarah Smith - Product Manager",
    description: "Behavioral interview",
    startDate: new Date(new Date().setHours(11, 0, 0, 0)).toISOString(),
    endDate: new Date(new Date().setHours(12, 0, 0, 0)).toISOString(),
    color: "green",
    user: mockInterviewers[1],
  },
  {
    id: "s-003",
    title: "Mike Johnson - Sales Executive",
    description: "Initial screening",
    startDate: new Date(new Date().setHours(14, 0, 0, 0)).toISOString(),
    endDate: new Date(new Date().setHours(15, 0, 0, 0)).toISOString(),
    color: "purple",
    user: mockInterviewers[2],
  },
  {
    id: "s-004",
    title: "Emily Chen - UX Designer",
    description: "Portfolio review",
    startDate: new Date(new Date().setHours(16, 0, 0, 0)).toISOString(),
    endDate: new Date(new Date().setHours(17, 0, 0, 0)).toISOString(),
    color: "blue",
    user: mockInterviewers[0],
  },
];

// Mock sessions list data
const mockSessionsList = [
  {
    id: "s-001",
    candidate: { name: "John Doe", email: "john.doe@email.com", position: "Software Developer" },
    interviewer: { id: "u-001", name: "Jane Smith" },
    date: new Date(new Date().setHours(9, 0, 0, 0)),
    duration: 60,
    status: "scheduled",
    type: "technical",
    meetingLink: "https://meet.google.com/abc-defg-hij",
    notes: "Focus on React and Node.js experience",
  },
  {
    id: "s-002",
    candidate: { name: "Sarah Smith", email: "sarah.smith@email.com", position: "Product Manager" },
    interviewer: { id: "u-002", name: "Michael Lee" },
    date: new Date(new Date().setHours(11, 0, 0, 0)),
    duration: 45,
    status: "scheduled",
    type: "behavioral",
    meetingLink: "https://meet.google.com/klm-nopq-rst",
    notes: "Leadership and strategic thinking assessment",
  },
  {
    id: "s-003",
    candidate: { name: "Mike Johnson", email: "mike.johnson@email.com", position: "Sales Executive" },
    interviewer: { id: "u-003", name: "Sarah Wong" },
    date: new Date(new Date().setHours(14, 0, 0, 0)),
    duration: 30,
    status: "scheduled",
    type: "initial",
    meetingLink: null,
    notes: "Initial screening call",
  },
  {
    id: "s-004",
    candidate: { name: "Emily Chen", email: "emily.chen@email.com", position: "UX Designer" },
    interviewer: { id: "u-001", name: "Jane Smith" },
    date: new Date(Date.now() - 24 * 60 * 60 * 1000),
    duration: 60,
    status: "completed",
    type: "portfolio",
    meetingLink: "https://meet.google.com/uvw-xyza-bcd",
    notes: "Portfolio review completed. Strong candidate.",
    feedback: { rating: 4, recommendation: "hire" },
  },
  {
    id: "s-005",
    candidate: { name: "David Wong", email: "david.wong@email.com", position: "Data Analyst" },
    interviewer: { id: "u-002", name: "Michael Lee" },
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    duration: 45,
    status: "completed",
    type: "technical",
    meetingLink: null,
    notes: "Technical assessment completed.",
    feedback: { rating: 2, recommendation: "reject" },
  },
  {
    id: "s-006",
    candidate: { name: "Lisa Tan", email: "lisa.tan@email.com", position: "Marketing Manager" },
    interviewer: { id: "u-003", name: "Sarah Wong" },
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    duration: 30,
    status: "no-show",
    type: "initial",
    meetingLink: null,
    notes: "Candidate did not attend scheduled interview.",
  },
];

const statusColors: Record<string, string> = {
  scheduled: "bg-blue-500/10 text-blue-600",
  completed: "bg-green-500/10 text-green-600",
  cancelled: "bg-gray-500/10 text-gray-600",
  "no-show": "bg-red-500/10 text-red-600",
};

const typeColors: Record<string, string> = {
  initial: "bg-gray-500/10 text-gray-600",
  technical: "bg-purple-500/10 text-purple-600",
  behavioral: "bg-orange-500/10 text-orange-600",
  portfolio: "bg-pink-500/10 text-pink-600",
};

// Pre-calculate dates outside component to avoid impure function calls
const today = new Date();
const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);

export default function AdminInterviewsPage() {
  const [view, setView] = useState<"calendar" | "list">("calendar");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedInterviewer, setSelectedInterviewer] = useState("all");
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  const filteredSessions = mockSessionsList.filter((session) => {
    const matchesSearch =
      session.candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.candidate.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.interviewer.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === "all" || session.status === selectedStatus;
    const matchesInterviewer =
      selectedInterviewer === "all" || session.interviewer.id === selectedInterviewer;
    return matchesSearch && matchesStatus && matchesInterviewer;
  });

  // Stats
  const stats = {
    today: mockSessionsList.filter(
      (s) => s.date.toDateString() === new Date().toDateString() && s.status === "scheduled"
    ).length,
    scheduled: mockSessionsList.filter((s) => s.status === "scheduled").length,
    completed: mockSessionsList.filter((s) => s.status === "completed").length,
    noShow: mockSessionsList.filter((s) => s.status === "no-show").length,
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (date: Date) => {
    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
    if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow";
    return date.toLocaleDateString();
  };

  return (
    <ProtectedDashboard allowedRoles={["admin"]}>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Interview Sessions</h1>
          <p className="text-muted-foreground mt-1">
            Manage and monitor all interview sessions across the organization.
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
                view === "list"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
              onClick={() => setView("list")}
            >
              <List className="h-4 w-4 inline-block mr-1" />
              List
            </button>
          </div>
          <Button onClick={() => setShowScheduleModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Schedule Interview
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Calendar className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.today}</p>
              <p className="text-sm text-muted-foreground">Today&apos;s Sessions</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <Clock className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.scheduled}</p>
              <p className="text-sm text-muted-foreground">Scheduled</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <Check className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.completed}</p>
              <p className="text-sm text-muted-foreground">Completed</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500/10 rounded-lg">
              <X className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.noShow}</p>
              <p className="text-sm text-muted-foreground">No Shows</p>
            </div>
          </div>
        </div>
      </div>

      {view === "calendar" ? (
        /* Calendar View */
        <div className="space-y-4">
          {/* Interviewer Legend */}
          <div className="flex items-center gap-4 bg-card rounded-xl border border-border p-4">
            {mockInterviewers.map((interviewer) => (
              <div key={interviewer.id} className="flex items-center gap-2">
                <div
                  className={cn(
                    "w-3 h-3 rounded-full",
                    interviewer.color === "blue" && "bg-blue-500",
                    interviewer.color === "green" && "bg-green-500",
                    interviewer.color === "purple" && "bg-purple-500",
                    interviewer.color === "orange" && "bg-orange-500"
                  )}
                />
                <span className="text-sm text-foreground">{interviewer.name}</span>
              </div>
            ))}
          </div>

          {/* Calendar */}
          <CalendarProvider
            initialEvents={mockSessions}
            initialUsers={mockInterviewers}
            initialView="week"
            initialWorkingHours={{ start: 8, end: 18 }}
            initialVisibleHours={{ start: 7, end: 19 }}
          >
            <CalendarContainer 
              showToolbar={true}
              showUserFilter={true}
              onAddEvent={() => setShowScheduleModal(true)}
            />
          </CalendarProvider>
        </div>
      ) : (
        /* List View */
        <div className="space-y-4">
          {/* Filters */}
          <div className="bg-card rounded-xl border border-border p-4">
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search by candidate or interviewer..."
                  className="w-full pl-10 pr-4 py-2 bg-muted/50 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <select
                className="px-3 py-2 bg-muted border border-border rounded-lg text-sm"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="no-show">No Show</option>
              </select>
              <select
                className="px-3 py-2 bg-muted border border-border rounded-lg text-sm"
                value={selectedInterviewer}
                onChange={(e) => setSelectedInterviewer(e.target.value)}
              >
                <option value="all">All Interviewers</option>
                {mockInterviewers.map((interviewer) => (
                  <option key={interviewer.id} value={interviewer.id}>
                    {interviewer.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Sessions Table */}
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-4 font-medium text-muted-foreground">Candidate</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Interviewer</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Date & Time</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Type</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredSessions.map((session) => (
                  <tr key={session.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-semibold">
                          {session.candidate.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{session.candidate.name}</p>
                          <p className="text-sm text-muted-foreground">{session.candidate.position}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-foreground">{session.interviewer.name}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="text-foreground">{formatDate(session.date)}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatTime(session.date)} ({session.duration} min)
                        </p>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={cn("px-2 py-1 rounded-full text-xs font-medium capitalize", typeColors[session.type])}>
                        {session.type}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={cn("px-2 py-1 rounded-full text-xs font-medium capitalize", statusColors[session.status])}>
                        {session.status.replace("-", " ")}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        {session.meetingLink && (
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Video className="h-4 w-4" />
                          </Button>
                        )}
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Schedule Interview Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card rounded-xl border border-border w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-foreground">Schedule Interview</h3>
              <button onClick={() => setShowScheduleModal(false)}>
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Candidate</label>
                <select className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm">
                  <option>Select a candidate</option>
                  <option>John Doe - Software Developer</option>
                  <option>Sarah Smith - Product Manager</option>
                  <option>Mike Johnson - Sales Executive</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Interviewer</label>
                <select className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm">
                  <option>Select an interviewer</option>
                  {mockInterviewers.map((interviewer) => (
                    <option key={interviewer.id} value={interviewer.id}>
                      {interviewer.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Date</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Time</label>
                  <input
                    type="time"
                    className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Duration</label>
                <select className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm">
                  <option value="30">30 minutes</option>
                  <option value="45">45 minutes</option>
                  <option value="60">60 minutes</option>
                  <option value="90">90 minutes</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Interview Type</label>
                <select className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm">
                  <option value="initial">Initial Screening</option>
                  <option value="technical">Technical Interview</option>
                  <option value="behavioral">Behavioral Interview</option>
                  <option value="portfolio">Portfolio Review</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Notes</label>
                <textarea
                  className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm resize-none"
                  rows={3}
                  placeholder="Add any notes for the interviewer..."
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setShowScheduleModal(false)}>
                Cancel
              </Button>
              <Button onClick={() => setShowScheduleModal(false)}>
                Schedule Interview
              </Button>
            </div>
          </div>
        </div>
      )}
    </ProtectedDashboard>
  );
}
