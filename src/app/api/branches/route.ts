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

export async function PATCH(request: NextRequest) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    if (!["SuperAdmin", "InstituteAdmin"].includes(token.role as string)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const { id, name, code, phone, email, address, adminEmail, adminPassword } = body

    if (!id) {
      return NextResponse.json({ error: "Branch ID is required" }, { status: 400 })
    }

    if (!name || !code) {
      return NextResponse.json({ error: "Branch name and code are required" }, { status: 400 })
    }

    if (adminPassword && adminPassword.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 })
    }

    // Check if branch exists and user has permission
    const existingBranch = await db.branch.findUnique({ where: { id } })
    if (!existingBranch) {
      return NextResponse.json({ error: "Branch not found" }, { status: 404 })
    }

    // Permission check
    if (token.role === "InstituteAdmin" && existingBranch.instituteId !== token.instituteId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Update branch details
    const updatedBranch = await db.branch.update({
      where: { id },
      data: {
        name,
        code: code.toUpperCase(),
        email: email || null,
        phone: phone || null,
        address: address || null,
      },
    })

    // Update admin credentials if provided
    if (adminEmail || adminPassword) {
      const admin = await db.user.findFirst({
        where: { role: "BranchAdmin", branchId: id, isActive: true },
      })

      if (admin) {
        const updateData: any = {}
        
        if (adminEmail && adminEmail !== admin.email) {
          // Check if new email is already taken
          const existingUser = await db.user.findUnique({ where: { email: adminEmail } })
          if (existingUser && existingUser.id !== admin.id) {
            return NextResponse.json({ error: "Email already in use" }, { status: 409 })
          }
          updateData.email = adminEmail
        }

        if (adminPassword) {
          updateData.passwordHash = await bcrypt.hash(adminPassword, 12)
        }

        if (Object.keys(updateData).length > 0) {
          await db.user.update({
            where: { id: admin.id },
            data: updateData,
          })
        }
      }
    }

    return NextResponse.json({ success: true, data: updatedBranch })
  } catch (error) {
    console.error("PATCH /api/branches error:", error)
    return NextResponse.json({ error: "Failed to update branch" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    if (!["SuperAdmin", "InstituteAdmin"].includes(token.role as string)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const { id } = body

    if (!id) {
      return NextResponse.json({ error: "Branch ID is required" }, { status: 400 })
    }

    // Check if branch exists and user has permission
    const existingBranch = await db.branch.findUnique({ 
      where: { id },
      include: {
        _count: {
          select: {
            courses: true,
          }
        }
      }
    })
    
    if (!existingBranch) {
      return NextResponse.json({ error: "Branch not found" }, { status: 404 })
    }

    // Permission check
    if (token.role === "InstituteAdmin" && existingBranch.instituteId !== token.instituteId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Check if branch has users or courses
    const userCount = await db.user.count({ where: { branchId: id } })
    if (userCount > 0 || existingBranch._count.courses > 0) {
      return NextResponse.json({ 
        error: `Cannot delete branch with ${userCount} users and ${existingBranch._count.courses} courses. Please remove them first.` 
      }, { status: 400 })
    }

    // Delete the branch
    await db.branch.delete({ where: { id } })

    return NextResponse.json({ success: true, message: "Branch deleted successfully" })
  } catch (error) {
    console.error("DELETE /api/branches error:", error)
    return NextResponse.json({ error: "Failed to delete branch" }, { status: 500 })
  }
}
