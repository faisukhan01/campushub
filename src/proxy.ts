import { jwtVerify } from "jose"
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

const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET!)

/**
 * Resolve the auth token for a request.
 *
 * Priority:
 *  1. `Authorization: Bearer <tab-jwt>` header  ← per-tab, set by fetch-interceptor.ts
 *  2. next-auth session cookie                   ← shared, legacy / fallback
 *
 * Using the Authorization header as the primary source means each browser tab
 * carries its own identity regardless of what other tabs have signed into.
 */
async function resolveToken(request: NextRequest) {
  const authHeader = request.headers.get("Authorization")

  if (authHeader?.startsWith("Bearer ")) {
    try {
      const jwt = authHeader.slice(7)
      const { payload } = await jwtVerify(jwt, secret)
      // Normalise to match the shape getToken() returns
      return {
        userId: payload.userId as string,
        role: payload.role as string,
        email: payload.email as string,
        name: payload.name as string,
        instituteId: (payload.instituteId ?? null) as string | null,
        branchId: (payload.branchId ?? null) as string | null,
        classLevel: (payload.classLevel ?? null) as string | null,
        section: (payload.section ?? null) as string | null,
      }
    } catch {
      // JWT invalid or expired — fall through to cookie
    }
  }

  // Fall back to NextAuth session cookie (backward-compat for any old sessions)
  const cookieToken = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })
  if (!cookieToken) return null

  return {
    userId: cookieToken.userId as string,
    role: cookieToken.role as string,
    email: (cookieToken.email ?? "") as string,
    name: (cookieToken.name ?? "") as string,
    instituteId: (cookieToken.instituteId ?? null) as string | null,
    branchId: (cookieToken.branchId ?? null) as string | null,
    classLevel: (cookieToken.classLevel ?? null) as string | null,
    section: (cookieToken.section ?? null) as string | null,
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Always let NextAuth handle its own routes (including our new /api/auth/tab-login)
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next()
  }

  // Super Admin page route protection
  if (pathname.startsWith("/superadmin")) {
    const token = await resolveToken(request)
    const clientIP =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown"
    if (token?.role === "SuperAdmin") {
      console.log(
        `[SUPER ADMIN ACCESS] GRANTED - Authorized access by SuperAdmin ${token.userId} from ${clientIP}`
      )
    }
    // Always let the /superadmin page load — it renders its own sign-in form
    return NextResponse.next()
  }

  // Every other /api route requires a valid session
  if (pathname.startsWith("/api/")) {
    try {
      const token = await resolveToken(request)

      if (!token) {
        return NextResponse.json(
          { error: "Unauthorized — please sign in" },
          { status: 401 }
        )
      }

      const { role, userId, instituteId, branchId } = token

      // Block non-SuperAdmins from Super Admin routes
      if (SUPERADMIN_ONLY.some((r) => pathname.startsWith(r))) {
        if (role !== "SuperAdmin") {
          console.log(
            `[API ACCESS] BLOCKED - User ${userId} (${role}) attempted to access SuperAdmin API: ${pathname}`
          )
          return NextResponse.json(
            { error: "Forbidden — Super Admin access required" },
            { status: 403 }
          )
        }
      }

      // Block Students/Teachers from institute-level management routes
      if (INSTITUTE_LEVEL.some((r) => pathname.startsWith(r))) {
        if (!["SuperAdmin", "InstituteAdmin", "BranchAdmin"].includes(role)) {
          console.log(
            `[API ACCESS] BLOCKED - User ${userId} (${role}) attempted to access Institute-level API: ${pathname}`
          )
          return NextResponse.json(
            { error: "Forbidden — insufficient permissions" },
            { status: 403 }
          )
        }
      }

      // Block Students/Teachers from branch-level management routes
      if (BRANCH_LEVEL.some((r) => pathname.startsWith(r))) {
        if (!["SuperAdmin", "InstituteAdmin", "BranchAdmin"].includes(role)) {
          console.log(
            `[API ACCESS] BLOCKED - User ${userId} (${role}) attempted to access Branch-level API: ${pathname}`
          )
          return NextResponse.json(
            { error: "Forbidden — insufficient permissions" },
            { status: 403 }
          )
        }
      }

      // Attach user context headers for API route handlers
      const requestHeaders = new Headers(request.headers)
      requestHeaders.set("x-user-id", userId)
      requestHeaders.set("x-user-role", role)
      requestHeaders.set("x-user-institute-id", instituteId ?? "")
      requestHeaders.set("x-user-branch-id", branchId ?? "")

      return NextResponse.next({
        request: { headers: requestHeaders },
      })
    } catch (error) {
      console.error("[API ACCESS] Error in proxy:", error)
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      )
    }
  }

  return NextResponse.next()
}
