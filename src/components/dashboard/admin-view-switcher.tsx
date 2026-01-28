"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Briefcase, Shield, UserCheck } from "lucide-react";
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
  
  // Determine current view based on pathname
  const currentView = React.useMemo(() => {
    if (pathname.startsWith("/admin")) return roleViews[0];
    if (pathname.startsWith("/recruiter")) return roleViews[1];
    if (pathname.startsWith("/interviewer")) return roleViews[2];
    return roleViews[0]; // default to admin
  }, [pathname]);

  const handleViewSwitch = (view: RoleView) => {
    // Navigate only to base path, not trying to preserve subroutes
    router.push(view.basePath);
  };

  return (
    <div className="grid grid-cols-3 gap-1 p-1 bg-muted/50 rounded-xl relative">
      {roleViews.map((view) => {
        const Icon = view.icon;
        const isActive = currentView.role === view.role;
        
        return (
          <button
            key={view.role}
            onClick={() => handleViewSwitch(view)}
            className={cn(
              "relative flex flex-col items-center justify-center gap-1.5 py-2.5 rounded-lg transition-colors duration-300 z-10",
              isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {isActive && (
              <motion.div
                layoutId="active-pill"
                className="absolute inset-0 bg-background shadow-sm rounded-lg z-[-1]"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <Icon className={cn(
              "h-4 w-4 transition-transform duration-300",
              isActive ? "scale-110" : "scale-100 group-hover:scale-110"
            )} />
            <span className="text-[10px] font-bold uppercase tracking-widest leading-none">
              {view.role}
            </span>
          </button>
        );
      })}
    </div>
  );
}
