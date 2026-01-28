"use client";

import {
    ProtectedDashboard,
    RecentActivity,
    StatCard,
} from "@/components/dashboard";
import { Button } from "@/components/ui";
import {
    Calendar,
    CheckCircle,
    ChevronRight,
    Clock,
    FileText,
    User,
    Video,
} from "lucide-react";
import Link from "next/link";

// Mock data - replace with real data fetching
const stats = [
  {
    title: "Today's Interviews",
    value: "4",
    description: "Scheduled for today",
    icon: Calendar,
  },
  {
    title: "This Week",
    value: "18",
    description: "Total sessions",
    icon: Clock,
  },
  {
    title: "Completed",
    value: "156",
    description: "All time",
    icon: CheckCircle,
  },
];

const todaysSessions = [
  {
    id: "1",
    candidateName: "John Doe",
    time: "09:00 AM",
    duration: "30 min",
    type: "Video Call",
    status: "upcoming",
  },
  {
    id: "2",
    candidateName: "Sarah Smith",
    time: "10:30 AM",
    duration: "45 min",
    type: "In-person",
    status: "upcoming",
  },
  {
    id: "3",
    candidateName: "Mike Johnson",
    time: "02:00 PM",
    duration: "30 min",
    type: "Video Call",
    status: "upcoming",
  },
  {
    id: "4",
    candidateName: "Emily Brown",
    time: "04:00 PM",
    duration: "45 min",
    type: "Video Call",
    status: "upcoming",
  },
];

const recentActivity = [
  {
    id: "1",
    title: "Interview completed",
    description: "David Wilson - Software Developer",
    time: "Yesterday",
    type: "success" as const,
  },
  {
    id: "2",
    title: "Feedback submitted",
    description: "Lisa Chen - Product Manager",
    time: "Yesterday",
    type: "success" as const,
  },
  {
    id: "3",
    title: "New assignment",
    description: "3 new interviews assigned to you",
    time: "2 days ago",
    type: "info" as const,
  },
];

export default function InterviewerDashboard() {
  return (
    <ProtectedDashboard allowedRoles={["admin", "interviewer"]}>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">My Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Here&apos;s your interview schedule and recent activity.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-3 mb-8">
        {stats.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            description={stat.description}
            icon={stat.icon}
          />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Today's Sessions - Takes 2 columns */}
        <div className="lg:col-span-2 bg-card rounded-xl border border-(--color-border) p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">Today&apos;s Sessions</h3>
            <Link href="/interviewer/sessions">
              <Button variant="outline" size="sm">
                View All
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>

          <div className="space-y-4">
            {todaysSessions.map((session, index) => (
              <div
                key={session.id}
                className="flex items-center gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground">{session.candidateName}</p>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
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
                <div className="shrink-0 flex gap-2">
                  <Link href={`/interviewer/briefs/${session.id}`}>
                    <Button variant="outline" size="sm">
                      <FileText className="h-4 w-4 mr-1" />
                      Brief
                    </Button>
                  </Link>
                  {index === 0 && (
                    <Button size="sm">
                      Join Now
                    </Button>
                  )}
                </div>
              </div>
            ))}

            {todaysSessions.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No interviews scheduled for today</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <RecentActivity items={recentActivity} />
      </div>

      {/* Upcoming Week Preview */}
      <div className="mt-8 bg-card rounded-xl border border-(--color-border) p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground">This Week Overview</h3>
          <Link href="/interviewer/availability">
            <Button variant="outline" size="sm">
              Manage Availability
            </Button>
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-7">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, index) => {
            const count = [3, 4, 5, 2, 4, 0, 0][index];
            const isToday = index === 0;
            return (
              <div
                key={day}
                className={`text-center p-4 rounded-lg ${
                  isToday
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/30"
                }`}
              >
                <p className={`text-sm font-medium ${isToday ? "text-primary-foreground" : "text-muted-foreground"}`}>
                  {day}
                </p>
                <p className={`text-2xl font-bold mt-1 ${isToday ? "text-primary-foreground" : "text-foreground"}`}>
                  {count}
                </p>
                <p className={`text-xs mt-1 ${isToday ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                  {count === 1 ? "interview" : "interviews"}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </ProtectedDashboard>
  );
}
