"use client";

import { ProtectedDashboard } from "@/components/dashboard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
    Briefcase,
    Calendar,
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

  const filteredBriefs = mockBriefs.filter(
    (brief) =>
      brief.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      brief.position.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentBrief = mockBriefs.find((b) => b.id === selectedBrief);

  return (
    <ProtectedDashboard allowedRoles={["admin", "interviewer"]}>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Candidate Briefs</h1>
        <p className="text-muted-foreground mt-1">
          Review candidate information before your interviews.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Brief List */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="p-4 border-b border-border">
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

          <div className="divide-y divide-border max-h-[600px] overflow-y-auto">
            {filteredBriefs.map((brief) => (
              <button
                key={brief.id}
                className={cn(
                  "w-full text-left p-4 hover:bg-muted/50 transition-colors",
                  selectedBrief === brief.id && "bg-muted"
                )}
                onClick={() => setSelectedBrief(brief.id)}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-semibold shrink-0">
                    {brief.candidateName.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-foreground truncate">
                        {brief.candidateName}
                      </p>
                      <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium capitalize", statusColors[brief.status])}>
                        {brief.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
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
              <div className="text-center py-12">
                <FileText className="h-8 w-8 mx-auto text-muted-foreground/50 mb-2" />
                <p className="text-sm text-muted-foreground">No briefs found</p>
              </div>
            )}
          </div>
        </div>

        {/* Brief Detail */}
        <div className="col-span-2">
          {currentBrief ? (
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              {/* Header */}
              <div className="p-6 border-b border-border bg-muted/30">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary text-2xl font-semibold">
                      {currentBrief.candidateName.charAt(0)}
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-foreground">
                        {currentBrief.candidateName}
                      </h2>
                      <p className="text-muted-foreground">{currentBrief.position}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {currentBrief.interviewDate.toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {currentBrief.interviewTime}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className={cn("px-3 py-1 rounded-full text-sm font-medium capitalize", statusColors[currentBrief.status])}>
                    {currentBrief.status}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Contact & Basic Info */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-3">Contact Information</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-foreground">{currentBrief.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-foreground">{currentBrief.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <span className="text-foreground">{currentBrief.language}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-foreground">{currentBrief.location}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-3">Professional Info</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                        <span className="text-foreground">{currentBrief.currentStatus}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-foreground">{currentBrief.experience} experience</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">Expected:</span>
                        <span className="text-foreground">{currentBrief.expectedSalary}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">Availability:</span>
                        <span className="text-foreground">{currentBrief.availability}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Source */}
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-2">Source</h3>
                  <p className="text-sm text-muted-foreground">{currentBrief.source}</p>
                </div>

                {/* Notes */}
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-2">AI-Generated Summary</h3>
                  <p className="text-sm text-foreground bg-muted/50 p-4 rounded-lg">
                    {currentBrief.notes}
                  </p>
                </div>

                {/* Chat Insights */}
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Key Insights from Chat
                  </h3>
                  <ul className="space-y-2">
                    {currentBrief.chatInsights.map((insight, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <ChevronRight className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <span className="text-foreground">{insight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Actions */}
              <div className="p-6 border-t border-border bg-muted/30">
                <div className="flex gap-2">
                  <Button className="flex-1">
                    Start Interview
                  </Button>
                  <Button variant="outline">
                    <Phone className="h-4 w-4 mr-2" />
                    Call
                  </Button>
                  <Button variant="outline">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Message
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-card rounded-xl border border-border h-full flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                <p className="text-muted-foreground">Select a candidate to view their brief</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedDashboard>
  );
}
