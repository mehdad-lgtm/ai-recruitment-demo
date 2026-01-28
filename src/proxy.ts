import { auth } from "@/lib/auth";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Define protected routes and their required roles (STRICT: one role per route)
// This is the single source of truth for role-based access control
const protectedRoutes = {
  "/admin": ["admin"],
  "/interviewer": ["interviewer"],
  "/recruiter": ["recruiter"],
};

// Public routes that don't require authentication
const publicRoutes = ["/", "/auth/login", "/auth/signup", "/intake"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the route is public
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Check if the route is an API route for auth
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // Validate session using Better Auth (safer than cookie-only)
  const sessionData = await auth.api.getSession({ headers: request.headers });

  if (!sessionData || !sessionData.session || !sessionData.user) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Enforce role-based access for protected routes
  const userRole = (sessionData.user as { role?: string }).role || "recruiter";

  // Safety fallback: redirect /dashboard to role-specific dashboard
  // This should rarely be hit since login/signup redirect directly
  if (pathname === "/dashboard" || pathname.startsWith("/dashboard/")) {
    const roleHome: Record<string, string> = {
      admin: "/admin",
      interviewer: "/interviewer",
      recruiter: "/recruiter",
    };
    const redirectUrl = new URL(roleHome[userRole] || "/recruiter", request.url);
    return NextResponse.redirect(redirectUrl);
  }

  // Find matching protected prefix if any
  const matchedPrefix = Object.keys(protectedRoutes).find((prefix) => pathname.startsWith(prefix));
  if (matchedPrefix) {
    const allowedRoles = protectedRoutes[matchedPrefix as keyof typeof protectedRoutes];
    if (!allowedRoles.includes(userRole)) {
      // Redirect to role home if accessing disallowed route
      const roleHome: Record<string, string> = {
        admin: "/admin",
        interviewer: "/interviewer",
        recruiter: "/recruiter",
      };
      const redirectUrl = new URL(roleHome[userRole] ?? "/recruiter", request.url);
      return NextResponse.redirect(redirectUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes for webhooks
     */
    "/((?!_next/static|_next/image|favicon.ico|public|api/webhooks).*)",
  ],
};
