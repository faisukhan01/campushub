import { getRouteToken } from '@/lib/security'
import { NextRequest, NextResponse } from 'next/server'

import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const token = getRouteToken(request)
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { searchParams } = request.nextUrl
    const branchId = searchParams.get('branchId')
    const teacherId = searchParams.get('teacherId')

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const whereClause: any = { isActive: true }

    // Scope by role
    if (token.role === "Student") {
      // Students only see courses they're enrolled in
      whereClause.enrollments = {
        some: {
          studentId: token.sub,
          status: 'Active'
        }
      }
    } else if (token.role === "Teacher") {
      // Teachers only see courses they're assigned to
      whereClause.teachers = {
        some: { teacherId: token.sub }
      }
    } else if (token.role === "BranchAdmin" && token.branchId) {
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
    const token = getRouteToken(request)
    if (!token) {
      console.error('[COURSES POST] No token found')
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log('[COURSES POST] Token data:', { 
      role: token.role, 
      branchId: token.branchId,
      userId: token.userId || token.sub 
    })
    
    let userRole = token.role as string
    let userBranchId = token.branchId as string | undefined
    
    // If role or branchId is missing from token, fetch from database
    if (!userRole || (userRole === "BranchAdmin" && !userBranchId)) {
      console.log('[COURSES POST] Missing data in token, fetching from database')
      const userId = (token.userId || token.sub) as string
      const user = await db.user.findUnique({
        where: { id: userId },
        select: { role: true, branchId: true }
      })
      
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 })
      }
      
      userRole = user.role
      userBranchId = user.branchId || undefined
      console.log('[COURSES POST] Fetched from DB - Role:', userRole, 'BranchId:', userBranchId)
    }
    
    if (!["SuperAdmin", "InstituteAdmin", "BranchAdmin"].includes(userRole)) {
      console.error('[COURSES POST] Forbidden - Role not allowed:', userRole)
      return NextResponse.json({ 
        error: `Access denied. Your role (${userRole}) does not have permission to create courses. Please log out and log back in if you recently changed roles.` 
      }, { status: 403 })
    }

    const body = await request.json()
    const { title, code, description, classLevel, subjectType, branchId } = body

    console.log('[COURSES POST] Request body:', { title, code, classLevel, subjectType })

    if (!title || !code || !classLevel) {
      return NextResponse.json({ error: "title, code and classLevel are required" }, { status: 400 })
    }

    let resolvedBranchId: string
    if (userRole === "BranchAdmin") {
      if (!userBranchId) {
        console.error('[COURSES POST] BranchAdmin has no branchId')
        return NextResponse.json({ 
          error: "Branch not assigned to your account. Please contact your administrator or try logging out and back in." 
        }, { status: 400 })
      }
      resolvedBranchId = userBranchId
      console.log('[COURSES POST] Using branchId from user:', resolvedBranchId)
    } else {
      if (!branchId) return NextResponse.json({ error: "branchId is required" }, { status: 400 })
      resolvedBranchId = branchId
      console.log('[COURSES POST] Using branchId from request:', resolvedBranchId)
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

    console.log('[COURSES POST] Course created successfully:', course.id)
    return NextResponse.json({ success: true, data: course }, { status: 201 })
  } catch (error) {
    console.error('POST /api/courses error:', error)
    return NextResponse.json({ success: false, error: 'Failed to create course' }, { status: 500 })
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
