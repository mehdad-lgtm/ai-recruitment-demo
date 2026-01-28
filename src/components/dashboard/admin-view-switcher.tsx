"use client";

import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Briefcase, ChevronDown, Eye, Shield, UserCheck } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import * as React from "react";

type ViewRole = "admin" | "recruiter" | "interviewer";

interface RoleView {
  role: ViewRole;
  label: string;
  icon: React.ElementType;
  color: string;
  basePath: string;
}

const roleViews: RoleView[] = [
  { 
    role: "admin", 
    label: "Admin View", 
    icon: Shield, 
    color: "text-purple-500 dark:text-purple-400",
    basePath: "/admin"
  },
  { 
    role: "recruiter", 
    label: "Recruiter View", 
    icon: Briefcase, 
    color: "text-blue-500 dark:text-blue-400",
    basePath: "/recruiter"
  },
  { 
    role: "interviewer", 
    label: "Interviewer View", 
    icon: UserCheck, 
    color: "text-green-500 dark:text-green-400",
    basePath: "/interviewer"
  },
];

export function AdminViewSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(false);
  
  // Determine current view based on pathname
  const currentView = React.useMemo(() => {
    if (pathname.startsWith("/admin")) return roleViews[0];
    if (pathname.startsWith("/recruiter")) return roleViews[1];
    if (pathname.startsWith("/interviewer")) return roleViews[2];
    return roleViews[0]; // default to admin
  }, [pathname]);

  const handleViewSwitch = (view: RoleView) => {
    setIsOpen(false);
    // Navigate only to base path, not trying to preserve subroutes
    router.push(view.basePath);
  };

  const CurrentIcon = currentView.icon;

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="gap-2 border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-200"
      >
        <Eye className="h-4 w-4 text-muted-foreground" />
        <span className="hidden sm:inline font-medium">{currentView.label}</span>
        <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", isOpen && "rotate-180")} />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-2 w-64 z-50 bg-card/95 backdrop-blur-xl border border-border/50 rounded-xl shadow-2xl overflow-hidden"
            >
              <div className="p-2 space-y-1">
                <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Switch View
                </div>
                {roleViews.map((view) => {
                  const Icon = view.icon;
                  const isActive = currentView.role === view.role;
                  
                  return (
                    <button
                      key={view.role}
                      onClick={() => handleViewSwitch(view)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                        isActive
                          ? "bg-primary/10 text-primary font-medium"
                          : "hover:bg-muted/50 text-foreground"
                      )}
                    >
                      <div className={cn(
                        "p-2 rounded-lg transition-colors",
                        isActive ? "bg-primary/20" : "bg-muted/50"
                      )}>
                        <Icon className={cn("h-4 w-4", isActive ? "text-primary" : view.color)} />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="text-sm font-medium">{view.label}</div>
                        <div className="text-xs text-muted-foreground">
                          View as {view.role}
                        </div>
                      </div>
                      {isActive && (
                        <motion.div
                          layoutId="active-view"
                          className="w-2 h-2 rounded-full bg-primary"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
              
              <div className="border-t border-border/50 p-3 bg-muted/30">
                <p className="text-xs text-muted-foreground text-center">
                  Preview how different roles see the platform
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
