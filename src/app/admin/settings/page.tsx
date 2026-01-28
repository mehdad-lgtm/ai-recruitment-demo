"use client";

import { ProtectedDashboard } from "@/components/dashboard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
    Bell,
    Bot,
    Calendar,
    Check,
    Clock,
    Database,
    Globe,
    Key,
    Lock,
    Mail,
    MessageSquare,
    Phone,
    Save,
    Settings,
    Shield,
    User,
    Users,
    Webhook
} from "lucide-react";
import { useState } from "react";

const settingsSections = [
  { id: "general", label: "General", icon: Settings },
  { id: "ai", label: "AI Configuration", icon: Bot },
  { id: "users", label: "Users & Roles", icon: Users },
  { id: "integrations", label: "Integrations", icon: Webhook },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
];

// Mock data
const mockUsers = [
  { id: "u-001", name: "Admin User", email: "admin@company.com", role: "admin", status: "active" },
  { id: "u-002", name: "Jane Smith", email: "jane@company.com", role: "interviewer", status: "active" },
  { id: "u-003", name: "Michael Lee", email: "michael@company.com", role: "interviewer", status: "active" },
  { id: "u-004", name: "HR Team", email: "hr@company.com", role: "recruiter", status: "active" },
  { id: "u-005", name: "Sarah Wong", email: "sarah@company.com", role: "interviewer", status: "inactive" },
];

const roleColors: Record<string, string> = {
  admin: "bg-purple-500/10 text-purple-600",
  interviewer: "bg-blue-500/10 text-blue-600",
  recruiter: "bg-green-500/10 text-green-600",
};

export default function AdminSettingsPage() {
  const [activeSection, setActiveSection] = useState("general");
  const [hasChanges, setHasChanges] = useState(false);

  // General Settings State
  const [companyName, setCompanyName] = useState("Acme Corporation");
  const [companyEmail, setCompanyEmail] = useState("hr@acme.com");
  const [timezone, setTimezone] = useState("Asia/Singapore");

  // AI Settings State
  const [aiEnabled, setAiEnabled] = useState(true);
  const [aiVoiceEnabled, setAiVoiceEnabled] = useState(true);
  const [aiLanguage, setAiLanguage] = useState("en");
  const [aiConfidenceThreshold, setAiConfidenceThreshold] = useState(0.7);
  const [aiAutoHandoff, setAiAutoHandoff] = useState(true);

  // Notification Settings State
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [slackNotifications, setSlackNotifications] = useState(true);

  const handleSave = () => {
    // API call to save settings
    setHasChanges(false);
  };

  const renderSettingsContent = () => {
    switch (activeSection) {
      case "general":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-4">Company Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Company Name</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => { setCompanyName(e.target.value); setHasChanges(true); }}
                    className="w-full max-w-md px-3 py-2 bg-muted border border-border rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Contact Email</label>
                  <input
                    type="email"
                    value={companyEmail}
                    onChange={(e) => { setCompanyEmail(e.target.value); setHasChanges(true); }}
                    className="w-full max-w-md px-3 py-2 bg-muted border border-border rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Timezone</label>
                  <select
                    value={timezone}
                    onChange={(e) => { setTimezone(e.target.value); setHasChanges(true); }}
                    className="w-full max-w-md px-3 py-2 bg-muted border border-border rounded-lg text-sm"
                  >
                    <option value="Asia/Singapore">Asia/Singapore (GMT+8)</option>
                    <option value="Asia/Tokyo">Asia/Tokyo (GMT+9)</option>
                    <option value="America/New_York">America/New_York (EST)</option>
                    <option value="Europe/London">Europe/London (GMT)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Default Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Default Interview Duration</label>
                  <select className="w-full max-w-md px-3 py-2 bg-muted border border-border rounded-lg text-sm">
                    <option value="30">30 minutes</option>
                    <option value="45">45 minutes</option>
                    <option value="60">60 minutes</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Working Hours</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="time"
                      defaultValue="09:00"
                      className="px-3 py-2 bg-muted border border-border rounded-lg text-sm"
                    />
                    <span className="text-muted-foreground">to</span>
                    <input
                      type="time"
                      defaultValue="18:00"
                      className="px-3 py-2 bg-muted border border-border rounded-lg text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "ai":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-4">AI Chat Configuration</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">Enable AI Chat</p>
                    <p className="text-sm text-muted-foreground">Allow AI to handle initial candidate conversations</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={aiEnabled}
                      onChange={(e) => { setAiEnabled(e.target.checked); setHasChanges(true); }}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">Enable AI Voice Calls</p>
                    <p className="text-sm text-muted-foreground">Allow AI to make and receive voice calls</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={aiVoiceEnabled}
                      onChange={(e) => { setAiVoiceEnabled(e.target.checked); setHasChanges(true); }}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">Auto Handoff to Human</p>
                    <p className="text-sm text-muted-foreground">Automatically transfer to human when confidence is low</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={aiAutoHandoff}
                      onChange={(e) => { setAiAutoHandoff(e.target.checked); setHasChanges(true); }}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">AI Parameters</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Primary Language</label>
                  <select
                    value={aiLanguage}
                    onChange={(e) => { setAiLanguage(e.target.value); setHasChanges(true); }}
                    className="w-full max-w-md px-3 py-2 bg-muted border border-border rounded-lg text-sm"
                  >
                    <option value="en">English</option>
                    <option value="zh">Chinese (Mandarin)</option>
                    <option value="ms">Malay</option>
                    <option value="ta">Tamil</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Confidence Threshold: {Math.round(aiConfidenceThreshold * 100)}%
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="0.95"
                    step="0.05"
                    value={aiConfidenceThreshold}
                    onChange={(e) => { setAiConfidenceThreshold(parseFloat(e.target.value)); setHasChanges(true); }}
                    className="w-full max-w-md"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Below this threshold, conversations will be flagged for human review
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Knowledge Base</h2>
              <div className="p-4 border border-dashed border-border rounded-lg text-center">
                <Database className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-foreground mb-1">Upload documents to train AI</p>
                <p className="text-xs text-muted-foreground mb-3">PDF, DOCX, or TXT files up to 10MB</p>
                <Button variant="outline" size="sm">Upload Documents</Button>
              </div>
            </div>
          </div>
        );

      case "users":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Team Members</h2>
              <Button size="sm">
                <User className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </div>

            <div className="bg-muted/30 rounded-xl border border-border overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-4 font-medium text-muted-foreground">User</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Role</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {mockUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-semibold text-sm">
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{user.name}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={cn("px-2 py-1 rounded-full text-xs font-medium capitalize", roleColors[user.role])}>
                          {user.role}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={cn(
                          "px-2 py-1 rounded-full text-xs font-medium capitalize",
                          user.status === "active" ? "bg-green-500/10 text-green-600" : "bg-gray-500/10 text-gray-600"
                        )}>
                          {user.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">Edit</Button>
                          <Button variant="ghost" size="sm" className="text-destructive">Remove</Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case "integrations":
        return (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-foreground">Connected Services</h2>

            <div className="grid grid-cols-2 gap-4">
              {[
                { name: "WhatsApp Business", icon: MessageSquare, status: "connected", color: "green" },
                { name: "Google Calendar", icon: Calendar, status: "connected", color: "blue" },
                { name: "Twilio (Voice)", icon: Phone, status: "connected", color: "red" },
                { name: "Slack", icon: Bell, status: "disconnected", color: "purple" },
                { name: "Gmail / SMTP", icon: Mail, status: "connected", color: "orange" },
                { name: "JobStreet API", icon: Globe, status: "disconnected", color: "blue" },
              ].map((integration) => {
                const Icon = integration.icon;
                return (
                  <div
                    key={integration.name}
                    className="flex items-center justify-between p-4 bg-card rounded-xl border border-border"
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "p-2 rounded-lg",
                        integration.color === "green" && "bg-green-500/10",
                        integration.color === "blue" && "bg-blue-500/10",
                        integration.color === "red" && "bg-red-500/10",
                        integration.color === "purple" && "bg-purple-500/10",
                        integration.color === "orange" && "bg-orange-500/10"
                      )}>
                        <Icon className={cn(
                          "h-5 w-5",
                          integration.color === "green" && "text-green-500",
                          integration.color === "blue" && "text-blue-500",
                          integration.color === "red" && "text-red-500",
                          integration.color === "purple" && "text-purple-500",
                          integration.color === "orange" && "text-orange-500"
                        )} />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{integration.name}</p>
                        <p className={cn(
                          "text-sm capitalize",
                          integration.status === "connected" ? "text-green-600" : "text-muted-foreground"
                        )}>
                          {integration.status === "connected" && <Check className="h-3 w-3 inline-block mr-1" />}
                          {integration.status}
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      {integration.status === "connected" ? "Configure" : "Connect"}
                    </Button>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-border pt-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">API Keys</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Key className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-foreground">Production API Key</p>
                      <p className="text-sm text-muted-foreground font-mono">sk-prod-****-****-****-7f3d</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Copy</Button>
                    <Button variant="outline" size="sm">Regenerate</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "notifications":
        return (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-foreground">Notification Preferences</h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-foreground">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive updates via email</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={emailNotifications}
                    onChange={(e) => { setEmailNotifications(e.target.checked); setHasChanges(true); }}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-foreground">SMS Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive updates via SMS</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={smsNotifications}
                    onChange={(e) => { setSmsNotifications(e.target.checked); setHasChanges(true); }}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Bell className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-foreground">Slack Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive updates in Slack</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={slackNotifications}
                    onChange={(e) => { setSlackNotifications(e.target.checked); setHasChanges(true); }}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>

            <div className="border-t border-border pt-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Notification Events</h2>
              <div className="space-y-3">
                {[
                  "New candidate registered",
                  "Interview scheduled",
                  "Interview completed",
                  "AI handoff requested",
                  "Candidate hired",
                ].map((event) => (
                  <div key={event} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                    <input type="checkbox" defaultChecked className="rounded border-border" />
                    <span className="text-sm text-foreground">{event}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case "security":
        return (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-foreground">Security Settings</h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Lock className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-foreground">Two-Factor Authentication</p>
                    <p className="text-sm text-muted-foreground">Require 2FA for all admin users</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-foreground">Session Timeout</p>
                    <p className="text-sm text-muted-foreground">Auto-logout after inactivity</p>
                  </div>
                </div>
                <select className="px-3 py-1.5 bg-muted border border-border rounded-lg text-sm">
                  <option>30 minutes</option>
                  <option>1 hour</option>
                  <option>4 hours</option>
                  <option>Never</option>
                </select>
              </div>
            </div>

            <div className="border-t border-border pt-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Password Policy</h2>
              <div className="space-y-3">
                {[
                  "Minimum 8 characters",
                  "Require uppercase letters",
                  "Require numbers",
                  "Require special characters",
                  "Password expiry (90 days)",
                ].map((policy) => (
                  <div key={policy} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                    <input type="checkbox" defaultChecked className="rounded border-border" />
                    <span className="text-sm text-foreground">{policy}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-border pt-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Data & Privacy</h2>
              <div className="space-y-3">
                <Button variant="outline">
                  <Database className="h-4 w-4 mr-2" />
                  Export All Data
                </Button>
                <Button variant="outline" className="text-destructive ml-2">
                  Delete All Candidate Data
                </Button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <ProtectedDashboard allowedRoles={["admin"]}>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Configure your recruitment platform settings.
          </p>
        </div>
        {hasChanges && (
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        )}
      </div>

      <div className="grid grid-cols-4 gap-6">
        {/* Settings Navigation */}
        <div className="bg-card rounded-xl border border-border overflow-hidden h-fit">
          <div className="p-4 border-b border-border">
            <h2 className="font-semibold text-foreground">Settings</h2>
          </div>
          <div className="p-2">
            {settingsSections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-left",
                    activeSection === section.id
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                  onClick={() => setActiveSection(section.id)}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{section.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Settings Content */}
        <div className="col-span-3 bg-card rounded-xl border border-border p-6">
          {renderSettingsContent()}
        </div>
      </div>
    </ProtectedDashboard>
  );
}
