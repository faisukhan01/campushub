import { NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import bcrypt from "bcryptjs"
import { db } from "@/lib/db"

// Who can create whom
const CREATION_PERMISSIONS: Record<string, string[]> = {
  SuperAdmin: ["InstituteAdmin"],
  InstituteAdmin: ["BranchAdmin"],
  BranchAdmin: ["Teacher", "Student"],
}

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { searchParams } = request.nextUrl
    const role = searchParams.get("role")
    const branchId = searchParams.get("branchId")
    const instituteId = searchParams.get("instituteId")

    const where: Record<string, unknown> = { isActive: true }

    // Scope results based on caller's role
    if (token.role === "InstituteAdmin" && token.instituteId) {
      where.instituteId = token.instituteId
    } else if (token.role === "BranchAdmin" && token.branchId) {
      where.branchId = token.branchId
    } else if (token.role === "SuperAdmin") {
      if (instituteId) where.instituteId = instituteId
    }

    if (role) where.role = role
    if (branchId) where.branchId = branchId

    const users = await db.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        phone: true,
        role: true,
        instituteId: true,
        branchId: true,
        employeeId: true,
        rollNumber: true,
        isActive: true,
        lastLogin: true,
        createdAt: true,
        _count: {
          select: {
            enrollments: true,
            taughtCourses: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    const roleCounts = await db.user.groupBy({
      by: ["role"],
      where: { isActive: true },
      _count: { id: true },
    })

    const roleDistribution = roleCounts.reduce(
      (acc, item) => { acc[item.role] = item._count.id; return acc },
      {} as Record<string, number>
    )

    return NextResponse.json({
      success: true,
      data: {
        users: users.map((u) => ({
          ...u,
          enrollmentsCount: u._count.enrollments,
          taughtCoursesCount: u._count.taughtCourses,
        })),
        totalUsers: users.length,
        roleDistribution,
      },
    })
  } catch (error) {
    console.error("GET /api/users error:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const callerRole = token.role as string
    const body = await request.json()
    const { name, email, password, role: targetRole, instituteId, branchId, employeeId, rollNumber, classLevel } = body

    // Validate required fields based on role
    if (!name || !password || !targetRole) {
      return NextResponse.json({ error: "name, password and role are required" }, { status: 400 })
    }

    // Role-specific validation
    if (targetRole === "Student") {
      if (!rollNumber) {
        return NextResponse.json({ error: "rollNumber is required for Student" }, { status: 400 })
      }
    } else if (targetRole === "Teacher") {
      if (!employeeId) {
        return NextResponse.json({ error: "employeeId is required for Teacher" }, { status: 400 })
      }
    } else {
      // For other roles (InstituteAdmin, BranchAdmin), email is required
      if (!email) {
        return NextResponse.json({ error: "email is required" }, { status: 400 })
      }

      // Validate that InstituteAdmin email is a personal email
      if (targetRole === "InstituteAdmin") {
        const personalEmailDomains = ['gmail.com', 'outlook.com', 'hotmail.com', 'yahoo.com', 'icloud.com', 'protonmail.com', 'live.com', 'msn.com', 'aol.com']
        const emailDomain = email.toLowerCase().split('@')[1]
        if (!personalEmailDomains.includes(emailDomain)) {
          return NextResponse.json(
            { error: "Institute Admin email must be a personal email address (e.g., @gmail.com, @outlook.com, @yahoo.com)" },
            { status: 400 }
          )
        }
      }
    }

    // Check permission: can caller create this role?
    const allowed = CREATION_PERMISSIONS[callerRole] ?? []
    if (!allowed.includes(targetRole)) {
      return NextResponse.json(
        { error: `A ${callerRole} cannot create a ${targetRole} account` },
        { status: 403 }
      )
    }

    // Scope enforcement
    let resolvedInstituteId: string | null = null
    let resolvedBranchId: string | null = null

    if (callerRole === "SuperAdmin") {
      // SuperAdmin must provide an instituteId when creating InstituteAdmin
      resolvedInstituteId = instituteId ?? null
    } else if (callerRole === "InstituteAdmin") {
      // InstituteAdmin can only create within their institute
      resolvedInstituteId = token.instituteId as string
      resolvedBranchId = branchId ?? null
    } else if (callerRole === "BranchAdmin") {
      // BranchAdmin can only create within their branch
      resolvedInstituteId = token.instituteId as string
      resolvedBranchId = token.branchId as string
    }

    // Generate system email if not provided for Teacher/Student
    let resolvedEmail = email
    if (!email) {
      if (targetRole === "Student") {
        const branchSuffix = resolvedBranchId?.slice(-8) ?? crypto.randomUUID().slice(0, 8)
        resolvedEmail = `s.${rollNumber.toLowerCase().replace(/[^a-z0-9]/g, '')}.${branchSuffix}@sys.campushub.internal`
      } else if (targetRole === "Teacher") {
        const branchSuffix = resolvedBranchId?.slice(-8) ?? crypto.randomUUID().slice(0, 8)
        resolvedEmail = `t.${employeeId.toLowerCase().replace(/[^a-z0-9]/g, '')}.${branchSuffix}@sys.campushub.internal`
      }
    }

    // Check email uniqueness
    const existingEmail = await db.user.findUnique({ where: { email: resolvedEmail } })
    if (existingEmail) {
      return NextResponse.json({ error: "A user with this email already exists" }, { status: 409 })
    }

    // Check rollNumber uniqueness within branch for Students
    if (targetRole === "Student" && rollNumber && resolvedBranchId) {
      const existingRollNumber = await db.user.findFirst({
        where: {
          rollNumber,
          branchId: resolvedBranchId,
          role: "Student",
        },
      })
      if (existingRollNumber) {
        return NextResponse.json({ error: "A student with this roll number already exists in this branch" }, { status: 409 })
      }
    }

    // Check employeeId uniqueness within branch for Teachers
    if (targetRole === "Teacher" && employeeId && resolvedBranchId) {
      const existingEmployeeId = await db.user.findFirst({
        where: {
          employeeId,
          branchId: resolvedBranchId,
          role: "Teacher",
        },
      })
      if (existingEmployeeId) {
        return NextResponse.json({ error: "A teacher with this employee ID already exists in this branch" }, { status: 409 })
      }
    }

    const passwordHash = await bcrypt.hash(password, 12)

    const newUser = await db.user.create({
      data: {
        name,
        email: resolvedEmail,
        passwordHash,
        role: targetRole,
        instituteId: resolvedInstituteId,
        branchId: resolvedBranchId,
        employeeId: employeeId ?? null,
        rollNumber: rollNumber ?? null,
        classLevel: classLevel ?? null,
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        instituteId: true,
        branchId: true,
        employeeId: true,
        rollNumber: true,
        classLevel: true,
        isActive: true,
        createdAt: true,
      },
    })

    return NextResponse.json({ success: true, data: newUser }, { status: 201 })
  } catch (error) {
    console.error("POST /api/users error:", error)
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await request.json()
    const { id, isActive, name, phone } = body

    if (!id) return NextResponse.json({ error: "User id is required" }, { status: 400 })

    const user = await db.user.findUnique({ where: { id } })
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

    // Scope check — caller can only manage users within their scope
    if (token.role === "BranchAdmin" && user.branchId !== token.branchId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }
    if (token.role === "InstituteAdmin" && user.instituteId !== token.instituteId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const updated = await db.user.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(phone !== undefined && { phone }),
        ...(isActive !== undefined && { isActive }),
      },
      select: { id: true, name: true, email: true, role: true, isActive: true },
    })

    return NextResponse.json({ success: true, data: updated })
  } catch (error) {
    console.error("PATCH /api/users error:", error)
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 })
  }
}
