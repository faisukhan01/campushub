import { getToken } from "next-auth/jwt"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export const config = {
  matcher: [
    "/api/:path*",
    "/superadmin/:path*",
  ],
}

// These routes require SuperAdmin role
const SUPERADMIN_ONLY = ["/api/institutes", "/api/subscriptions"]

// These routes require at minimum InstituteAdmin role
const INSTITUTE_LEVEL = ["/api/branches", "/api/departments"]

// These routes require at minimum BranchAdmin role
const BRANCH_LEVEL = ["/api/batches", "/api/course-teachers"]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Always let NextAuth handle its own routes
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next()
  }

  // Super Admin page route protection
  if (pathname.startsWith("/superadmin")) {
    try {
      const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
      });

      const clientIP = request.headers.get("x-forwarded-for") || 
                       request.headers.get("x-real-ip") || 
                       "unknown";

      // If not authenticated, allow the page to show its own sign-in
      if (!token) {
        console.log(`[SUPER ADMIN ACCESS] Unauthenticated access attempt from ${clientIP}`);
        return NextResponse.next();
      }

      // If authenticated but not SuperAdmin, redirect to home and log
      if (token.role !== "SuperAdmin") {
        console.log(`[SUPER ADMIN ACCESS] BLOCKED - Unauthorized access attempt by user ${token.userId} (${token.role}) from ${clientIP}`);
        const url = request.nextUrl.clone();
        url.pathname = "/";
        return NextResponse.redirect(url);
      }

      // Successful SuperAdmin access
      console.log(`[SUPER ADMIN ACCESS] GRANTED - Authorized access by SuperAdmin ${token.userId} from ${clientIP}`);
      return NextResponse.next();
    } catch (error) {
      console.error("[SUPER ADMIN ACCESS] Error in route protection:", error);
      return NextResponse.next();
    }
  }

  // Every other /api route requires a valid session
  if (pathname.startsWith("/api/")) {
    try {
      const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })

      if (!token) {
        return NextResponse.json(
          { error: "Unauthorized — please sign in" },
          { status: 401 }
        )
      }

      const role = token.role as string
      const userId = token.userId as string

      // Block non-SuperAdmins from Super Admin routes
      if (SUPERADMIN_ONLY.some((r) => pathname.startsWith(r))) {
        if (role !== "SuperAdmin") {
          console.log(`[API ACCESS] BLOCKED - User ${userId} (${role}) attempted to access SuperAdmin API: ${pathname}`);
          return NextResponse.json(
            { error: "Forbidden — Super Admin access required" },
            { status: 403 }
          )
        }
      }

      // Block Students/Teachers from institute-level management routes
      if (INSTITUTE_LEVEL.some((r) => pathname.startsWith(r))) {
        if (!["SuperAdmin", "InstituteAdmin", "BranchAdmin"].includes(role)) {
          console.log(`[API ACCESS] BLOCKED - User ${userId} (${role}) attempted to access Institute-level API: ${pathname}`);
          return NextResponse.json(
            { error: "Forbidden — insufficient permissions" },
            { status: 403 }
          )
        }
      }

      // Block Students/Teachers from branch-level management routes
      if (BRANCH_LEVEL.some((r) => pathname.startsWith(r))) {
        if (!["SuperAdmin", "InstituteAdmin", "BranchAdmin"].includes(role)) {
          console.log(`[API ACCESS] BLOCKED - User ${userId} (${role}) attempted to access Branch-level API: ${pathname}`);
          return NextResponse.json(
            { error: "Forbidden — insufficient permissions" },
            { status: 403 }
          )
        }
      }

      // Data isolation: Add headers with user context for API routes to use
      const requestHeaders = new Headers(request.headers)
      requestHeaders.set('x-user-id', userId)
      requestHeaders.set('x-user-role', role)
      requestHeaders.set('x-user-institute-id', token.instituteId as string || '')
      requestHeaders.set('x-user-branch-id', token.branchId as string || '')

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      })
    } catch (error) {
      console.error("[API ACCESS] Error in middleware:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      )
    }
  }

  return NextResponse.next()
}
