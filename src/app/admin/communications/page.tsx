"use client";

import { ProtectedDashboard } from "@/components/dashboard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
    AlertCircle,
    Bot,
    Hand,
    Mail,
    MessageCircle,
    MessageSquare,
    MoreHorizontal,
    Phone,
    Search,
    Send
} from "lucide-react";
import { useState } from "react";

// Mock data - replace with real API calls
const mockConversations = [
  {
    id: "conv-001",
    candidate: {
      name: "John Doe",
      email: "john.doe@email.com",
      phone: "+65 9123 4567",
      avatar: null,
    },
    channel: "whatsapp",
    status: "ai-active",
    lastMessage: "I'm very interested in the Software Developer position. What are the next steps?",
    lastMessageTime: new Date(Date.now() - 5 * 60 * 1000),
    unreadCount: 2,
    assignedTo: null,
    stage: "AI Chat",
    sentiment: "positive",
    aiConfidence: 0.92,
  },
  {
    id: "conv-002",
    candidate: {
      name: "Sarah Smith",
      email: "sarah.smith@email.com",
      phone: "+65 9234 5678",
      avatar: null,
    },
    channel: "email",
    status: "human-takeover",
    lastMessage: "RE: Interview Confirmation - I have some concerns about the salary range discussed.",
    lastMessageTime: new Date(Date.now() - 15 * 60 * 1000),
    unreadCount: 1,
    assignedTo: "Jane HR",
    stage: "Interview Scheduled",
    sentiment: "concerned",
    aiConfidence: null,
  },
  {
    id: "conv-003",
    candidate: {
      name: "Mike Johnson",
      email: "mike.johnson@email.com",
      phone: "+65 9345 6789",
      avatar: null,
    },
    channel: "voice",
    status: "ai-active",
    lastMessage: "[Voice Call] Discussed job requirements and experience. Candidate sounds enthusiastic.",
    lastMessageTime: new Date(Date.now() - 30 * 60 * 1000),
    unreadCount: 0,
    assignedTo: null,
    stage: "Initial Screening",
    sentiment: "positive",
    aiConfidence: 0.88,
  },
  {
    id: "conv-004",
    candidate: {
      name: "Emily Chen",
      email: "emily.chen@email.com",
      phone: "+65 9456 7890",
      avatar: null,
    },
    channel: "whatsapp",
    status: "needs-attention",
    lastMessage: "I've been waiting for a response for 2 days now. Is the position still available?",
    lastMessageTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
    unreadCount: 3,
    assignedTo: null,
    stage: "Step-Two Form",
    sentiment: "frustrated",
    aiConfidence: 0.45,
  },
  {
    id: "conv-005",
    candidate: {
      name: "David Wong",
      email: "david.wong@email.com",
      phone: "+65 9567 8901",
      avatar: null,
    },
    channel: "email",
    status: "closed",
    lastMessage: "Thank you for considering my application. I understand the position has been filled.",
    lastMessageTime: new Date(Date.now() - 24 * 60 * 60 * 1000),
    unreadCount: 0,
    assignedTo: "Michael Lee",
    stage: "Rejected",
    sentiment: "neutral",
    aiConfidence: null,
  },
];

// Mock messages for selected conversation
const mockMessages = [
  {
    id: "m-001",
    sender: "candidate",
    content: "Hi! I just scanned the QR code at the job fair. I'm interested in the Software Developer position.",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    type: "text",
  },
  {
    id: "m-002",
    sender: "ai",
    content: "Hello John! 👋 Thank you for your interest in the Software Developer position at our company. I'm happy to help you learn more about this opportunity.\n\nCould you tell me a bit about your experience with software development? What programming languages and technologies are you most comfortable with?",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 + 30000),
    type: "text",
    aiMetadata: { confidence: 0.95, intent: "gather_experience" },
  },
  {
    id: "m-003",
    sender: "candidate",
    content: "I have 5 years of experience with React, Node.js, and Python. I've worked on both frontend and backend projects.",
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
    type: "text",
  },
  {
    id: "m-004",
    sender: "ai",
    content: "That's great experience, John! Your full-stack background with React and Node.js aligns well with what we're looking for.\n\nTo help us understand your fit better, could you share:\n1. What type of projects have you worked on recently?\n2. Are you currently employed or actively looking?\n3. What salary range are you expecting?",
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000 + 45000),
    type: "text",
    aiMetadata: { confidence: 0.92, intent: "qualification_questions" },
  },
  {
    id: "m-005",
    sender: "candidate",
    content: "I'm very interested in the Software Developer position. What are the next steps?",
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    type: "text",
  },
];

const channelIcons: Record<string, React.ReactNode> = {
  whatsapp: <MessageCircle className="h-4 w-4" />,
  email: <Mail className="h-4 w-4" />,
  voice: <Phone className="h-4 w-4" />,
};

const channelColors: Record<string, string> = {
  whatsapp: "bg-green-500",
  email: "bg-blue-500",
  voice: "bg-purple-500",
};

const statusColors: Record<string, string> = {
  "ai-active": "bg-blue-500/10 text-blue-600",
  "human-takeover": "bg-orange-500/10 text-orange-600",
  "needs-attention": "bg-red-500/10 text-red-600",
  closed: "bg-gray-500/10 text-gray-600",
};

const statusLabels: Record<string, string> = {
  "ai-active": "AI Active",
  "human-takeover": "Human Takeover",
  "needs-attention": "Needs Attention",
  closed: "Closed",
};

export default function AdminCommunicationsPage() {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(mockConversations[0]?.id || null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChannel, setSelectedChannel] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [messageInput, setMessageInput] = useState("");

  const filteredConversations = mockConversations.filter((conv) => {
    const matchesSearch =
      conv.candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesChannel = selectedChannel === "all" || conv.channel === selectedChannel;
    const matchesStatus = selectedStatus === "all" || conv.status === selectedStatus;
    return matchesSearch && matchesChannel && matchesStatus;
  });

  const currentConversation = mockConversations.find((c) => c.id === selectedConversation);

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInMinutes = (now.getTime() - date.getTime()) / (1000 * 60);
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${Math.floor(diffInMinutes)}m ago`;
    if (diffInMinutes < 24 * 60) return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    return date.toLocaleDateString();
  };

  // Stats
  const stats = {
    totalActive: mockConversations.filter((c) => c.status !== "closed").length,
    aiHandled: mockConversations.filter((c) => c.status === "ai-active").length,
    humanTakeover: mockConversations.filter((c) => c.status === "human-takeover").length,
    needsAttention: mockConversations.filter((c) => c.status === "needs-attention").length,
  };

  return (
    <ProtectedDashboard allowedRoles={["admin"]}>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Communications</h1>
          <p className="text-muted-foreground mt-1">
            Monitor and manage all candidate communications across channels.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <div className="bg-card rounded-xl border border-border p-3 sm:p-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg shrink-0">
              <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-xl sm:text-2xl font-bold text-foreground">{stats.totalActive}</p>
              <p className="text-xs sm:text-sm text-muted-foreground truncate">Active Chats</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border p-3 sm:p-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 bg-blue-500/10 rounded-lg shrink-0">
              <Bot className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
            </div>
            <div className="min-w-0">
              <p className="text-xl sm:text-2xl font-bold text-foreground">{stats.aiHandled}</p>
              <p className="text-xs sm:text-sm text-muted-foreground truncate">AI Handled</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border p-3 sm:p-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 bg-orange-500/10 rounded-lg shrink-0">
              <Hand className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500" />
            </div>
            <div className="min-w-0">
              <p className="text-xl sm:text-2xl font-bold text-foreground">{stats.humanTakeover}</p>
              <p className="text-xs sm:text-sm text-muted-foreground truncate">Human Takeover</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border p-3 sm:p-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 bg-red-500/10 rounded-lg shrink-0">
              <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
            </div>
            <div className="min-w-0">
              <p className="text-xl sm:text-2xl font-bold text-foreground">{stats.needsAttention}</p>
              <p className="text-xs sm:text-sm text-muted-foreground truncate">Needs Attention</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 h-auto lg:h-[calc(100vh-380px)]">
        {/* Conversation List */}
        <div className={cn(
          "bg-card rounded-xl border border-border overflow-hidden flex flex-col",
          selectedConversation ? "hidden lg:flex" : "flex",
          "max-h-[400px] lg:max-h-none"
        )}>
          {/* Filters */}
          <div className="p-3 sm:p-4 border-b border-border space-y-2 sm:space-y-3">
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
            <div className="flex gap-2">
              <select
                className="flex-1 px-2 sm:px-3 py-1.5 bg-muted border border-border rounded-lg text-xs sm:text-sm"
                value={selectedChannel}
                onChange={(e) => setSelectedChannel(e.target.value)}
              >
                <option value="all">All Channels</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="email">Email</option>
                <option value="voice">Voice</option>
              </select>
              <select
                className="flex-1 px-2 sm:px-3 py-1.5 bg-muted border border-border rounded-lg text-xs sm:text-sm"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="ai-active">AI Active</option>
                <option value="human-takeover">Human</option>
                <option value="needs-attention">Attention</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>

          {/* Conversations */}
          <div className="flex-1 overflow-y-auto divide-y divide-border">
            {filteredConversations.map((conv) => (
              <button
                key={conv.id}
                className={cn(
                  "w-full text-left p-3 sm:p-4 hover:bg-muted/50 transition-colors",
                  selectedConversation === conv.id && "bg-muted"
                )}
                onClick={() => setSelectedConversation(conv.id)}
              >
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="relative shrink-0">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-semibold text-sm sm:text-base">
                      {conv.candidate.name.charAt(0)}
                    </div>
                    <div className={cn("absolute -bottom-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center text-white", channelColors[conv.channel])}>
                      {channelIcons[conv.channel]}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium text-foreground truncate text-sm sm:text-base">
                        {conv.candidate.name}
                      </p>
                      <span className="text-[10px] sm:text-xs text-muted-foreground shrink-0">
                        {formatTime(conv.lastMessageTime)}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground truncate mt-0.5">
                      {conv.lastMessage}
                    </p>
                    <div className="flex items-center gap-1.5 sm:gap-2 mt-1.5 sm:mt-2">
                      <span className={cn("px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium", statusColors[conv.status])}>
                        {statusLabels[conv.status]}
                      </span>
                      {conv.unreadCount > 0 && (
                        <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-primary text-primary-foreground text-[10px] sm:text-xs flex items-center justify-center">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat View */}
        <div className={cn(
          "lg:col-span-2 bg-card rounded-xl border border-border overflow-hidden flex flex-col",
          !selectedConversation ? "hidden lg:flex" : "flex",
          "min-h-[400px] lg:min-h-0"
        )}>
          {currentConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-3 sm:p-4 border-b border-border bg-muted/30">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                    <button 
                      className="lg:hidden p-1 hover:bg-muted rounded"
                      onClick={() => setSelectedConversation(null)}
                    >
                      <MessageSquare className="h-5 w-5 text-muted-foreground" />
                    </button>
                    <div className="w-9 h-9 sm:w-10 sm:h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-semibold shrink-0 text-sm sm:text-base">
                      {currentConversation.candidate.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-foreground text-sm sm:text-base truncate">
                        {currentConversation.candidate.name}
                      </h3>
                      <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
                        <span className="truncate">{currentConversation.stage}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                    {currentConversation.status === "ai-active" && currentConversation.aiConfidence && (
                      <div className="hidden sm:flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 bg-blue-500/10 rounded-lg">
                        <Bot className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500" />
                        <span className="text-xs sm:text-sm text-blue-600">
                          {Math.round(currentConversation.aiConfidence * 100)}%
                        </span>
                      </div>
                    )}
                    {currentConversation.status === "ai-active" ? (
                      <Button variant="outline" size="sm" className="text-xs sm:text-sm h-8">
                        <Hand className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" />
                        <span className="hidden sm:inline">Takeover</span>
                      </Button>
                    ) : currentConversation.status === "human-takeover" ? (
                      <Button variant="outline" size="sm" className="text-xs sm:text-sm h-8">
                        <Bot className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" />
                        <span className="hidden sm:inline">Return to AI</span>
                      </Button>
                    ) : null}
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
                {mockMessages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex",
                      message.sender === "candidate" ? "justify-start" : "justify-end"
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[85%] sm:max-w-[70%] rounded-2xl p-3 sm:p-4",
                        message.sender === "candidate"
                          ? "bg-muted text-foreground rounded-tl-sm"
                          : "bg-primary text-primary-foreground rounded-tr-sm"
                      )}
                    >
                      {message.sender === "ai" && (
                        <div className="flex items-center gap-1 mb-1.5 sm:mb-2 opacity-70">
                          <Bot className="h-3 w-3" />
                          <span className="text-[10px] sm:text-xs">AI Assistant</span>
                        </div>
                      )}
                      <p className="text-xs sm:text-sm whitespace-pre-wrap">{message.content}</p>
                      <p className={cn(
                        "text-[10px] sm:text-xs mt-1.5 sm:mt-2",
                        message.sender === "candidate" ? "text-muted-foreground" : "opacity-70"
                      )}>
                        {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              {currentConversation.status !== "closed" && (
                <div className="p-3 sm:p-4 border-t border-border">
                  {currentConversation.status === "ai-active" && (
                    <div className="flex items-center gap-2 mb-2 sm:mb-3 p-2 bg-blue-500/10 rounded-lg">
                      <Bot className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500 shrink-0" />
                      <span className="text-xs sm:text-sm text-blue-600">
                        AI is handling this. Click &quot;Takeover&quot; to respond.
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder={
                        currentConversation.status === "ai-active"
                          ? "AI is handling..."
                          : "Type a message..."
                      }
                      className="flex-1 px-3 sm:px-4 py-2 bg-muted border border-border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none text-sm"
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      disabled={currentConversation.status === "ai-active"}
                    />
                    <Button disabled={currentConversation.status === "ai-active" || !messageInput.trim()} size="sm" className="h-9">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
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
