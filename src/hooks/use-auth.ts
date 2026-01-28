"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export type UserRole = "admin" | "interviewer" | "recruiter";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  image?: string | null;
  phone?: string | null;
  department?: string | null;
  isActive?: boolean;
}

interface UseAuthResult {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signOut: () => Promise<void>;
}

export function useAuth(): UseAuthResult {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const session = await authClient.getSession();
        
        if (session.data?.user) {
          const userData = session.data.user as any;
          setUser({
            id: userData.id || "",
            name: userData.name || "User",
            email: userData.email || "",
            role: (userData.role as UserRole) || "recruiter",
            image: userData.image || null,
            phone: userData.phone || null,
            department: userData.department || null,
            isActive: userData.isActive ?? true,
          });
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Failed to load user:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    loadUser();
  }, []);

  const signOut = async () => {
    try {
      await authClient.signOut();
      setUser(null);
      router.push("/");
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    signOut,
  };
}

// Hook to require a specific role
export function useRequireRole(allowedRoles: UserRole[]) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/");
        return;
      }

      if (user && !allowedRoles.includes(user.role)) {
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

  const hasAccess = !isLoading && isAuthenticated && user && allowedRoles.includes(user.role);

  return { user, isLoading, hasAccess };
}
