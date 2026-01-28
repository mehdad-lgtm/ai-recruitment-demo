"use client";

import { LoadingSpinner } from "@/components/ui";
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
        router.push("/auth/login");
        return;
      }

      if (!allowedRoles.includes(user.role)) {
        // Redirect to appropriate dashboard based on role
        const roleHome: Record<UserRole, string> = {
          admin: "/admin",
          interviewer: "/interviewer",
          recruiter: "/recruiter",
        };
        router.push(roleHome[user.role] || "/dashboard");
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

  if (isLoading || !hasAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <DashboardLayout
      role={getDashboardRole()}
      userName={user.name}
      userEmail={user.email}
    >
      {children}
    </DashboardLayout>
  );
}
