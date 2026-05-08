import { NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import bcrypt from "bcryptjs"
import { db } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { currentPassword, newPassword } = await request.json()

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "Both currentPassword and newPassword are required" }, { status: 400 })
    }

    if (newPassword.length < 8) {
      return NextResponse.json({ error: "New password must be at least 8 characters" }, { status: 400 })
    }

    const user = await db.user.findUnique({ where: { id: token.userId } })
    if (!user || !user.passwordHash) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const valid = await bcrypt.compare(currentPassword, user.passwordHash)
    if (!valid) {
      return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 })
    }

    const newHash = await bcrypt.hash(newPassword, 12)
    await db.user.update({
      where: { id: token.userId },
      data: { passwordHash: newHash },
    })

    return NextResponse.json({ success: true, message: "Password changed successfully" })
  } catch (error) {
    console.error("change-password error:", error)
    return NextResponse.json({ error: "Failed to change password" }, { status: 500 })
  }
}
