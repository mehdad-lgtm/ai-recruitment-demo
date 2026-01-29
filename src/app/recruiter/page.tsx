"use client";

import {
    ProtectedDashboard,
    QuickActions,
    RecentActivity,
    StatCard,
} from "@/components/dashboard";
import { Button } from "@/components/ui";
import {
    ChevronRight,
    Mail,
    MessageSquare,
    Phone,
    Plus,
    QrCode,
    Scan,
    Send,
    UserCheck,
    Users,
} from "lucide-react";
import Link from "next/link";

// Mock data - replace with real data fetching
const stats = [
  {
    title: "My Candidates",
    value: "124",
    description: "Total registered",
    icon: Users,
    trend: { value: 18, isPositive: true },
  },
  {
    title: "Active QR Codes",
    value: "12",
    description: "Currently active",
    icon: QrCode,
  },
  {
    title: "Successful Intakes",
    value: "89",
    description: "This month",
    icon: UserCheck,
    trend: { value: 24, isPositive: true },
  },
  {
    title: "Messages Sent",
    value: "456",
    description: "This week",
    icon: MessageSquare,
  },
];

const recentCandidates = [
  {
    id: "1",
    name: "John Doe",
    phone: "+65 9123 4567",
    email: "john.doe@email.com",
    status: "intake_completed",
    registeredAt: "2 hours ago",
  },
  {
    id: "2",
    name: "Sarah Smith",
    phone: "+65 9234 5678",
    email: "sarah.smith@email.com",
    status: "pending_screening",
    registeredAt: "5 hours ago",
  },
  {
    id: "3",
    name: "Mike Johnson",
    phone: "+65 9345 6789",
    email: "mike.johnson@email.com",
    status: "interview_scheduled",
    registeredAt: "Yesterday",
  },
  {
    id: "4",
    name: "Emily Brown",
    phone: "+65 9456 7890",
    email: "emily.brown@email.com",
    status: "intake_completed",
    registeredAt: "Yesterday",
  },
];

const recentActivity = [
  {
    id: "1",
    title: "New candidate registered",
    description: "John Doe via QR Code #QR-001",
    time: "2 hours ago",
    type: "success" as const,
  },
  {
    id: "2",
    title: "WhatsApp sent",
    description: "Interview reminder to Sarah Smith",
    time: "3 hours ago",
    type: "info" as const,
  },
  {
    id: "3",
    title: "QR Code scanned",
    description: "QR-003 scanned at Event Location",
    time: "4 hours ago",
    type: "info" as const,
  },
  {
    id: "4",
    title: "Candidate moved to screening",
    description: "Mike Johnson passed initial review",
    time: "Yesterday",
    type: "success" as const,
  },
];

const quickActions = [
  {
    label: "Generate QR Code",
    description: "Create new intake QR",
    href: "/recruiter/qr-codes/new",
    icon: Plus,
    color: "primary" as const,
  },
  {
    label: "View QR Analytics",
    description: "See scan statistics",
    href: "/recruiter/qr-codes",
    icon: Scan,
    color: "success" as const,
  },
  {
    label: "Send Bulk Messages",
    description: "Message candidates",
    href: "/recruiter/communications/bulk",
    icon: Send,
    color: "warning" as const,
  },
];

const statusColors: Record<string, string> = {
  intake_completed: "bg-green-500/10 text-green-600",
  pending_screening: "bg-yellow-500/10 text-yellow-600",
  interview_scheduled: "bg-blue-500/10 text-blue-600",
  rejected: "bg-red-500/10 text-red-600",
};

const statusLabels: Record<string, string> = {
  intake_completed: "Intake Done",
  pending_screening: "Pending",
  interview_scheduled: "Interview Set",
  rejected: "Rejected",
};

export default function RecruiterDashboard() {
  return (
    <ProtectedDashboard allowedRoles={["admin", "recruiter"]}>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Recruiter Portal</h1>
        <p className="text-muted-foreground mt-1">
          Manage your QR codes and track candidate registrations.
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
        {/* Recent Candidates - Takes 2 columns */}
        <div className="lg:col-span-2 bg-card rounded-xl border border-(--color-border) p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">Recent Candidates</h3>
            <Link href="/recruiter/candidates">
              <Button variant="outline" size="sm">
                View All
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>

          <div className="space-y-4">
            {recentCandidates.map((candidate) => (
              <div
                key={candidate.id}
                className="flex items-center gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                  {candidate.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground">{candidate.name}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {candidate.phone}
                    </span>
                    <span className="hidden md:flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {candidate.email}
                    </span>
                  </div>
                </div>
                <div className="shrink-0 flex items-center gap-3">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      statusColors[candidate.status]
                    }`}
                  >
                    {statusLabels[candidate.status]}
                  </span>
                  <span className="text-xs text-muted-foreground hidden sm:block">
                    {candidate.registeredAt}
                  </span>
                </div>
              </div>
            ))}

            {recentCandidates.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No candidates registered yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <QuickActions actions={quickActions} />

          {/* Recent Activity */}
          <RecentActivity items={recentActivity} />
        </div>
      </div>

      {/* QR Code Performance */}
      <div className="mt-6 sm:mt-8 bg-card rounded-xl border border-(--color-border) p-4 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 sm:mb-6">
          <h3 className="text-base sm:text-lg font-semibold text-foreground">QR Code Performance</h3>
          <Link href="/recruiter/qr-codes">
            <Button variant="outline" size="sm" className="text-xs sm:text-sm">
              Manage QR Codes
            </Button>
          </Link>
        </div>

        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-3">
          {[
            { code: "QR-001", location: "Mall Event", scans: 45, conversions: 32 },
            { code: "QR-002", location: "Job Fair", scans: 78, conversions: 56 },
            { code: "QR-003", location: "University", scans: 23, conversions: 18 },
          ].map((qr) => (
            <div key={qr.code} className="p-3 sm:p-4 rounded-lg bg-muted/30">
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <span className="font-medium text-foreground text-sm sm:text-base">{qr.code}</span>
                <QrCode className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mb-2">{qr.location}</p>
              <div className="flex justify-between text-xs sm:text-sm">
                <div>
                  <span className="text-muted-foreground">Scans: </span>
                  <span className="font-medium text-foreground">{qr.scans}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Converted: </span>
                  <span className="font-medium text-green-600">{qr.conversions}</span>
                </div>
              </div>
              <div className="mt-2 h-1.5 sm:h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full"
                  style={{ width: `${(qr.conversions / qr.scans) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </ProtectedDashboard>
  );
}
