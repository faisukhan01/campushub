import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { getToken } from "next-auth/jwt"
import { db } from "@/lib/db"
import { verifySuperAdminAccess, logSecurityEvent } from "@/lib/security"

export async function GET(request: NextRequest) {
  try {
    // Enhanced security check
    const securityCheck = await verifySuperAdminAccess(request);
    if (!securityCheck.authorized) {
      logSecurityEvent({
        type: 'access_denied',
        email: securityCheck.email,
        ip: request.headers.get('x-forwarded-for') || 'unknown',
        details: `Attempted to access GET /api/institutes - ${securityCheck.error}`,
      });
      return NextResponse.json({ error: securityCheck.error }, { status: 403 });
    }

    // Fetch institutes with branch count
    const institutes = await db.institute.findMany({
      select: {
        id: true,
        name: true,
        code: true,
        email: true,
        phone: true,
        website: true,
        address: true,
        createdAt: true,
        _count: { 
          select: { 
            branches: true,
          } 
        },
      },
      orderBy: { createdAt: "desc" },
    })

    // Fetch all users for these institutes in one query
    const instituteIds = institutes.map(i => i.id)
    // Guard against empty `in` which causes a LibSQL/SQLite error
    const users = instituteIds.length === 0 ? [] : await db.user.findMany({
      where: {
        instituteId: { in: instituteIds },
        isActive: true,
        role: { in: ["InstituteAdmin", "Student", "Teacher"] },
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        instituteId: true,
        plainPassword: true,
      },
    })

    // Process data efficiently
    const data = institutes.map((inst) => {
      const instUsers = users.filter(u => u.instituteId === inst.id)
      const admin = instUsers.find((u) => u.role === "InstituteAdmin") ?? null
      const studentCount = instUsers.filter((u) => u.role === "Student").length
      const teacherCount = instUsers.filter((u) => u.role === "Teacher").length

      return {
        id: inst.id,
        name: inst.name,
        code: inst.code,
        email: inst.email,
        phone: inst.phone,
        website: inst.website,
        address: inst.address,
        createdAt: inst.createdAt,
        branchCount: inst._count.branches,
        studentCount,
        teacherCount,
        admin: admin ? { id: admin.id, name: admin.name, email: admin.email, plainPassword: admin.plainPassword } : null,
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
    // Enhanced security check
    const securityCheck = await verifySuperAdminAccess(request);
    if (!securityCheck.authorized) {
      logSecurityEvent({
        type: 'access_denied',
        email: securityCheck.email,
        ip: request.headers.get('x-forwarded-for') || 'unknown',
        details: `Attempted to access POST /api/institutes - ${securityCheck.error}`,
      });
      return NextResponse.json({ error: securityCheck.error }, { status: 403 });
    }

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
        plainPassword: adminPassword,
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

export async function DELETE(request: NextRequest) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    if (token.role !== "SuperAdmin") return NextResponse.json({ error: "Forbidden" }, { status: 403 })

    const body = await request.json()
    const { id } = body
    if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 })

    // Check if institute exists
    const institute = await db.institute.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            branches: true,
          },
        },
      },
    })

    if (!institute) {
      return NextResponse.json({ error: "Institute not found" }, { status: 404 })
    }

    // Delete all related data in transaction
    await db.$transaction(async (tx) => {
      // Delete all users associated with this institute
      await tx.user.deleteMany({
        where: { instituteId: id },
      })

      // Delete all branches and their related data
      const branches = await tx.branch.findMany({
        where: { instituteId: id },
        select: { id: true },
      })

      for (const branch of branches) {
        // Delete branch-related data
        await tx.user.deleteMany({
          where: { branchId: branch.id },
        })
      }

      // Delete all branches
      await tx.branch.deleteMany({
        where: { instituteId: id },
      })

      // Finally delete the institute
      await tx.institute.delete({
        where: { id },
      })
    })

    return NextResponse.json({ success: true, message: "Institute deleted successfully" })
  } catch (error) {
    console.error("DELETE /api/institutes error:", error)
    return NextResponse.json({ error: "Failed to delete institute" }, { status: 500 })
  }
}
