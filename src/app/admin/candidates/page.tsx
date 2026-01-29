"use client";

import { ProtectedDashboard } from "@/components/dashboard";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
    Calendar,
    ChevronLeft,
    ChevronRight,
    Download,
    Eye,
    Filter,
    Mail,
    MessageSquare,
    MoreHorizontal,
    Phone,
    Plus,
    Search,
    Trash,
    Upload,
    User,
    UserCheck,
    UserPlus,
    Users
} from "lucide-react";
import { useState } from "react";

// Mock data - replace with real API calls
const mockCandidates = [
  {
    id: "c-001",
    name: "John Doe",
    email: "john.doe@email.com",
    phone: "+65 9123 4567",
    position: "Software Developer",
    status: "interviewed",
    stage: "Interview Completed",
    source: "QR-001 (Mall Event)",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    lastActivity: new Date(Date.now() - 3 * 60 * 60 * 1000),
    interviewer: "Jane Smith",
    rating: 4,
    tags: ["Technical", "Remote-Ready"],
  },
  {
    id: "c-002",
    name: "Sarah Smith",
    email: "sarah.smith@email.com",
    phone: "+65 9234 5678",
    position: "Product Manager",
    status: "scheduled",
    stage: "Interview Scheduled",
    source: "JobStreet",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    lastActivity: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    interviewer: "Michael Lee",
    rating: null,
    tags: ["Senior", "Leadership"],
  },
  {
    id: "c-003",
    name: "Mike Johnson",
    email: "mike.johnson@email.com",
    phone: "+65 9345 6789",
    position: "Sales Executive",
    status: "new",
    stage: "AI Chat",
    source: "QR-002 (Job Fair)",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    lastActivity: new Date(Date.now() - 30 * 60 * 1000),
    interviewer: null,
    rating: null,
    tags: ["Fresh Graduate"],
  },
  {
    id: "c-004",
    name: "Emily Chen",
    email: "emily.chen@email.com",
    phone: "+65 9456 7890",
    position: "UX Designer",
    status: "hired",
    stage: "Offer Accepted",
    source: "LinkedIn",
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    lastActivity: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    interviewer: "Jane Smith",
    rating: 5,
    tags: ["Design", "UI/UX"],
  },
  {
    id: "c-005",
    name: "David Wong",
    email: "david.wong@email.com",
    phone: "+65 9567 8901",
    position: "Data Analyst",
    status: "rejected",
    stage: "Rejected",
    source: "Indeed",
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    lastActivity: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    interviewer: "Michael Lee",
    rating: 2,
    tags: ["Data"],
  },
  {
    id: "c-006",
    name: "Lisa Tan",
    email: "lisa.tan@email.com",
    phone: "+65 9678 9012",
    position: "Marketing Manager",
    status: "screening",
    stage: "Step-Two Form",
    source: "QR-003 (University)",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    lastActivity: new Date(Date.now() - 6 * 60 * 60 * 1000),
    interviewer: null,
    rating: null,
    tags: ["Marketing", "Mid-Level"],
  },
];

const statusColors: Record<string, string> = {
  new: "bg-gray-500/10 text-gray-600",
  screening: "bg-yellow-500/10 text-yellow-600",
  scheduled: "bg-blue-500/10 text-blue-600",
  interviewed: "bg-purple-500/10 text-purple-600",
  hired: "bg-green-500/10 text-green-600",
  rejected: "bg-red-500/10 text-red-600",
};

const statuses = ["all", "new", "screening", "scheduled", "interviewed", "hired", "rejected"];

export default function AdminCandidatesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const filteredCandidates = mockCandidates.filter((candidate) => {
    const matchesSearch =
      candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.position.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === "all" || candidate.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleSelectAll = () => {
    if (selectedCandidates.length === filteredCandidates.length) {
      setSelectedCandidates([]);
    } else {
      setSelectedCandidates(filteredCandidates.map((c) => c.id));
    }
  };

  const handleSelectCandidate = (id: string) => {
    if (selectedCandidates.includes(id)) {
      setSelectedCandidates(selectedCandidates.filter((c) => c !== id));
    } else {
      setSelectedCandidates([...selectedCandidates, id]);
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`;
    if (diffInHours < 48) return "Yesterday";
    return date.toLocaleDateString();
  };

  // Stats
  const stats = {
    total: mockCandidates.length,
    new: mockCandidates.filter((c) => c.status === "new").length,
    active: mockCandidates.filter((c) => ["screening", "scheduled", "interviewed"].includes(c.status)).length,
    hired: mockCandidates.filter((c) => c.status === "hired").length,
  };

  return (
    <ProtectedDashboard allowedRoles={["admin"]}>
      {/* Page Header */}
      <div className="flex flex-col gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Candidates</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Manage and track all candidates in the recruitment pipeline.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" className="text-xs sm:text-sm">
            <Upload className="h-4 w-4 mr-1 sm:mr-2" />
            Import
          </Button>
          <Button variant="outline" size="sm" className="text-xs sm:text-sm">
            <Download className="h-4 w-4 mr-1 sm:mr-2" />
            Export
          </Button>
          <Button size="sm" className="text-xs sm:text-sm">
            <Plus className="h-4 w-4 mr-1 sm:mr-2" />
            <span className="hidden xs:inline">Add</span> Candidate
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <div className="bg-card rounded-xl border border-border p-3 sm:p-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg shrink-0">
              <Users className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-xl sm:text-2xl font-bold text-foreground">{stats.total}</p>
              <p className="text-xs sm:text-sm text-muted-foreground truncate">Total Candidates</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border p-3 sm:p-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 bg-blue-500/10 rounded-lg shrink-0">
              <UserPlus className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
            </div>
            <div className="min-w-0">
              <p className="text-xl sm:text-2xl font-bold text-foreground">{stats.new}</p>
              <p className="text-xs sm:text-sm text-muted-foreground truncate">New This Week</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border p-3 sm:p-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 bg-purple-500/10 rounded-lg shrink-0">
              <User className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500" />
            </div>
            <div className="min-w-0">
              <p className="text-xl sm:text-2xl font-bold text-foreground">{stats.active}</p>
              <p className="text-xs sm:text-sm text-muted-foreground truncate">Active in Pipeline</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border p-3 sm:p-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 bg-green-500/10 rounded-lg shrink-0">
              <UserCheck className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
            </div>
            <div className="min-w-0">
              <p className="text-xl sm:text-2xl font-bold text-foreground">{stats.hired}</p>
              <p className="text-xs sm:text-sm text-muted-foreground truncate">Hired</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-card rounded-xl border border-border mb-6">
        <div className="p-3 sm:p-4 space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by name, email, or position..."
                className="w-full pl-10 pr-4 py-2 bg-muted/50 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="shrink-0">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
          <ScrollArea className="w-full">
            <div className="flex items-center bg-muted rounded-lg p-1 min-w-max">
              {statuses.map((status) => (
                <button
                  key={status}
                  className={cn(
                    "px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-colors capitalize whitespace-nowrap",
                    selectedStatus === status
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  onClick={() => setSelectedStatus(status)}
                >
                  {status}
                </button>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="px-3 sm:px-4 pb-3 sm:pb-4 border-t border-border pt-3 sm:pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Source</label>
                <select className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm">
                  <option>All Sources</option>
                  <option>QR Codes</option>
                  <option>JobStreet</option>
                  <option>LinkedIn</option>
                  <option>Indeed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Position</label>
                <select className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm">
                  <option>All Positions</option>
                  <option>Software Developer</option>
                  <option>Product Manager</option>
                  <option>UX Designer</option>
                  <option>Sales Executive</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Interviewer</label>
                <select className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm">
                  <option>All Interviewers</option>
                  <option>Jane Smith</option>
                  <option>Michael Lee</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Date Range</label>
                <select className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm">
                  <option>All Time</option>
                  <option>Last 7 Days</option>
                  <option>Last 30 Days</option>
                  <option>Last 90 Days</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bulk Actions */}
      {selectedCandidates.length > 0 && (
        <div className="bg-primary/10 rounded-xl p-3 sm:p-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <span className="text-sm font-medium text-foreground">
            {selectedCandidates.length} candidate(s) selected
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" className="text-xs sm:text-sm">
              <Mail className="h-4 w-4 mr-1 sm:mr-2" />
              <span className="hidden xs:inline">Send</span> Email
            </Button>
            <Button variant="outline" size="sm" className="text-xs sm:text-sm">
              <Calendar className="h-4 w-4 mr-1 sm:mr-2" />
              <span className="hidden xs:inline">Schedule</span> Interview
            </Button>
            <Button variant="outline" size="sm" className="text-destructive hover:text-destructive text-xs sm:text-sm">
              <Trash className="h-4 w-4 mr-1 sm:mr-2" />
              Delete
            </Button>
          </div>
        </div>
      )}

      {/* Candidates Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <ScrollArea className="w-full">
          <table className="w-full min-w-[900px]">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-4 font-medium text-muted-foreground">
                <input
                  type="checkbox"
                  checked={selectedCandidates.length === filteredCandidates.length && filteredCandidates.length > 0}
                  onChange={handleSelectAll}
                  className="rounded border-border"
                />
              </th>
              <th className="text-left p-4 font-medium text-muted-foreground">Candidate</th>
              <th className="text-left p-4 font-medium text-muted-foreground">Position</th>
              <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
              <th className="text-left p-4 font-medium text-muted-foreground">Source</th>
              <th className="text-left p-4 font-medium text-muted-foreground">Interviewer</th>
              <th className="text-left p-4 font-medium text-muted-foreground">Last Activity</th>
              <th className="text-left p-4 font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredCandidates.map((candidate) => (
              <tr key={candidate.id} className="hover:bg-muted/30 transition-colors">
                <td className="p-4">
                  <input
                    type="checkbox"
                    checked={selectedCandidates.includes(candidate.id)}
                    onChange={() => handleSelectCandidate(candidate.id)}
                    className="rounded border-border"
                  />
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-semibold">
                      {candidate.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{candidate.name}</p>
                      <p className="text-sm text-muted-foreground">{candidate.email}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <p className="text-foreground">{candidate.position}</p>
                </td>
                <td className="p-4">
                  <div>
                    <span className={cn("px-2 py-1 rounded-full text-xs font-medium capitalize", statusColors[candidate.status])}>
                      {candidate.status}
                    </span>
                    <p className="text-xs text-muted-foreground mt-1">{candidate.stage}</p>
                  </div>
                </td>
                <td className="p-4">
                  <p className="text-sm text-foreground">{candidate.source}</p>
                </td>
                <td className="p-4">
                  {candidate.interviewer ? (
                    <p className="text-sm text-foreground">{candidate.interviewer}</p>
                  ) : (
                    <span className="text-sm text-muted-foreground">Not assigned</span>
                  )}
                </td>
                <td className="p-4">
                  <p className="text-sm text-muted-foreground">
                    {formatDate(candidate.lastActivity)}
                  </p>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Phone className="h-4 w-4" />
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
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        {/* Pagination */}
        <div className="p-3 sm:p-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
            Showing {filteredCandidates.length} of {mockCandidates.length} candidates
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled={currentPage === 1} className="text-xs sm:text-sm">
              <ChevronLeft className="h-4 w-4 sm:mr-1" />
              <span className="hidden sm:inline">Previous</span>
            </Button>
            <span className="px-2 sm:px-3 py-1 text-xs sm:text-sm">Page {currentPage}</span>
            <Button variant="outline" size="sm" className="text-xs sm:text-sm">
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="h-4 w-4 sm:ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </ProtectedDashboard>
  );
}
