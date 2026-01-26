"use client";

import { Button } from "@/components/ui";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import {
    BarChart3,
    Calendar,
    ChevronDown,
    Home,
    LogOut,
    Menu,
    MessageSquare,
    QrCode,
    Settings,
    Sparkles,
    Users,
    X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import * as React from "react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  role: "admin" | "interviewer" | "recruiter";
  userName?: string;
  userEmail?: string;
}

const roleNavItems: Record<string, NavItem[]> = {
  admin: [
    { label: "Dashboard", href: "/admin", icon: Home },
    { label: "Candidates", href: "/admin/candidates", icon: Users },
    { label: "Interviews", href: "/admin/interviews", icon: Calendar },
    { label: "Communications", href: "/admin/communications", icon: MessageSquare },
    { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
    { label: "Settings", href: "/admin/settings", icon: Settings },
  ],
  interviewer: [
    { label: "Dashboard", href: "/interviewer", icon: Home },
    { label: "My Sessions", href: "/interviewer/sessions", icon: Calendar },
    { label: "Candidate Briefs", href: "/interviewer/briefs", icon: Users },
    { label: "Availability", href: "/interviewer/availability", icon: Calendar },
  ],
  recruiter: [
    { label: "Dashboard", href: "/recruiter", icon: Home },
    { label: "QR Codes", href: "/recruiter/qr-codes", icon: QrCode },
    { label: "My Candidates", href: "/recruiter/candidates", icon: Users },
    { label: "Communications", href: "/recruiter/communications", icon: MessageSquare },
  ],
};

const roleLabels: Record<string, string> = {
  admin: "Administrator",
  interviewer: "Interviewer",
  recruiter: "Recruiter",
};

export function DashboardLayout({
  children,
  role,
  userName = "User",
  userEmail = "user@example.com",
}: DashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [userMenuOpen, setUserMenuOpen] = React.useState(false);

  const navItems = roleNavItems[role] || [];

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/auth/login");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 bg-card border-r border-(--color-border) transform transition-transform duration-300 ease-in-out lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-(--color-border)">
          <Link href="/" className="flex items-center gap-2">
            <div className="p-1.5 bg-primary rounded-lg">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold text-foreground">Salesworks</span>
          </Link>
          <button
            className="lg:hidden text-muted-foreground hover:text-foreground"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Role Badge */}
        <div className="px-6 py-4">
          <div className="px-3 py-2 rounded-lg bg-primary/10 text-primary text-sm font-medium">
            {roleLabels[role]}
          </div>
        </div>

        {/* Navigation */}
        <nav className="px-4 py-2 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
                {item.badge && (
                  <span className="ml-auto bg-destructive text-destructive-foreground text-xs px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-(--color-border)">
          <div className="relative">
            <button
              className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-foreground truncate">{userName}</p>
                <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
              </div>
              <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", userMenuOpen && "rotate-180")} />
            </button>

            {userMenuOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-card border border-(--color-border) rounded-lg shadow-lg overflow-hidden">
                <button
                  className="w-full flex items-center gap-2 px-4 py-3 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-72">
        {/* Header */}
        <header className="sticky top-0 z-30 h-16 bg-card/80 backdrop-blur-sm border-b border-(--color-border)">
          <div className="h-full px-4 flex items-center justify-between">
            <button
              className="lg:hidden p-2 text-muted-foreground hover:text-foreground"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>

            <div className="flex-1 lg:flex-none" />

            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm">
                Need Help?
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
