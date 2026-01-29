"use client";

import { ProtectedDashboard } from "@/components/dashboard";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  ArrowDown,
  ArrowUp,
  BarChart3,
  Calendar,
  Download,
  MessageSquare,
  QrCode,
  TrendingUp,
  UserCheck,
  UserPlus,
  Users
} from "lucide-react";
import { useState } from "react";

// Mock data
const overviewStats = [
  {
    label: "Total Candidates",
    value: "1,234",
    change: "+12.5%",
    trend: "up",
    icon: Users,
    color: "primary",
  },
  {
    label: "Active in Pipeline",
    value: "342",
    change: "+8.2%",
    trend: "up",
    icon: UserPlus,
    color: "blue",
  },
  {
    label: "Interviews Completed",
    value: "156",
    change: "+23.1%",
    trend: "up",
    icon: UserCheck,
    color: "green",
  },
  {
    label: "Hired This Month",
    value: "28",
    change: "-5.3%",
    trend: "down",
    icon: TrendingUp,
    color: "purple",
  },
];

const conversionStats = [
  { stage: "QR Scan / Initial Contact", count: 1234, percentage: 100 },
  { stage: "AI Chat Completed", count: 892, percentage: 72.3 },
  { stage: "Step-Two Form Submitted", count: 534, percentage: 43.3 },
  { stage: "Interview Scheduled", count: 342, percentage: 27.7 },
  { stage: "Interview Completed", count: 256, percentage: 20.7 },
  { stage: "Offer Extended", count: 45, percentage: 3.6 },
  { stage: "Hired", count: 28, percentage: 2.3 },
];

const sourcePerformance = [
  { source: "QR Code - Mall Events", candidates: 456, hired: 12, conversionRate: 2.6 },
  { source: "QR Code - Job Fairs", candidates: 312, hired: 8, conversionRate: 2.6 },
  { source: "QR Code - University", candidates: 234, hired: 5, conversionRate: 2.1 },
  { source: "JobStreet", candidates: 156, hired: 2, conversionRate: 1.3 },
  { source: "LinkedIn", candidates: 76, hired: 1, conversionRate: 1.3 },
];

const interviewerPerformance = [
  { name: "Jane Smith", interviews: 45, hires: 8, satisfaction: 4.8, avgDuration: 42 },
  { name: "Michael Lee", interviews: 38, hires: 6, satisfaction: 4.5, avgDuration: 48 },
  { name: "Sarah Wong", interviews: 35, hires: 7, satisfaction: 4.7, avgDuration: 40 },
  { name: "David Chen", interviews: 28, hires: 5, satisfaction: 4.3, avgDuration: 55 },
];

const recentActivity = [
  { type: "hire", text: "John Doe was hired for Software Developer", time: "2h ago" },
  { type: "interview", text: "Sarah Smith completed interview with Jane Smith", time: "3h ago" },
  { type: "qr", text: "QR-005 generated 23 new candidates", time: "5h ago" },
  { type: "communication", text: "AI completed 45 chat sessions", time: "6h ago" },
];

const timeRanges = ["Today", "This Week", "This Month", "This Quarter", "This Year"];

export default function AdminAnalyticsPage() {
  const [selectedTimeRange, setSelectedTimeRange] = useState("This Month");
  const [showFilters, setShowFilters] = useState(false);

  return (
    <ProtectedDashboard allowedRoles={["admin"]}>
      {/* Page Header */}
      <div className="flex flex-col gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Analytics</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Track recruitment metrics and performance insights.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <ScrollArea className="w-full sm:w-auto">
            <div className="flex items-center bg-muted rounded-lg p-1 min-w-max">
              {timeRanges.slice(0, 4).map((range) => (
                <button
                  key={range}
                  className={cn(
                    "px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap",
                    selectedTimeRange === range
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  onClick={() => setSelectedTimeRange(range)}
                >
                  {range}
                </button>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
          <Button variant="outline" size="sm" className="text-xs sm:text-sm shrink-0">
            <Download className="h-4 w-4 mr-1 sm:mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6">
        {overviewStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-card rounded-xl border border-border p-3 sm:p-4">
              <div className="flex items-start justify-between">
                <div className={cn(
                  "p-1.5 sm:p-2 rounded-lg shrink-0",
                  stat.color === "primary" && "bg-primary/10",
                  stat.color === "blue" && "bg-blue-500/10",
                  stat.color === "green" && "bg-green-500/10",
                  stat.color === "purple" && "bg-purple-500/10"
                )}>
                  <Icon className={cn(
                    "h-4 w-4 sm:h-5 sm:w-5",
                    stat.color === "primary" && "text-primary",
                    stat.color === "blue" && "text-blue-500",
                    stat.color === "green" && "text-green-500",
                    stat.color === "purple" && "text-purple-500"
                  )} />
                </div>
                <div className={cn(
                  "flex items-center gap-0.5 sm:gap-1 text-xs sm:text-sm font-medium",
                  stat.trend === "up" ? "text-green-600" : "text-red-600"
                )}>
                  {stat.trend === "up" ? (
                    <ArrowUp className="h-3 w-3 sm:h-4 sm:w-4" />
                  ) : (
                    <ArrowDown className="h-3 w-3 sm:h-4 sm:w-4" />
                  )}
                  {stat.change}
                </div>
              </div>
              <p className="text-xl sm:text-2xl font-bold text-foreground mt-2 sm:mt-3">{stat.value}</p>
              <p className="text-xs sm:text-sm text-muted-foreground truncate">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
        {/* Conversion Funnel */}
        <div className="lg:col-span-2 bg-card rounded-xl border border-border overflow-hidden">
          <div className="p-3 sm:p-4 border-b border-border">
            <h2 className="text-base sm:text-lg font-semibold text-foreground">Recruitment Funnel</h2>
            <p className="text-xs sm:text-sm text-muted-foreground">Candidate journey through the pipeline</p>
          </div>
          <ScrollArea className="w-full">
            <div className="p-3 sm:p-4 space-y-2 sm:space-y-3 min-w-[400px]">
              {conversionStats.map((stage, index) => (
                <div key={stage.stage} className="flex items-center gap-2 sm:gap-4">
                  <div className="w-32 sm:w-48 text-xs sm:text-sm text-foreground truncate shrink-0">{stage.stage}</div>
                  <div className="flex-1">
                    <div className="h-6 sm:h-8 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full flex items-center justify-end pr-2 sm:pr-3"
                        style={{ width: `${stage.percentage}%` }}
                      >
                        {stage.percentage >= 20 && (
                          <span className="text-[10px] sm:text-xs text-primary-foreground font-medium">
                            {stage.count}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="w-12 sm:w-16 text-right shrink-0">
                    <span className="text-xs sm:text-sm font-medium text-foreground">{stage.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>

        {/* Recent Activity */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="p-3 sm:p-4 border-b border-border">
            <h2 className="text-base sm:text-lg font-semibold text-foreground">Recent Activity</h2>
          </div>
          <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start gap-2 sm:gap-3">
                <div className={cn(
                  "p-1.5 sm:p-2 rounded-lg shrink-0",
                  activity.type === "hire" && "bg-green-500/10",
                  activity.type === "interview" && "bg-blue-500/10",
                  activity.type === "qr" && "bg-purple-500/10",
                  activity.type === "communication" && "bg-orange-500/10"
                )}>
                  {activity.type === "hire" && <UserCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-500" />}
                  {activity.type === "interview" && <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-500" />}
                  {activity.type === "qr" && <QrCode className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-purple-500" />}
                  {activity.type === "communication" && <MessageSquare className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-orange-500" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm text-foreground">{activity.text}</p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Source Performance */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="p-3 sm:p-4 border-b border-border">
            <h2 className="text-base sm:text-lg font-semibold text-foreground">Source Performance</h2>
            <p className="text-xs sm:text-sm text-muted-foreground">Candidate sources and conversion rates</p>
          </div>
          <ScrollArea className="w-full">
            <table className="w-full min-w-[500px]">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-4 font-medium text-muted-foreground">Source</th>
                    <th className="text-right p-4 font-medium text-muted-foreground">Candidates</th>
                    <th className="text-right p-4 font-medium text-muted-foreground">Hired</th>
                    <th className="text-right p-4 font-medium text-muted-foreground">Conv. Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {sourcePerformance.map((source) => (
                    <tr key={source.source} className="hover:bg-muted/30 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {source.source.includes("QR") ? (
                            <QrCode className="h-4 w-4 text-purple-500" />
                          ) : (
                            <BarChart3 className="h-4 w-4 text-blue-500" />
                          )}
                          <span className="text-foreground">{source.source}</span>
                        </div>
                      </td>
                      <td className="p-4 text-right text-foreground">{source.candidates}</td>
                      <td className="p-4 text-right text-foreground">{source.hired}</td>
                      <td className="p-4 text-right">
                        <span className="text-green-600 font-medium">{source.conversionRate}%</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
        </div>

        {/* Interviewer Performance */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="p-3 sm:p-4 border-b border-border">
            <h2 className="text-base sm:text-lg font-semibold text-foreground">Interviewer Performance</h2>
            <p className="text-xs sm:text-sm text-muted-foreground">Interview metrics by team member</p>
          </div>
          <ScrollArea className="w-full">
            <table className="w-full min-w-[500px]">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-4 font-medium text-muted-foreground">Interviewer</th>
                    <th className="text-right p-4 font-medium text-muted-foreground">Interviews</th>
                    <th className="text-right p-4 font-medium text-muted-foreground">Hires</th>
                    <th className="text-right p-4 font-medium text-muted-foreground">Rating</th>
                  </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {interviewerPerformance.map((interviewer) => (
                  <tr key={interviewer.name} className="hover:bg-muted/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-semibold text-sm">
                          {interviewer.name.charAt(0)}
                        </div>
                        <span className="text-foreground">{interviewer.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-right text-foreground">{interviewer.interviews}</td>
                    <td className="p-4 text-right text-foreground">{interviewer.hires}</td>
                    <td className="p-4 text-right">
                      <span className="text-foreground font-medium">⭐ {interviewer.satisfaction}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      </div>

      {/* AI Performance */}
      <div className="mt-4 sm:mt-6 bg-card rounded-xl border border-border overflow-hidden">
        <div className="p-3 sm:p-4 border-b border-border">
          <h2 className="text-base sm:text-lg font-semibold text-foreground">AI Communication Performance</h2>
          <p className="text-xs sm:text-sm text-muted-foreground">Automated chat and voice interaction metrics</p>
        </div>
        <ScrollArea className="w-full">
          <div className="grid grid-cols-5 min-w-[500px]">
            <div className="p-3 sm:p-6 text-center border-r border-border">
              <p className="text-xl sm:text-3xl font-bold text-foreground">892</p>
              <p className="text-[10px] sm:text-sm text-muted-foreground mt-1">Chats Handled</p>
            </div>
            <div className="p-3 sm:p-6 text-center border-r border-border">
              <p className="text-xl sm:text-3xl font-bold text-foreground">156</p>
              <p className="text-[10px] sm:text-sm text-muted-foreground mt-1">Voice Calls</p>
            </div>
            <div className="p-3 sm:p-6 text-center border-r border-border">
              <p className="text-xl sm:text-3xl font-bold text-green-600">94.2%</p>
              <p className="text-[10px] sm:text-sm text-muted-foreground mt-1">Resolution Rate</p>
            </div>
            <div className="p-3 sm:p-6 text-center border-r border-border">
              <p className="text-xl sm:text-3xl font-bold text-foreground">2.3 min</p>
              <p className="text-[10px] sm:text-sm text-muted-foreground mt-1">Avg Response</p>
            </div>
            <div className="p-3 sm:p-6 text-center">
              <p className="text-xl sm:text-3xl font-bold text-foreground">4.7</p>
              <p className="text-[10px] sm:text-sm text-muted-foreground mt-1">Satisfaction</p>
            </div>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </ProtectedDashboard>
  );
}
