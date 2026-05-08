import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { searchParams } = request.nextUrl
    const branchId = searchParams.get('branchId')
    const teacherId = searchParams.get('teacherId')

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const whereClause: any = { isActive: true }

    // Scope by role
    if (token.role === "BranchAdmin" && token.branchId) {
      whereClause.branchId = token.branchId
    } else if (token.role === "InstituteAdmin" && token.instituteId) {
      whereClause.branch = { instituteId: token.instituteId }
    }

    if (branchId) whereClause.branchId = branchId

    if (teacherId) {
      whereClause.teachers = { some: { teacherId } }
    }

    const courses = await db.course.findMany({
      where: whereClause,
      include: {
        branch: {
          select: { id: true, name: true, code: true },
        },
        program: {
          select: { id: true, name: true, code: true },
        },
        batch: {
          select: { id: true, name: true, code: true },
        },
        term: {
          select: { id: true, name: true },
        },
        teachers: {
          include: {
            teacher: {
              select: { id: true, name: true, email: true, avatar: true },
            },
          },
        },
        modules: {
          where: { isPublished: true },
          orderBy: { order: 'asc' },
          include: {
            lessons: {
              where: { isPublished: true },
              orderBy: { order: 'asc' },
            },
          },
        },
        enrollments: {
          where: { status: 'Active' },
          select: { id: true },
        },
        _count: {
          select: {
            assignments: true,
            sessions: true,
            announcements: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    const formattedCourses = courses.map((course) => ({
      id: course.id,
      code: course.code,
      title: course.title,
      description: course.description,
      classLevel: course.classLevel,
      section: course.section,
      subjectType: course.subjectType,
      isActive: course.isActive,
      branch: course.branch,
      program: course.program,
      batch: course.batch,
      term: course.term,
      teachers: course.teachers.map((ct) => ({
        id: ct.teacher.id,
        name: ct.teacher.name,
        email: ct.teacher.email,
        avatar: ct.teacher.avatar,
        isPrimary: ct.isPrimary,
      })),
      modules: course.modules.map((mod) => ({
        id: mod.id,
        title: mod.title,
        description: mod.description,
        order: mod.order,
        lessonCount: mod.lessons.length,
      })),
      enrolledStudentsCount: course.enrollments.length,
      assignmentsCount: course._count.assignments,
      sessionsCount: course._count.sessions,
      announcementsCount: course._count.announcements,
      createdAt: course.createdAt,
      updatedAt: course.updatedAt,
    }))

    return NextResponse.json({
      success: true,
      data: formattedCourses,
    })
  } catch (error) {
    console.error('Courses API error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch courses' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    if (!["SuperAdmin", "InstituteAdmin", "BranchAdmin"].includes(token.role as string)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const { title, code, description, classLevel, subjectType, branchId } = body

    if (!title || !code || !classLevel) {
      return NextResponse.json({ error: "title, code and classLevel are required" }, { status: 400 })
    }

    let resolvedBranchId: string
    if (token.role === "BranchAdmin") {
      if (!token.branchId) return NextResponse.json({ error: "Branch not assigned to your account" }, { status: 400 })
      resolvedBranchId = token.branchId as string
    } else {
      if (!branchId) return NextResponse.json({ error: "branchId is required" }, { status: 400 })
      resolvedBranchId = branchId
    }

    const course = await db.course.create({
      data: {
        title,
        code,
        description: description || null,
        classLevel,
        subjectType: subjectType || "Core",
        branchId: resolvedBranchId,
      },
    })

    return NextResponse.json({ success: true, data: course }, { status: 201 })
  } catch (error) {
    console.error('POST /api/courses error:', error)
    return NextResponse.json({ success: false, error: 'Failed to create course' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    if (!["SuperAdmin", "InstituteAdmin", "BranchAdmin"].includes(token.role as string)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const { id, title, code, description, classLevel, subjectType, isActive } = body
    if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 })

    const updated = await db.course.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(code !== undefined && { code }),
        ...(description !== undefined && { description }),
        ...(classLevel !== undefined && { classLevel }),
        ...(subjectType !== undefined && { subjectType }),
        ...(isActive !== undefined && { isActive }),
      },
    })

    return NextResponse.json({ success: true, data: updated })
  } catch (error) {
    console.error('PATCH /api/courses error:', error)
    return NextResponse.json({ success: false, error: 'Failed to update course' }, { status: 500 })
  }
}
