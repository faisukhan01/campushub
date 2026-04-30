import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const branchId = searchParams.get('branchId')
    const teacherId = searchParams.get('teacherId')

    const whereClause: any = { isActive: true }

    if (branchId) {
      whereClause.branchId = branchId
    }

    if (teacherId) {
      whereClause.teachers = {
        some: { teacherId },
      }
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
      creditHours: course.creditHours,
      section: course.section,
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
