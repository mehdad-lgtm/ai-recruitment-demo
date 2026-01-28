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
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className={cn("p-2 rounded-lg", channelColors.whatsapp)}>
              <MessageSquare className="h-4 w-4" />
            </div>
            <span className="text-sm text-muted-foreground">WhatsApp</span>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {mockMessages.filter((m) => m.channel === "whatsapp").length}
          </p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className={cn("p-2 rounded-lg", channelColors.voice)}>
              <Phone className="h-4 w-4" />
            </div>
            <span className="text-sm text-muted-foreground">Voice Calls</span>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {mockMessages.filter((m) => m.channel === "voice").length}
          </p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className={cn("p-2 rounded-lg", channelColors.email)}>
              <Mail className="h-4 w-4" />
            </div>
            <span className="text-sm text-muted-foreground">Emails</span>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {mockMessages.filter((m) => m.channel === "email").length}
          </p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <User className="h-4 w-4" />
            </div>
            <span className="text-sm text-muted-foreground">Conversations</span>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {conversationList.length}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-3 gap-6">
        {/* Conversation List */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="p-4 border-b border-border">
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
            <div className="flex gap-2 mt-3">
              {["all", "whatsapp", "voice", "email"].map((channel) => (
                <Button
                  key={channel}
                  variant={channelFilter === channel ? "default" : "outline"}
                  size="sm"
                  onClick={() => setChannelFilter(channel)}
                  className="capitalize"
                >
                  {channel === "all" ? "All" : channel}
                </Button>
              ))}
            </div>
          </div>

          <div className="divide-y divide-border max-h-[500px] overflow-y-auto">
            {filteredConversations.map((conv) => (
              <button
                key={conv.candidatePhone}
                className={cn(
                  "w-full text-left p-4 hover:bg-muted/50 transition-colors",
                  selectedConversation === conv.candidatePhone && "bg-muted"
                )}
                onClick={() => setSelectedConversation(conv.candidatePhone)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-semibold">
                    {conv.candidateName.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-foreground truncate">
                        {conv.candidateName}
                      </p>
                      <span className="text-xs text-muted-foreground">
                        {new Date(conv.lastMessage.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {conv.lastMessage.content}
                    </p>
                  </div>
                </div>
              </button>
            ))}

            {filteredConversations.length === 0 && (
              <div className="text-center py-12">
                <MessageSquare className="h-8 w-8 mx-auto text-muted-foreground/50 mb-2" />
                <p className="text-sm text-muted-foreground">No conversations found</p>
              </div>
            )}
          </div>
        </div>

        {/* Message View */}
        <div className="col-span-2 bg-card rounded-xl border border-border overflow-hidden flex flex-col">
          {selectedConversation ? (
            <>
              {/* Header */}
              <div className="p-4 border-b border-border bg-muted/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-semibold">
                    {conversations[selectedConversation]?.candidateName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      {conversations[selectedConversation]?.candidateName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {selectedConversation}
                    </p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 p-4 space-y-4 max-h-[400px] overflow-y-auto">
                {conversations[selectedConversation]?.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      "flex gap-3",
                      msg.direction === "outbound" && "flex-row-reverse"
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[70%] rounded-lg p-3",
                        msg.direction === "outbound"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      )}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className={cn("p-1 rounded", msg.direction === "outbound" ? "bg-primary-foreground/20" : channelColors[msg.channel])}>
                          {channelIcons[msg.channel]}
                        </span>
                        <span className="text-xs opacity-80 capitalize">{msg.channel}</span>
                      </div>
                      <p className="text-sm">{msg.content}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs opacity-70">
                          {new Date(msg.timestamp).toLocaleString()}
                        </span>
                        <span className={cn("text-xs font-medium capitalize", statusColors[msg.status])}>
                          {msg.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="p-4 border-t border-border bg-muted/30">
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Send WhatsApp
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Phone className="h-4 w-4 mr-2" />
                    Make Call
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Mail className="h-4 w-4 mr-2" />
                    Send Email
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
