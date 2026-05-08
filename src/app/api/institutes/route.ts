import { NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import bcrypt from "bcryptjs"
import { db } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    if (token.role !== "SuperAdmin") return NextResponse.json({ error: "Forbidden" }, { status: 403 })

    const institutes = await db.institute.findMany({
      include: {
        _count: { select: { branches: true } },
      },
      orderBy: { createdAt: "desc" },
    })

    const userCounts = await db.user.groupBy({
      by: ["instituteId", "role"],
      where: { instituteId: { not: null }, isActive: true },
      _count: { id: true },
    })

    const admins = await db.user.findMany({
      where: {
        role: "InstituteAdmin",
        instituteId: { in: institutes.map((i) => i.id) },
        isActive: true,
      },
      select: { id: true, name: true, email: true, instituteId: true },
    })

    const data = institutes.map((inst) => {
      const instUsers = userCounts.filter((u) => u.instituteId === inst.id)
      const admin = admins.find((a) => a.instituteId === inst.id) ?? null
      return {
        ...inst,
        branchCount: inst._count.branches,
        studentCount: instUsers.find((u) => u.role === "Student")?._count.id ?? 0,
        teacherCount: instUsers.find((u) => u.role === "Teacher")?._count.id ?? 0,
        admin,
      }
    })

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("GET /api/institutes error:", error)
    return NextResponse.json({ error: "Failed to fetch institutes" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    if (token.role !== "SuperAdmin") return NextResponse.json({ error: "Forbidden" }, { status: 403 })

    const body = await request.json()
    const { name, code, email, phone, address, website, adminName, adminEmail, adminPassword } = body

    if (!name || !code || !email || !adminName || !adminEmail || !adminPassword) {
      return NextResponse.json(
        { error: "Institute name, code, email and admin name/email/password are all required" },
        { status: 400 }
      )
    }

    if (adminPassword.length < 8) {
      return NextResponse.json({ error: "Admin password must be at least 8 characters" }, { status: 400 })
    }

    // Validate that admin email is a personal email (not institute domain)
    const personalEmailDomains = ['gmail.com', 'outlook.com', 'hotmail.com', 'yahoo.com', 'icloud.com', 'protonmail.com', 'live.com', 'msn.com', 'aol.com']
    const emailDomain = adminEmail.toLowerCase().split('@')[1]
    if (!personalEmailDomains.includes(emailDomain)) {
      return NextResponse.json(
        { error: "Admin email must be a personal email address (e.g., @gmail.com, @outlook.com, @yahoo.com)" },
        { status: 400 }
      )
    }

    const existingInst = await db.institute.findUnique({ where: { code: code.toUpperCase() } })
    if (existingInst) {
      return NextResponse.json({ error: "An institute with this code already exists" }, { status: 409 })
    }

    const existingUser = await db.user.findUnique({ where: { email: adminEmail } })
    if (existingUser) {
      return NextResponse.json({ error: "A user with this admin email already exists" }, { status: 409 })
    }

    const passwordHash = await bcrypt.hash(adminPassword, 12)

    const institute = await db.institute.create({
      data: {
        name,
        code: code.toUpperCase(),
        email,
        phone: phone || null,
        address: address || null,
        website: website || null,
      },
    })

    const admin = await db.user.create({
      data: {
        name: adminName,
        email: adminEmail,
        passwordHash,
        role: "InstituteAdmin",
        instituteId: institute.id,
        isActive: true,
      },
      select: { id: true, name: true, email: true, role: true },
    })

    return NextResponse.json({ success: true, data: { institute, admin } }, { status: 201 })
  } catch (error) {
    console.error("POST /api/institutes error:", error)
    return NextResponse.json({ error: "Failed to create institute" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    if (token.role !== "SuperAdmin") return NextResponse.json({ error: "Forbidden" }, { status: 403 })

    const body = await request.json()
    const { id, name, email, phone, address, website } = body
    if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 })

    const updated = await db.institute.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(email && { email }),
        ...(phone !== undefined && { phone }),
        ...(address !== undefined && { address }),
        ...(website !== undefined && { website }),
      },
    })

    return NextResponse.json({ success: true, data: updated })
  } catch (error) {
    console.error("PATCH /api/institutes error:", error)
    return NextResponse.json({ error: "Failed to update institute" }, { status: 500 })
  }
}
