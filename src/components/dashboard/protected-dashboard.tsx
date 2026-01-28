"use client";

import { LoadingSpinner } from "@/components/ui";
import { useAuth, type UserRole } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DashboardLayout } from "./dashboard-layout";

interface ProtectedDashboardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

export function ProtectedDashboard({ children, allowedRoles }: ProtectedDashboardProps) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [hasAccess, setHasAccess] = useState(false);

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

      setHasAccess(true);
    }
  }, [isLoading, isAuthenticated, user, allowedRoles, router]);

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
      role={user.role}
      userName={user.name}
      userEmail={user.email}
    >
      {children}
    </DashboardLayout>
  );
}
