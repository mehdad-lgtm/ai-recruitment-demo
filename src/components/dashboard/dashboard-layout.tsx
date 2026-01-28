"use client";

import { ThemeToggle } from "@/components/ui";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
  BarChart3,
  Bell,
  Calendar,
  ChevronDown,
  Home,
  LogOut,
  Menu,
  MessageSquare,
  QrCode,
  Search,
  Settings,
  Sparkles,
  Users,
  X
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
  
  // Close sidebar on route change on mobile
  React.useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const navItems = roleNavItems[role] || [];

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-50 via-slate-100 to-slate-200 dark:from-slate-900 dark:via-slate-950 dark:to-black text-foreground font-sans selection:bg-primary/20">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 bg-card/80 backdrop-blur-xl border-r border-border/50 shadow-2xl lg:shadow-none transform transition-transform duration-300 ease-in-out lg:translate-x-0 h-full flex flex-col",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-border/50">
          <Link href="/" className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-tr from-primary to-indigo-600 rounded-xl shadow-lg shadow-primary/25">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              Salesworks
            </span>
          </Link>
          <button
            className="lg:hidden text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Role Badge */}
        <div className="px-6 py-4">
          <div className="px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider inline-block">
            {roleLabels[role]}
          </div>
        </div>

        {/* Navigation */}
        <nav className="px-4 py-2 space-y-1 flex-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                )}
              >
                <Icon className={cn("h-5 w-5 transition-transform group-hover:scale-110", isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground")} />
                {item.label}
                {item.badge && (
                  <span className="ml-auto bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-full shadow-sm">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-border/50 bg-muted/30">
          <div className="relative">
            <button
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-background transition-colors border border-transparent hover:border-border/50 hover:shadow-sm"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-indigo-500 flex items-center justify-center text-primary-foreground font-bold shadow-md">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 text-left min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{userName}</p>
                <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
              </div>
              <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform duration-200", userMenuOpen && "rotate-180")} />
            </button>

            <AnimatePresence>
              {userMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute bottom-full left-0 right-0 mb-2 bg-popover/90 backdrop-blur-xl border border-border/50 rounded-xl shadow-xl overflow-hidden z-50"
                >
                  <button
                    className="w-full flex items-center gap-2 px-4 py-3 text-sm text-destructive hover:bg-destructive/10 transition-colors font-medium"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-72 flex flex-col min-h-screen transition-all duration-300">
        {/* Header */}
        <header className="sticky top-0 z-30 h-16 bg-background/80 backdrop-blur-xl border-b border-border/50 supports-[backdrop-filter]:bg-background/60">
          <div className="h-full px-4 lg:px-8 flex items-center justify-between max-w-7xl mx-auto w-full">
            <div className="flex items-center gap-4">
              <button
                className="lg:hidden p-2 -ml-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-6 w-6" />
              </button>
              
              {/* Search Bar (Optional) */}
              <div className="hidden md:flex items-center relative">
                <Search className="absolute left-3 w-4 h-4 text-muted-foreground" />
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="pl-9 pr-4 py-1.5 text-sm bg-muted/50 border-none rounded-full focus:ring-2 focus:ring-primary/20 focus:bg-background transition-all outline-none w-64"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <ThemeToggle />
              <button className="p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted transition-colors relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-background"></span>
              </button>
              <div className="text-sm font-medium hidden sm:block text-muted-foreground">
                {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-8 max-w-7xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
