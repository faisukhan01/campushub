import { getToken } from "next-auth/jwt"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// These routes require SuperAdmin role
const SUPERADMIN_ONLY = ["/api/institutes", "/api/subscriptions"]

// These routes require at minimum InstituteAdmin role
const INSTITUTE_LEVEL = ["/api/branches"]

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Always let NextAuth handle its own routes
  if (pathname.startsWith("/api/auth")) return NextResponse.next()

  // Every other /api route requires a valid session
  if (pathname.startsWith("/api/")) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized — please sign in" },
        { status: 401 }
      )
    }

    const role = token.role as string

    // Block non-SuperAdmins from Super Admin routes
    if (SUPERADMIN_ONLY.some((r) => pathname.startsWith(r))) {
      if (role !== "SuperAdmin") {
        return NextResponse.json(
          { error: "Forbidden — Super Admin access required" },
          { status: 403 }
        )
      }
    }

    // Block Students/Teachers from institute-level management routes
    if (INSTITUTE_LEVEL.some((r) => pathname.startsWith(r))) {
      if (!["SuperAdmin", "InstituteAdmin"].includes(role)) {
        return NextResponse.json(
          { error: "Forbidden — insufficient permissions" },
          { status: 403 }
        )
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/api/:path*"],
}
