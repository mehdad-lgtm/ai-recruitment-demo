"use client";

import { ProtectedDashboard } from "@/components/dashboard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
    Mail,
    MessageSquare,
    Phone,
    Search,
    User
} from "lucide-react";
import { useState } from "react";

// Mock data - replace with real API calls
const mockMessages = [
  {
    id: "m-001",
    candidateName: "John Doe",
    candidatePhone: "+65 9123 4567",
    channel: "whatsapp",
    direction: "outbound",
    content: "Hi John! Thank you for your interest. We'd like to schedule an interview with you.",
    timestamp: "2026-01-28T10:30:00Z",
    status: "delivered",
  },
  {
    id: "m-002",
    candidateName: "John Doe",
    candidatePhone: "+65 9123 4567",
    channel: "whatsapp",
    direction: "inbound",
    content: "Sure! I'm available tomorrow at 2pm.",
    timestamp: "2026-01-28T10:35:00Z",
    status: "read",
  },
  {
    id: "m-003",
    candidateName: "Sarah Smith",
    candidatePhone: "+65 9234 5678",
    channel: "voice",
    direction: "outbound",
    content: "Outbound call - 3 min 24 sec",
    timestamp: "2026-01-27T14:20:00Z",
    status: "completed",
  },
  {
    id: "m-004",
    candidateName: "Mike Johnson",
    candidatePhone: "+65 9345 6789",
    channel: "email",
    direction: "outbound",
    content: "Interview Confirmation - Your interview is scheduled for January 30th at 10:00 AM.",
    timestamp: "2026-01-26T09:15:00Z",
    status: "delivered",
  },
];

const channelIcons: Record<string, React.ReactNode> = {
  whatsapp: <MessageSquare className="h-4 w-4" />,
  voice: <Phone className="h-4 w-4" />,
  email: <Mail className="h-4 w-4" />,
};

const channelColors: Record<string, string> = {
  whatsapp: "bg-green-500/10 text-green-600",
  voice: "bg-blue-500/10 text-blue-600",
  email: "bg-purple-500/10 text-purple-600",
};

const statusColors: Record<string, string> = {
  delivered: "text-green-600",
  read: "text-blue-600",
  completed: "text-green-600",
  failed: "text-red-600",
  pending: "text-yellow-600",
};

export default function CommunicationsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [channelFilter, setChannelFilter] = useState<string>("all");
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);

  // Group messages by candidate
  const conversations = mockMessages.reduce((acc, msg) => {
    if (!acc[msg.candidatePhone]) {
      acc[msg.candidatePhone] = {
        candidateName: msg.candidateName,
        candidatePhone: msg.candidatePhone,
        messages: [],
        lastMessage: msg,
      };
    }
    acc[msg.candidatePhone].messages.push(msg);
    return acc;
  }, {} as Record<string, { candidateName: string; candidatePhone: string; messages: typeof mockMessages; lastMessage: typeof mockMessages[0] }>);

  const conversationList = Object.values(conversations);

  const filteredConversations = conversationList.filter((conv) => {
    const matchesSearch =
      conv.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.candidatePhone.includes(searchQuery);
    const matchesChannel =
      channelFilter === "all" ||
      conv.messages.some((m) => m.channel === channelFilter);
    return matchesSearch && matchesChannel;
  });

  return (
    <ProtectedDashboard allowedRoles={["admin", "recruiter"]}>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Communications</h1>
        <p className="text-muted-foreground mt-1">
          View and manage all candidate communications.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div className="bg-card rounded-xl border border-border p-3 sm:p-4">
          <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
            <div className={cn("p-1.5 sm:p-2 rounded-lg", channelColors.whatsapp)}>
              <MessageSquare className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </div>
            <span className="text-xs sm:text-sm text-muted-foreground">WhatsApp</span>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-foreground">
            {mockMessages.filter((m) => m.channel === "whatsapp").length}
          </p>
        </div>
        <div className="bg-card rounded-xl border border-border p-3 sm:p-4">
          <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
            <div className={cn("p-1.5 sm:p-2 rounded-lg", channelColors.voice)}>
              <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </div>
            <span className="text-xs sm:text-sm text-muted-foreground">Voice Calls</span>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-foreground">
            {mockMessages.filter((m) => m.channel === "voice").length}
          </p>
        </div>
        <div className="bg-card rounded-xl border border-border p-3 sm:p-4">
          <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
            <div className={cn("p-1.5 sm:p-2 rounded-lg", channelColors.email)}>
              <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </div>
            <span className="text-xs sm:text-sm text-muted-foreground">Emails</span>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-foreground">
            {mockMessages.filter((m) => m.channel === "email").length}
          </p>
        </div>
        <div className="bg-card rounded-xl border border-border p-3 sm:p-4">
          <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
            <div className="p-1.5 sm:p-2 rounded-lg bg-primary/10 text-primary">
              <User className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </div>
            <span className="text-xs sm:text-sm text-muted-foreground">Conversations</span>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-foreground">
            {conversationList.length}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Conversation List */}
        <div className={cn(
          "bg-card rounded-xl border border-border overflow-hidden",
          selectedConversation ? "hidden lg:block" : "block",
          "max-h-[400px] lg:max-h-none"
        )}>
          <div className="p-3 sm:p-4 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full pl-10 pr-4 py-2 bg-muted/50 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-2 sm:mt-3">
              {["all", "whatsapp", "voice", "email"].map((channel) => (
                <Button
                  key={channel}
                  variant={channelFilter === channel ? "default" : "outline"}
                  size="sm"
                  onClick={() => setChannelFilter(channel)}
                  className="capitalize text-xs sm:text-sm h-7 sm:h-8 px-2 sm:px-3"
                >
                  {channel === "all" ? "All" : channel}
                </Button>
              ))}
            </div>
          </div>

          <div className="divide-y divide-border max-h-[350px] lg:max-h-[500px] overflow-y-auto">
            {filteredConversations.map((conv) => (
              <button
                key={conv.candidatePhone}
                className={cn(
                  "w-full text-left p-3 sm:p-4 hover:bg-muted/50 transition-colors",
                  selectedConversation === conv.candidatePhone && "bg-muted"
                )}
                onClick={() => setSelectedConversation(conv.candidatePhone)}
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-semibold text-sm sm:text-base shrink-0">
                    {conv.candidateName.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium text-foreground truncate text-sm sm:text-base">
                        {conv.candidateName}
                      </p>
                      <span className="text-[10px] sm:text-xs text-muted-foreground shrink-0">
                        {new Date(conv.lastMessage.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground truncate">
                      {conv.lastMessage.content}
                    </p>
                  </div>
                </div>
              </button>
            ))}

            {filteredConversations.length === 0 && (
              <div className="text-center py-8 sm:py-12">
                <MessageSquare className="h-8 w-8 mx-auto text-muted-foreground/50 mb-2" />
                <p className="text-sm text-muted-foreground">No conversations found</p>
              </div>
            )}
          </div>
        </div>

        {/* Message View */}
        <div className={cn(
          "lg:col-span-2 bg-card rounded-xl border border-border overflow-hidden flex flex-col",
          !selectedConversation ? "hidden lg:flex" : "flex",
          "min-h-[400px] lg:min-h-0"
        )}>
          {selectedConversation ? (
            <>
              {/* Header */}
              <div className="p-3 sm:p-4 border-b border-border bg-muted/30">
                <div className="flex items-center gap-2 sm:gap-3">
                  <button 
                    className="lg:hidden p-1 hover:bg-muted rounded"
                    onClick={() => setSelectedConversation(null)}
                  >
                    <MessageSquare className="h-5 w-5 text-muted-foreground" />
                  </button>
                  <div className="w-9 h-9 sm:w-10 sm:h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-semibold text-sm sm:text-base shrink-0">
                    {conversations[selectedConversation]?.candidateName.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-foreground text-sm sm:text-base truncate">
                      {conversations[selectedConversation]?.candidateName}
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground truncate">
                      {selectedConversation}
                    </p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 p-3 sm:p-4 space-y-3 sm:space-y-4 max-h-[300px] sm:max-h-[400px] overflow-y-auto">
                {conversations[selectedConversation]?.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      "flex gap-2 sm:gap-3",
                      msg.direction === "outbound" && "flex-row-reverse"
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[85%] sm:max-w-[70%] rounded-lg p-2.5 sm:p-3",
                        msg.direction === "outbound"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      )}
                    >
                      <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
                        <span className={cn("p-0.5 sm:p-1 rounded", msg.direction === "outbound" ? "bg-primary-foreground/20" : channelColors[msg.channel])}>
                          {channelIcons[msg.channel]}
                        </span>
                        <span className="text-[10px] sm:text-xs opacity-80 capitalize">{msg.channel}</span>
                      </div>
                      <p className="text-xs sm:text-sm">{msg.content}</p>
                      <div className="flex items-center justify-between mt-1.5 sm:mt-2 gap-2">
                        <span className="text-[10px] sm:text-xs opacity-70">
                          {new Date(msg.timestamp).toLocaleString()}
                        </span>
                        <span className={cn("text-[10px] sm:text-xs font-medium capitalize", statusColors[msg.status])}>
                          {msg.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="p-3 sm:p-4 border-t border-border bg-muted/30">
                <div className="flex gap-1.5 sm:gap-2">
                  <Button variant="outline" className="flex-1 text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-3">
                    <MessageSquare className="h-3.5 w-3.5 sm:h-4 sm:w-4 sm:mr-1" />
                    <span className="hidden sm:inline">WhatsApp</span>
                  </Button>
                  <Button variant="outline" className="flex-1 text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-3">
                    <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4 sm:mr-1" />
                    <span className="hidden sm:inline">Call</span>
                  </Button>
                  <Button variant="outline" className="flex-1 text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-3">
                    <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4 sm:mr-1" />
                    <span className="hidden sm:inline">Email</span>
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                <p className="text-muted-foreground">Select a conversation to view messages</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedDashboard>
  );
}
