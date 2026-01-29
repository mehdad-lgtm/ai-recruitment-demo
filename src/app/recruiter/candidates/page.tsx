"use client";

import { ProtectedDashboard } from "@/components/dashboard";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
    ChevronLeft,
    ChevronRight,
    Eye,
    Filter,
    Mail,
    MessageSquare,
    Phone,
    Search,
    User,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// Mock data - replace with real API calls
const mockCandidates = [
  {
    id: "c-001",
    name: "John Doe",
    phone: "+65 9123 4567",
    email: "john.doe@email.com",
    status: "intake_completed",
    source: "QR-001",
    registeredAt: "2026-01-28T10:30:00Z",
    language: "English",
  },
  {
    id: "c-002",
    name: "Sarah Smith",
    phone: "+65 9234 5678",
    email: "sarah.smith@email.com",
    status: "pending_screening",
    source: "QR-002",
    registeredAt: "2026-01-27T14:20:00Z",
    language: "English",
  },
  {
    id: "c-003",
    name: "Mike Johnson",
    phone: "+65 9345 6789",
    email: "mike.johnson@email.com",
    status: "interview_scheduled",
    source: "QR-001",
    registeredAt: "2026-01-26T09:15:00Z",
    language: "Chinese",
  },
  {
    id: "c-004",
    name: "Emily Brown",
    phone: "+65 9456 7890",
    email: "emily.brown@email.com",
    status: "interview_completed",
    source: "QR-003",
    registeredAt: "2026-01-25T16:45:00Z",
    language: "English",
  },
  {
    id: "c-005",
    name: "David Chen",
    phone: "+65 9567 8901",
    email: "david.chen@email.com",
    status: "rejected",
    source: "QR-002",
    registeredAt: "2026-01-24T11:00:00Z",
    language: "Chinese",
  },
];

const statusColors: Record<string, string> = {
  intake_completed: "bg-blue-500/10 text-blue-600",
  pending_screening: "bg-yellow-500/10 text-yellow-600",
  interview_scheduled: "bg-purple-500/10 text-purple-600",
  interview_completed: "bg-green-500/10 text-green-600",
  rejected: "bg-red-500/10 text-red-600",
};

const statusLabels: Record<string, string> = {
  intake_completed: "Intake Done",
  pending_screening: "Pending Screening",
  interview_scheduled: "Interview Set",
  interview_completed: "Completed",
  rejected: "Rejected",
};

export default function CandidatesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredCandidates = mockCandidates.filter((candidate) => {
    const matchesSearch =
      candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.phone.includes(searchQuery);
    const matchesStatus =
      statusFilter === "all" || candidate.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <ProtectedDashboard allowedRoles={["admin", "recruiter"]}>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">My Candidates</h1>
        <p className="text-muted-foreground mt-1">
          View and manage all candidates you&apos;ve registered.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-2 sm:gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 mb-6 sm:mb-8">
        {Object.entries(statusLabels).map(([key, label]) => {
          const count = mockCandidates.filter((c) => c.status === key).length;
          return (
            <button
              key={key}
              onClick={() => setStatusFilter(key === statusFilter ? "all" : key)}
              className={cn(
                "bg-card rounded-xl border border-border p-2 sm:p-4 text-left transition-all hover:shadow-md",
                statusFilter === key && "ring-2 ring-primary"
              )}
            >
              <p className="text-xs sm:text-sm text-muted-foreground truncate">{label}</p>
              <p className="text-xl sm:text-2xl font-bold text-foreground">{count}</p>
            </button>
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search candidates..."
            className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button
          variant={statusFilter !== "all" ? "default" : "outline"}
          onClick={() => setStatusFilter("all")}
          size="sm"
          className="text-xs sm:text-sm shrink-0"
        >
          <Filter className="h-4 w-4 mr-1 sm:mr-2" />
          {statusFilter === "all" ? "All Statuses" : statusLabels[statusFilter]}
        </Button>
      </div>

      {/* Candidates List */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <ScrollArea className="w-full">
          <table className="w-full min-w-[800px]">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-4 sm:px-6 py-3 text-xs sm:text-sm font-medium text-muted-foreground">
                  Candidate
                </th>
                <th className="text-left px-4 sm:px-6 py-3 text-xs sm:text-sm font-medium text-muted-foreground">
                  Contact
                </th>
                <th className="text-left px-4 sm:px-6 py-3 text-xs sm:text-sm font-medium text-muted-foreground">
                  Source
                </th>
                <th className="text-left px-4 sm:px-6 py-3 text-xs sm:text-sm font-medium text-muted-foreground">
                  Registered
                </th>
                <th className="text-center px-4 sm:px-6 py-3 text-xs sm:text-sm font-medium text-muted-foreground">
                  Status
                </th>
                <th className="text-right px-4 sm:px-6 py-3 text-xs sm:text-sm font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredCandidates.map((candidate) => (
                <tr key={candidate.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 sm:px-6 py-3 sm:py-4">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-semibold text-sm sm:text-base shrink-0">
                        {candidate.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-foreground text-sm sm:text-base truncate">{candidate.name}</p>
                        <p className="text-[10px] sm:text-xs text-muted-foreground">{candidate.language}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4">
                    <div className="space-y-0.5 sm:space-y-1">
                      <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-foreground">
                        <Phone className="h-3 w-3 text-muted-foreground shrink-0" />
                        <span className="truncate">{candidate.phone}</span>
                      </div>
                      <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
                        <Mail className="h-3 w-3 shrink-0" />
                        <span className="truncate">{candidate.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-foreground">{candidate.source}</td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-muted-foreground">
                    {new Date(candidate.registeredAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4 text-center">
                    <span
                      className={cn(
                        "px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium",
                        statusColors[candidate.status]
                      )}
                    >
                      {statusLabels[candidate.status]}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/recruiter/candidates/${candidate.id}`}>
                        <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8">
                          <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        </Button>
                      </Link>
                      <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8">
                        <MessageSquare className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8">
                        <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        {filteredCandidates.length === 0 && (
          <div className="text-center py-12">
            <User className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
            <p className="text-muted-foreground">No candidates found</p>
          </div>
        )}

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 sm:px-6 py-3 sm:py-4 border-t border-border">
          <p className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
            Showing {filteredCandidates.length} of {mockCandidates.length} candidates
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled className="text-xs sm:text-sm h-8">
              <ChevronLeft className="h-4 w-4 sm:mr-1" />
              <span className="hidden sm:inline">Previous</span>
            </Button>
            <Button variant="outline" size="sm" disabled className="text-xs sm:text-sm h-8">
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="h-4 w-4 sm:ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </ProtectedDashboard>
  );
}
