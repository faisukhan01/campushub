import { getRouteToken } from '@/lib/security'
import { NextRequest, NextResponse } from 'next/server'

import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const token = getRouteToken(request)
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { searchParams } = request.nextUrl
    const courseId = searchParams.get('courseId')
    const studentId = searchParams.get('studentId')

    const whereClause: any = { status: 'Active' }

    // Role-based scoping
    if (token.role === "Student") {
      whereClause.studentId = token.userId
    } else if (token.role === "Teacher") {
      whereClause.course = {
        teachers: {
          some: { teacherId: token.userId }
        }
      }
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
    if (studentId) whereClause.studentId = studentId

    const enrollments = await db.enrollment.findMany({
      where: whereClause,
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
            rollNumber: true,
            classLevel: true,
            avatar: true,
          },
        },
        course: {
          select: {
            id: true,
            code: true,
            title: true,
            classLevel: true,
            section: true,
          },
        },
      },
      orderBy: { enrolledAt: 'desc' },
    })

    return NextResponse.json({
      success: true,
      data: enrollments,
    })
  } catch (error) {
    console.error('Enrollments API error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch enrollments' },
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
    const { courseId, studentIds } = body

    if (!courseId || !studentIds || !Array.isArray(studentIds) || studentIds.length === 0) {
      return NextResponse.json({ error: "courseId and studentIds array are required" }, { status: 400 })
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

    // Check which students are already enrolled
    const existingEnrollments = await db.enrollment.findMany({
      where: {
        courseId,
        studentId: { in: studentIds },
        status: 'Active',
      },
      select: { studentId: true },
    })

    const alreadyEnrolledIds = existingEnrollments.map((e) => e.studentId)
    const newStudentIds = studentIds.filter((id) => !alreadyEnrolledIds.includes(id))

    if (newStudentIds.length === 0) {
      return NextResponse.json({ error: "All selected students are already enrolled" }, { status: 400 })
    }

    // Create enrollments
    const enrollments = await db.enrollment.createMany({
      data: newStudentIds.map((studentId) => ({
        courseId,
        studentId,
        status: 'Active',
      })),
    })

    return NextResponse.json({
      success: true,
      data: {
        enrolled: enrollments.count,
        skipped: alreadyEnrolledIds.length,
      },
    }, { status: 201 })
  } catch (error) {
    console.error('POST /api/enrollments error:', error)
    return NextResponse.json({ success: false, error: 'Failed to enroll students' }, { status: 500 })
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
    const enrollmentId = searchParams.get('id')

    if (!enrollmentId) {
      return NextResponse.json({ error: "Enrollment id is required" }, { status: 400 })
    }

    const enrollment = await db.enrollment.findUnique({
      where: { id: enrollmentId },
      include: {
        course: {
          include: { branch: true },
        },
      },
    })

    if (!enrollment) {
      return NextResponse.json({ error: "Enrollment not found" }, { status: 404 })
    }

    // Check permissions
    if (token.role === "BranchAdmin" && enrollment.course.branchId !== token.branchId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }
    if (token.role === "InstituteAdmin" && enrollment.course.branch.instituteId !== token.instituteId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    await db.enrollment.update({
      where: { id: enrollmentId },
      data: { status: 'Inactive' },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/enrollments error:', error)
    return NextResponse.json({ success: false, error: 'Failed to remove enrollment' }, { status: 500 })
  }
}
