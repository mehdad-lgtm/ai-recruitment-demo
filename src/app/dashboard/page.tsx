"use client";

import { LoadingSpinner } from "@/components/ui";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuthAndRedirect() {
      try {
        const session = await authClient.getSession();
        
        if (!session.data?.user) {
          router.push("/auth/login");
          return;
        }

        // Get user role from session
        const userRole = (session.data.user as { role?: string }).role || "recruiter";

        // Redirect based on role
        switch (userRole) {
          case "admin":
            router.push("/admin");
            break;
          case "interviewer":
            router.push("/interviewer");
            break;
          case "recruiter":
          default:
            router.push("/recruiter");
            break;
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        router.push("/auth/login");
      } finally {
        setLoading(false);
      }
    }

    checkAuthAndRedirect();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return null;
}
