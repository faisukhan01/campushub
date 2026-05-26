import { getRouteToken } from '@/lib/security'
import { NextRequest, NextResponse } from "next/server"

import bcrypt from "bcryptjs"
import { db } from "@/lib/db"

// Who can create whom
const CREATION_PERMISSIONS: Record<string, string[]> = {
  SuperAdmin: ["InstituteAdmin"],
  InstituteAdmin: ["BranchAdmin"],
  BranchAdmin: ["Teacher", "Student"],
}

// Which roles each caller is permitted to view
const VIEWABLE_ROLES: Record<string, string[]> = {
  BranchAdmin: ["Teacher", "Student"],
  InstituteAdmin: ["BranchAdmin", "Teacher", "Student"],
}

export async function GET(request: NextRequest) {
  try {
    const token = getRouteToken(request)
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const callerRole = token.role as string
    const { searchParams } = request.nextUrl
    const roleFilter = searchParams.get("role")
    const branchId = searchParams.get("branchId")
    const instituteId = searchParams.get("instituteId")

    const allowedRoles = VIEWABLE_ROLES[callerRole] ?? null

    // --- Build scoped base where (no query-param role filter yet) ---
    const scopeWhere: Record<string, unknown> = { isActive: true }

    if (callerRole === "SuperAdmin") {
      if (instituteId) scopeWhere.instituteId = instituteId
      if (branchId) scopeWhere.branchId = branchId
    } else if (callerRole === "InstituteAdmin" && token.instituteId) {
      scopeWhere.instituteId = token.instituteId
      if (branchId) scopeWhere.branchId = branchId
      scopeWhere.role = { in: allowedRoles! }
    } else if (callerRole === "BranchAdmin" && token.branchId) {
      scopeWhere.branchId = token.branchId
      scopeWhere.role = { in: allowedRoles! }
    } else {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // --- Users where = scope + optional role query param ---
    const usersWhere: Record<string, unknown> = { ...scopeWhere }
    if (roleFilter) {
      if (!allowedRoles || allowedRoles.includes(roleFilter)) {
        usersWhere.role = roleFilter
      }
      // silently ignore invalid role filters for non-SuperAdmin callers
    }

    const users = await db.user.findMany({
      where: usersWhere,
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
        classLevel: true,
        plainPassword: true,
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

    // Role counts use scopeWhere (no role query-param filter) so every
    // allowed role gets its own count regardless of the active tab.
    const roleCounts = await db.user.groupBy({
      by: ["role"],
      where: scopeWhere,
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
    const token = getRouteToken(request)
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
        plainPassword: password,
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
    const token = getRouteToken(request)
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await request.json()
    const { id, isActive, name, email, phone, password, employeeId, rollNumber, classLevel } = body

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

    // Validate password if provided
    if (password !== undefined && password !== "") {
      if (password.length < 8) {
        return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 })
      }
    }

    // Check email uniqueness if changing email
    if (email && email !== user.email) {
      const existingEmail = await db.user.findUnique({ where: { email } })
      if (existingEmail) {
        return NextResponse.json({ error: "Email already in use" }, { status: 409 })
      }
    }

    // Hash password if provided
    const passwordHash = (password && password !== "") ? await bcrypt.hash(password, 12) : undefined

    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (email !== undefined) updateData.email = email
    if (phone !== undefined) updateData.phone = phone
    if (isActive !== undefined) updateData.isActive = isActive
    if (passwordHash !== undefined) {
      updateData.passwordHash = passwordHash
      updateData.plainPassword = password
    }
    if (employeeId !== undefined) updateData.employeeId = employeeId
    if (rollNumber !== undefined) updateData.rollNumber = rollNumber
    if (classLevel !== undefined) updateData.classLevel = classLevel

    const updated = await db.user.update({
      where: { id },
      data: updateData,
      select: { id: true, name: true, email: true, role: true, isActive: true, employeeId: true, rollNumber: true, classLevel: true },
    })

    return NextResponse.json({ success: true, data: updated })
  } catch (error) {
    console.error("PATCH /api/users error:", error)
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const token = getRouteToken(request)
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await request.json()
    const { id } = body

    if (!id) return NextResponse.json({ error: "User id is required" }, { status: 400 })

    const user = await db.user.findUnique({ 
      where: { id },
      include: {
        _count: {
          select: {
            enrollments: true,
            taughtCourses: true,
          }
        }
      }
    })
    
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

    // Prevent deleting SuperAdmin
    if (user.role === "SuperAdmin") {
      return NextResponse.json({ error: "Cannot delete SuperAdmin accounts" }, { status: 403 })
    }

    // Scope check — caller can only delete users within their scope
    if (token.role === "BranchAdmin" && user.branchId !== token.branchId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }
    if (token.role === "InstituteAdmin" && user.instituteId !== token.instituteId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Check if user has associated data
    if (user._count.enrollments > 0 || user._count.taughtCourses > 0) {
      return NextResponse.json({ 
        error: `Cannot delete user with ${user._count.enrollments} enrollments and ${user._count.taughtCourses} taught courses. Please remove them first or deactivate the user instead.` 
      }, { status: 400 })
    }

    // Delete the user
    await db.user.delete({ where: { id } })

    return NextResponse.json({ success: true, message: "User deleted successfully" })
  } catch (error) {
    console.error("DELETE /api/users error:", error)
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 })
  }
}
