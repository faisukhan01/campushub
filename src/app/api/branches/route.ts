import { NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import bcrypt from "bcryptjs"
import { db } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { searchParams } = request.nextUrl
    const instituteId = searchParams.get("instituteId")

    const where: Record<string, unknown> = {}

    if (token.role === "SuperAdmin") {
      if (instituteId) where.instituteId = instituteId
    } else if (token.role === "InstituteAdmin") {
      where.instituteId = token.instituteId
    } else if (token.role === "BranchAdmin") {
      where.id = token.branchId
    } else {
      // Teachers and Students can also see their branch
      if (token.branchId) where.id = token.branchId
      else return NextResponse.json({ success: true, data: [] })
    }

    const branches = await db.branch.findMany({
      where,
      include: {
        institute: { select: { id: true, name: true, code: true } },
        _count: { select: { courses: true } },
      },
      orderBy: { createdAt: "desc" },
    })

    const branchIds = branches.map((b) => b.id)

    const userCounts = await db.user.groupBy({
      by: ["branchId", "role"],
      where: { branchId: { in: branchIds }, isActive: true },
      _count: { id: true },
    })

    const admins = await db.user.findMany({
      where: { role: "BranchAdmin", branchId: { in: branchIds }, isActive: true },
      select: { id: true, name: true, email: true, branchId: true },
    })

    const data = branches.map((branch) => {
      const bu = userCounts.filter((u) => u.branchId === branch.id)
      const admin = admins.find((a) => a.branchId === branch.id) ?? null
      return {
        ...branch,
        courseCount: branch._count.courses,
        studentCount: bu.find((u) => u.role === "Student")?._count.id ?? 0,
        teacherCount: bu.find((u) => u.role === "Teacher")?._count.id ?? 0,
        admin,
      }
    })

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("GET /api/branches error:", error)
    return NextResponse.json({ error: "Failed to fetch branches" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    if (!["SuperAdmin", "InstituteAdmin"].includes(token.role as string)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const { name, code, phone, email, address, instituteId, adminName, adminEmail, adminPassword } = body

    if (!name || !code || !adminName || !adminEmail || !adminPassword) {
      return NextResponse.json(
        { error: "Branch name, code and admin name/email/password are all required" },
        { status: 400 }
      )
    }

    if (adminPassword.length < 8) {
      return NextResponse.json({ error: "Admin password must be at least 8 characters" }, { status: 400 })
    }

    let resolvedInstituteId: string
    if (token.role === "SuperAdmin") {
      if (!instituteId) return NextResponse.json({ error: "instituteId is required" }, { status: 400 })
      resolvedInstituteId = instituteId
    } else {
      resolvedInstituteId = token.instituteId as string
    }

    const existingUser = await db.user.findUnique({ where: { email: adminEmail } })
    if (existingUser) {
      return NextResponse.json({ error: "A user with this admin email already exists" }, { status: 409 })
    }

    const passwordHash = await bcrypt.hash(adminPassword, 12)

    const branch = await db.branch.create({
      data: {
        name,
        code: code.toUpperCase(),
        email: email || null,
        phone: phone || null,
        address: address || null,
        instituteId: resolvedInstituteId,
      },
    })

    const admin = await db.user.create({
      data: {
        name: adminName,
        email: adminEmail,
        passwordHash,
        role: "BranchAdmin",
        instituteId: resolvedInstituteId,
        branchId: branch.id,
        isActive: true,
      },
      select: { id: true, name: true, email: true, role: true },
    })

    return NextResponse.json({ success: true, data: { branch, admin } }, { status: 201 })
  } catch (error) {
    console.error("POST /api/branches error:", error)
    return NextResponse.json({ error: "Failed to create branch" }, { status: 500 })
  }
}
