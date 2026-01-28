"use client";

import {
    ProtectedDashboard,
    QuickActions,
    RecentActivity,
    StatCard,
} from "@/components/dashboard";
import {
    Calendar,
    CheckCircle,
    Clock,
    MessageSquare,
    Settings,
    TrendingUp,
    UserPlus,
    Users,
} from "lucide-react";

// Mock data - replace with real data fetching
const stats = [
  {
    title: "Total Candidates",
    value: "2,847",
    description: "Active in pipeline",
    icon: Users,
    trend: { value: 12, isPositive: true },
  },
  {
    title: "Scheduled Interviews",
    value: "156",
    description: "This week",
    icon: Calendar,
    trend: { value: 8, isPositive: true },
  },
  {
    title: "Completed Today",
    value: "24",
    description: "Interviews completed",
    icon: CheckCircle,
    trend: { value: 5, isPositive: true },
  },
  {
    title: "Pending Review",
    value: "67",
    description: "Awaiting decision",
    icon: Clock,
    trend: { value: 3, isPositive: false },
  },
];

const recentActivity = [
  {
    id: "1",
    title: "New candidate registered",
    description: "John Doe completed intake form",
    time: "2 min ago",
    type: "success" as const,
  },
  {
    id: "2",
    title: "Interview scheduled",
    description: "Sarah Smith - Tomorrow at 10:00 AM",
    time: "15 min ago",
    type: "info" as const,
  },
  {
    id: "3",
    title: "CV parsing completed",
    description: "AI extracted data for 5 candidates",
    time: "1 hour ago",
    type: "success" as const,
  },
  {
    id: "4",
    title: "Communication failed",
    description: "WhatsApp message to Mike Johnson",
    time: "2 hours ago",
    type: "error" as const,
  },
  {
    id: "5",
    title: "Interviewer availability updated",
    description: "Jane Williams updated her schedule",
    time: "3 hours ago",
    type: "info" as const,
  },
];

const quickActions = [
  {
    label: "Add New Candidate",
    description: "Manually register a candidate",
    href: "/admin/candidates/new",
    icon: UserPlus,
    color: "primary" as const,
  },
  {
    label: "View Analytics",
    description: "Check recruitment metrics",
    href: "/admin/analytics",
    icon: TrendingUp,
    color: "success" as const,
  },
  {
    label: "Send Broadcast",
    description: "Message multiple candidates",
    href: "/admin/communications/broadcast",
    icon: MessageSquare,
    color: "warning" as const,
  },
  {
    label: "System Settings",
    description: "Configure AI and integrations",
    href: "/admin/settings",
    icon: Settings,
    color: "secondary" as const,
  },
];

export default function AdminDashboard() {
  return (
    <ProtectedDashboard allowedRoles={["admin"]}>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back! Here&apos;s what&apos;s happening with your recruitment pipeline.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            description={stat.description}
            icon={stat.icon}
            trend={stat.trend}
          />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Activity - Takes 2 columns */}
        <div className="lg:col-span-2">
          <RecentActivity items={recentActivity} />
        </div>

        {/* Quick Actions */}
        <QuickActions actions={quickActions} />
      </div>

      {/* Pipeline Overview */}
      <div className="mt-8 bg-card rounded-xl border border-(--color-border) p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-foreground mb-6">Pipeline Overview</h3>
        <div className="grid gap-4 md:grid-cols-5">
          {[
            { stage: "New Leads", count: 342, color: "bg-blue-500" },
            { stage: "Screening", count: 156, color: "bg-yellow-500" },
            { stage: "Interview", count: 89, color: "bg-purple-500" },
            { stage: "Evaluation", count: 67, color: "bg-orange-500" },
            { stage: "Hired", count: 234, color: "bg-green-500" },
          ].map((stage) => (
            <div key={stage.stage} className="text-center p-4 rounded-lg bg-muted/50">
              <div
                className={`w-12 h-12 mx-auto rounded-full ${stage.color} flex items-center justify-center text-white font-bold mb-3`}
              >
                {stage.count > 99 ? "99+" : stage.count}
              </div>
              <p className="text-sm font-medium text-foreground">{stage.stage}</p>
            </div>
          ))}
        </div>
      </div>
    </ProtectedDashboard>
  );
}
