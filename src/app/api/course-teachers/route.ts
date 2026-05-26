import { getRouteToken } from '@/lib/security'
import { NextRequest, NextResponse } from 'next/server'

import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const token = getRouteToken(request)
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { searchParams } = request.nextUrl
    const courseId = searchParams.get('courseId')
    const teacherId = searchParams.get('teacherId')

    const whereClause: any = {}

    // Role-based scoping
    if (token.role === "Teacher") {
      whereClause.teacherId = token.userId
    } else if (token.role === "BranchAdmin") {
      whereClause.course = {
        branchId: token.branchId
      }
    } else if (token.role === "InstituteAdmin") {
      whereClause.course = {
        branch: {
          instituteId: token.instituteId
        }
      }
    }

    if (courseId) whereClause.courseId = courseId
    if (teacherId) whereClause.teacherId = teacherId

    const courseTeachers = await db.courseTeacher.findMany({
      where: whereClause,
      include: {
        course: {
          select: {
            id: true,
            code: true,
            title: true,
            classLevel: true,
            section: true,
          },
        },
        teacher: {
          select: {
            id: true,
            name: true,
            email: true,
            employeeId: true,
            avatar: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({
      success: true,
      data: courseTeachers,
    })
  } catch (error) {
    console.error('Course Teachers API error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch course teachers' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = getRouteToken(request)
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    if (!["SuperAdmin", "InstituteAdmin", "BranchAdmin"].includes(token.role as string)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const { courseId, teacherId, isPrimary } = body

    if (!courseId || !teacherId) {
      return NextResponse.json({ error: "courseId and teacherId are required" }, { status: 400 })
    }

    // Verify course exists and is in scope
    const course = await db.course.findUnique({
      where: { id: courseId },
      include: { branch: true },
    })

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }

    // Check permissions
    if (token.role === "BranchAdmin" && course.branchId !== token.branchId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }
    if (token.role === "InstituteAdmin" && course.branch.instituteId !== token.instituteId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Verify teacher exists and is in scope
    const teacher = await db.user.findUnique({
      where: { id: teacherId },
    })

    if (!teacher || teacher.role !== "Teacher") {
      return NextResponse.json({ error: "Teacher not found" }, { status: 404 })
    }

    if (token.role === "BranchAdmin" && teacher.branchId !== token.branchId) {
      return NextResponse.json({ error: "Teacher not in your branch" }, { status: 403 })
    }

    // Check if already assigned
    const existing = await db.courseTeacher.findFirst({
      where: {
        courseId,
        teacherId,
      },
    })

    if (existing) {
      return NextResponse.json({ error: "Teacher is already assigned to this course" }, { status: 400 })
    }

    // If setting as primary, unset other primary teachers
    if (isPrimary) {
      await db.courseTeacher.updateMany({
        where: {
          courseId,
          isPrimary: true,
        },
        data: {
          isPrimary: false,
        },
      })
    }

    // Create assignment
    const courseTeacher = await db.courseTeacher.create({
      data: {
        courseId,
        teacherId,
        isPrimary: isPrimary ?? false,
      },
      include: {
        course: {
          select: {
            id: true,
            code: true,
            title: true,
          },
        },
        teacher: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      data: courseTeacher,
    }, { status: 201 })
  } catch (error) {
    console.error('POST /api/course-teachers error:', error)
    return NextResponse.json({ success: false, error: 'Failed to assign teacher' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const token = getRouteToken(request)
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    if (!["SuperAdmin", "InstituteAdmin", "BranchAdmin"].includes(token.role as string)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const { id, isPrimary } = body

    if (!id || isPrimary === undefined) {
      return NextResponse.json({ error: "id and isPrimary are required" }, { status: 400 })
    }

    const assignment = await db.courseTeacher.findUnique({
      where: { id },
      include: { course: { include: { branch: true } } },
    })

    if (!assignment) return NextResponse.json({ error: "Assignment not found" }, { status: 404 })

    if (token.role === "BranchAdmin" && assignment.course.branchId !== token.branchId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }
    if (token.role === "InstituteAdmin" && assignment.course.branch.instituteId !== token.instituteId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    if (isPrimary) {
      await db.courseTeacher.updateMany({
        where: { courseId: assignment.courseId, isPrimary: true },
        data: { isPrimary: false },
      })
    }

    const updated = await db.courseTeacher.update({ where: { id }, data: { isPrimary } })
    return NextResponse.json({ success: true, data: updated })
  } catch (error) {
    console.error('PATCH /api/course-teachers error:', error)
    return NextResponse.json({ success: false, error: 'Failed to update assignment' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const token = getRouteToken(request)
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    if (!["SuperAdmin", "InstituteAdmin", "BranchAdmin"].includes(token.role as string)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { searchParams } = request.nextUrl
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: "Assignment id is required" }, { status: 400 })
    }

    const assignment = await db.courseTeacher.findUnique({
      where: { id },
      include: {
        course: {
          include: { branch: true },
        },
      },
    })

    if (!assignment) {
      return NextResponse.json({ error: "Assignment not found" }, { status: 404 })
    }

    // Check permissions
    if (token.role === "BranchAdmin" && assignment.course.branchId !== token.branchId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }
    if (token.role === "InstituteAdmin" && assignment.course.branch.instituteId !== token.instituteId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    await db.courseTeacher.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/course-teachers error:', error)
    return NextResponse.json({ success: false, error: 'Failed to remove teacher assignment' }, { status: 500 })
  }
}
