/**
 * Tab-specific login endpoint.
 *
 * Unlike NextAuth's /api/auth/signin, this endpoint:
 *  - Verifies credentials against the database
 *  - Returns a signed JWT in the response BODY (never sets a cookie)
 *  - Multiple tabs can sign in as different users simultaneously
 *    because there is no shared cookie involved
 */
import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { SignJWT } from "jose"
import { db } from "@/lib/db"

const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET!)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { identifier, password, name } = body as {
      identifier: string
      password: string
      name?: string
    }

    if (!identifier || !password) {
      return NextResponse.json(
        { error: "Missing credentials" },
        { status: 400 }
      )
    }

    // Find user — same priority order as NextAuth's authorize()
    let user = await db.user.findUnique({
      where: { email: identifier.trim() },
    })

    if (!user) {
      user = await db.user.findFirst({
        where: { rollNumber: identifier.trim(), isActive: true },
      })
    }

    if (!user) {
      user = await db.user.findFirst({
        where: { employeeId: identifier.trim(), isActive: true },
      })
    }

    if (!user || !user.passwordHash || !user.isActive) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      )
    }

    // For Teacher / Student: verify the name matches
    if ((user.role === "Teacher" || user.role === "Student") && name) {
      if (user.name.toLowerCase().trim() !== name.toLowerCase().trim()) {
        return NextResponse.json(
          { error: "Invalid credentials" },
          { status: 401 }
        )
      }
    }

    const valid = await bcrypt.compare(password, user.passwordHash)
    if (!valid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      )
    }

    // Update last login timestamp
    await db.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    })

    // Create a per-tab JWT (returned as JSON, never set as a cookie)
    const token = await new SignJWT({
      userId: user.id,
      role: user.role,
      email: user.email ?? "",
      name: user.name,
      instituteId: user.instituteId ?? null,
      branchId: user.branchId ?? null,
      classLevel: user.classLevel ?? null,
      section: user.section ?? null,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("30d")
      .sign(secret)

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        email: user.email ?? "",
        name: user.name,
        role: user.role,
        instituteId: user.instituteId ?? null,
        branchId: user.branchId ?? null,
        classLevel: user.classLevel ?? null,
        section: user.section ?? null,
      },
    })
  } catch (error) {
    console.error("[TAB-LOGIN]", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
