"use client";

import { useAuth, type UserRole } from "@/hooks/use-auth";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { DashboardLayout } from "./dashboard-layout";

interface ProtectedDashboardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

export function ProtectedDashboard({ children, allowedRoles }: ProtectedDashboardProps) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated || !user) {
        router.push("/");
        return;
      }

      if (!allowedRoles.includes(user.role)) {
        // Redirect to appropriate dashboard based on role
        const roleHome: Record<UserRole, string> = {
          admin: "/admin",
          interviewer: "/interviewer",
          recruiter: "/recruiter",
        };
        router.push(roleHome[user.role] || "/recruiter");
        return;
      }
    }
  }, [isLoading, isAuthenticated, user, allowedRoles, router]);

  // Derive dashboard role from current pathname (single source of truth)
  const getDashboardRole = (): UserRole => {
    if (pathname.startsWith("/admin")) return "admin";
    if (pathname.startsWith("/interviewer")) return "interviewer";
    if (pathname.startsWith("/recruiter")) return "recruiter";
    return user?.role || "recruiter";
  };

  const hasAccess = !isLoading && isAuthenticated && user && allowedRoles.includes(user.role);

  // Only show loading during initial auth check
  if (isLoading) {
    return null; // Let parent handle loading state, or show minimal UI
  }

  // Redirect if no access
  if (!hasAccess || !user) {
    return null;
  }

  return (
    <DashboardLayout
      role={getDashboardRole()}
      userName={user.name}
      userEmail={user.email}
      isAdmin={user.role === "admin"}
    >
      {children}
    </DashboardLayout>
  );
}
