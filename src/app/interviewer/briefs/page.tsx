"use client";

import { ProtectedDashboard } from "@/components/dashboard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
    Briefcase,
    Calendar,
    ChevronLeft,
    ChevronRight,
    Clock,
    FileText,
    Globe,
    Mail,
    MapPin,
    MessageSquare,
    Phone,
    Search
} from "lucide-react";
import { useState } from "react";

// Mock data - replace with real API calls
const mockBriefs = [
  {
    id: "b-001",
    candidateName: "John Doe",
    position: "Software Developer",
    interviewDate: new Date(),
    interviewTime: "09:00 AM",
    phone: "+65 9123 4567",
    email: "john.doe@email.com",
    language: "English",
    location: "Singapore",
    source: "QR-001 (Mall Event)",
    currentStatus: "Active Job Seeker",
    experience: "5 years",
    expectedSalary: "$5,000 - $6,000",
    availability: "Immediate",
    notes: "Candidate showed strong interest during initial chat. Has experience in React and Node.js. Currently working at a startup but looking for more stable opportunities.",
    chatInsights: [
      "Asked about work-life balance",
      "Interested in remote work options",
      "Has family commitments (needs flexible hours)",
    ],
    status: "upcoming",
  },
  {
    id: "b-002",
    candidateName: "Sarah Smith",
    position: "Product Manager",
    interviewDate: new Date(),
    interviewTime: "11:00 AM",
    phone: "+65 9234 5678",
    email: "sarah.smith@email.com",
    language: "English",
    location: "Singapore",
    source: "JobStreet",
    currentStatus: "Employed - Looking",
    experience: "8 years",
    expectedSalary: "$8,000 - $10,000",
    availability: "1 month notice",
    notes: "Strong CV with Fortune 500 experience. Currently at regional PM role. Looking for leadership position.",
    chatInsights: [
      "Very detail-oriented in questions",
      "Asked about company culture",
      "Wants career growth opportunities",
    ],
    status: "upcoming",
  },
  {
    id: "b-003",
    candidateName: "Mike Johnson",
    position: "Sales Executive",
    interviewDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
    interviewTime: "10:00 AM",
    phone: "+65 9345 6789",
    email: "mike.johnson@email.com",
    language: "Chinese",
    location: "Malaysia",
    source: "QR-002 (Job Fair)",
    currentStatus: "Fresh Graduate",
    experience: "1 year internship",
    expectedSalary: "$3,000 - $3,500",
    availability: "Immediate",
    notes: "Enthusiastic candidate from recent job fair. Good communication skills despite limited experience.",
    chatInsights: [
      "Very eager to learn",
      "Asked about training programs",
      "Willing to relocate",
    ],
    status: "scheduled",
  },
];

const statusColors: Record<string, string> = {
  upcoming: "bg-blue-500/10 text-blue-600",
  scheduled: "bg-purple-500/10 text-purple-600",
  completed: "bg-green-500/10 text-green-600",
};

export default function BriefsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrief, setSelectedBrief] = useState<string | null>(mockBriefs[0]?.id || null);
  const [showDetail, setShowDetail] = useState(false);

  const filteredBriefs = mockBriefs.filter(
    (brief) =>
      brief.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      brief.position.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentBrief = mockBriefs.find((b) => b.id === selectedBrief);

  return (
    <ProtectedDashboard allowedRoles={["admin", "interviewer"]}>
      {/* Page Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Candidate Briefs</h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-1">
          Review candidate information before your interviews.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 h-full min-h-[600px]">
        {/* Brief List */}
        <div className="bg-card rounded-xl border border-border overflow-hidden flex flex-col h-full">
          <div className="p-3 sm:p-4 border-b border-border shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search candidates..."
                className="w-full pl-10 pr-4 py-2 bg-muted/50 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="divide-y divide-border flex-1 overflow-y-auto">
            {filteredBriefs.map((brief) => (
              <button
                key={brief.id}
                className={cn(
                  "w-full text-left p-3 sm:p-4 hover:bg-muted/50 transition-colors",
                  selectedBrief === brief.id && "bg-muted"
                )}
                onClick={() => {
                  setSelectedBrief(brief.id);
                  // Only show slide-in on mobile
                  if (window.innerWidth < 1024) {
                    setShowDetail(true);
                  }
                }}
              >
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-semibold text-sm sm:text-base shrink-0">
                    {brief.candidateName.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium text-foreground truncate text-sm sm:text-base">
                        {brief.candidateName}
                      </p>
                      <span className={cn("px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium capitalize shrink-0", statusColors[brief.status])}>
                        {brief.status}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground truncate">
                      {brief.position}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{brief.interviewDate.toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{brief.interviewTime}</span>
                    </div>
                  </div>
                </div>
              </button>
            ))}

            {filteredBriefs.length === 0 && (
              <div className="text-center py-8 sm:py-12">
                <FileText className="h-8 w-8 mx-auto text-muted-foreground/50 mb-2" />
                <p className="text-sm text-muted-foreground">No briefs found</p>
              </div>
            )}
          </div>
        </div>

        {/* Animated Brief Detail - Mobile Only */}
        <AnimatePresence>
          {showDetail && currentBrief && (
            <motion.div
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-0 z-50 bg-background lg:hidden"
            >
              <div className="bg-card rounded-xl border border-border overflow-hidden w-full h-full flex flex-col">
                {/* Header with back button */}
                <div className="p-4 sm:p-6 border-b border-border bg-muted/30 shrink-0">
                  <div className="flex items-center gap-3 mb-4">
                    <button
                      onClick={() => setShowDetail(false)}
                      className="p-2 hover:bg-muted rounded-lg transition-colors"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <h2 className="text-lg font-semibold text-foreground">Candidate Details</h2>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary text-xl sm:text-2xl font-semibold shrink-0">
                      {currentBrief.candidateName.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg sm:text-xl font-semibold text-foreground truncate">
                        {currentBrief.candidateName}
                      </h3>
                      <p className="text-sm sm:text-base text-muted-foreground truncate">{currentBrief.position}</p>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-1 sm:mt-2 text-xs sm:text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          {currentBrief.interviewDate.toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          {currentBrief.interviewTime}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3">
                    <span className={cn("px-3 py-1 rounded-full text-sm font-medium capitalize", statusColors[currentBrief.status])}>
                      {currentBrief.status}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
                  {/* Contact & Basic Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <h3 className="text-xs sm:text-sm font-semibold text-foreground mb-2 sm:mb-3">Contact Information</h3>
                      <div className="space-y-1.5 sm:space-y-2">
                        <div className="flex items-center gap-2 text-xs sm:text-sm">
                          <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground shrink-0" />
                          <span className="text-foreground truncate">{currentBrief.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs sm:text-sm">
                          <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground shrink-0" />
                          <span className="text-foreground truncate">{currentBrief.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs sm:text-sm">
                          <Globe className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground shrink-0" />
                          <span className="text-foreground">{currentBrief.language}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs sm:text-sm">
                          <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground shrink-0" />
                          <span className="text-foreground">{currentBrief.location}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xs sm:text-sm font-semibold text-foreground mb-2 sm:mb-3">Professional Info</h3>
                      <div className="space-y-1.5 sm:space-y-2">
                        <div className="flex items-center gap-2 text-xs sm:text-sm">
                          <Briefcase className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground shrink-0" />
                          <span className="text-foreground truncate">{currentBrief.currentStatus}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs sm:text-sm">
                          <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground shrink-0" />
                          <span className="text-foreground">{currentBrief.experience} experience</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs sm:text-sm">
                          <span className="text-muted-foreground">Expected:</span>
                          <span className="text-foreground truncate">{currentBrief.expectedSalary}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs sm:text-sm">
                          <span className="text-muted-foreground">Availability:</span>
                          <span className="text-foreground">{currentBrief.availability}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Source */}
                  <div>
                    <h3 className="text-xs sm:text-sm font-semibold text-foreground mb-1.5 sm:mb-2">Source</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">{currentBrief.source}</p>
                  </div>

                  {/* Notes */}
                  <div>
                    <h3 className="text-xs sm:text-sm font-semibold text-foreground mb-1.5 sm:mb-2">AI-Generated Summary</h3>
                    <p className="text-xs sm:text-sm text-foreground bg-muted/50 p-3 sm:p-4 rounded-lg">
                      {currentBrief.notes}
                    </p>
                  </div>

                  {/* Chat Insights */}
                  <div>
                    <h3 className="text-xs sm:text-sm font-semibold text-foreground mb-1.5 sm:mb-2 flex items-center gap-2">
                      <MessageSquare className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      Key Insights from Chat
                    </h3>
                    <ul className="space-y-1.5 sm:space-y-2">
                      {currentBrief.chatInsights.map((insight, index) => (
                        <li key={index} className="flex items-start gap-2 text-xs sm:text-sm">
                          <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary shrink-0 mt-0.5" />
                          <span className="text-foreground">{insight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Actions */}
                <div className="p-4 sm:p-6 border-t border-border bg-muted/30 shrink-0">
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <Button className="flex-1 text-xs sm:text-sm">
                      Start Interview
                    </Button>
                    <Button variant="outline" className="text-xs sm:text-sm">
                      <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4 sm:mr-1" />
                      <span className="hidden sm:inline">Call</span>
                    </Button>
                    <Button variant="outline" className="text-xs sm:text-sm">
                      <MessageSquare className="h-3.5 w-3.5 sm:h-4 sm:w-4 sm:mr-1" />
                      <span className="hidden sm:inline">Message</span>
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Desktop Detail View */}
        <div className="hidden lg:block lg:col-span-2 h-full">
          {currentBrief ? (
            <div className="bg-card rounded-xl border border-border overflow-hidden w-full flex flex-col h-full">
              {/* Header */}
              <div className="p-4 sm:p-6 border-b border-border bg-muted/30 shrink-0">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary text-xl sm:text-2xl font-semibold shrink-0">
                      {currentBrief.candidateName.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h2 className="text-lg sm:text-xl font-semibold text-foreground truncate">
                        {currentBrief.candidateName}
                      </h2>
                      <p className="text-sm sm:text-base text-muted-foreground truncate">{currentBrief.position}</p>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-1 sm:mt-2 text-xs sm:text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          {currentBrief.interviewDate.toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          {currentBrief.interviewTime}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className={cn("px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium capitalize shrink-0", statusColors[currentBrief.status])}>
                    {currentBrief.status}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
                {/* Contact & Basic Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <h3 className="text-xs sm:text-sm font-semibold text-foreground mb-2 sm:mb-3">Contact Information</h3>
                    <div className="space-y-1.5 sm:space-y-2">
                      <div className="flex items-center gap-2 text-xs sm:text-sm">
                        <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground shrink-0" />
                        <span className="text-foreground truncate">{currentBrief.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs sm:text-sm">
                        <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground shrink-0" />
                        <span className="text-foreground truncate">{currentBrief.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs sm:text-sm">
                        <Globe className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground shrink-0" />
                        <span className="text-foreground">{currentBrief.language}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs sm:text-sm">
                        <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground shrink-0" />
                        <span className="text-foreground">{currentBrief.location}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-semibold text-foreground mb-2 sm:mb-3">Professional Info</h3>
                    <div className="space-y-1.5 sm:space-y-2">
                      <div className="flex items-center gap-2 text-xs sm:text-sm">
                        <Briefcase className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground shrink-0" />
                        <span className="text-foreground truncate">{currentBrief.currentStatus}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs sm:text-sm">
                        <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground shrink-0" />
                        <span className="text-foreground">{currentBrief.experience} experience</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs sm:text-sm">
                        <span className="text-muted-foreground">Expected:</span>
                        <span className="text-foreground truncate">{currentBrief.expectedSalary}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs sm:text-sm">
                        <span className="text-muted-foreground">Availability:</span>
                        <span className="text-foreground">{currentBrief.availability}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Source */}
                <div>
                  <h3 className="text-xs sm:text-sm font-semibold text-foreground mb-1.5 sm:mb-2">Source</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">{currentBrief.source}</p>
                </div>

                {/* Notes */}
                <div>
                  <h3 className="text-xs sm:text-sm font-semibold text-foreground mb-1.5 sm:mb-2">AI-Generated Summary</h3>
                  <p className="text-xs sm:text-sm text-foreground bg-muted/50 p-3 sm:p-4 rounded-lg">
                    {currentBrief.notes}
                  </p>
                </div>

                {/* Chat Insights */}
                <div>
                  <h3 className="text-xs sm:text-sm font-semibold text-foreground mb-1.5 sm:mb-2 flex items-center gap-2">
                    <MessageSquare className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    Key Insights from Chat
                  </h3>
                  <ul className="space-y-1.5 sm:space-y-2">
                    {currentBrief.chatInsights.map((insight, index) => (
                      <li key={index} className="flex items-start gap-2 text-xs sm:text-sm">
                        <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary shrink-0 mt-0.5" />
                        <span className="text-foreground">{insight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Actions */}
              <div className="p-4 sm:p-6 border-t border-border bg-muted/30 shrink-0">
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <Button className="flex-1 text-xs sm:text-sm">
                    Start Interview
                  </Button>
                  <Button variant="outline" className="text-xs sm:text-sm">
                    <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4 sm:mr-1" />
                    <span className="hidden sm:inline">Call</span>
                  </Button>
                  <Button variant="outline" className="text-xs sm:text-sm">
                    <MessageSquare className="h-3.5 w-3.5 sm:h-4 sm:w-4 sm:mr-1" />
                    <span className="hidden sm:inline">Message</span>
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-card rounded-xl border border-border h-full flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                <p className="text-sm text-muted-foreground">Select a candidate to view their brief</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedDashboard>
  );
}
