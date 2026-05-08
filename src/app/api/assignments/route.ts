import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { searchParams } = request.nextUrl
    const courseId = searchParams.get('courseId')

    const whereClause: any = {}

    // Role-based scoping
    if (token.role === "Student") {
      // Students can only see assignments for courses they're enrolled in
      whereClause.course = {
        enrollments: {
          some: { studentId: token.userId }
        }
      }
    } else if (token.role === "Teacher") {
      // Teachers can only see assignments for courses they teach
      whereClause.course = {
        teachers: {
          some: { teacherId: token.userId }
        }
      }
    } else if (token.role === "BranchAdmin") {
      // BranchAdmin can see assignments for courses in their branch
      whereClause.course = {
        branchId: token.branchId
      }
    } else if (token.role === "InstituteAdmin") {
      // InstituteAdmin can see assignments for courses in their institute
      whereClause.course = {
        branch: {
          instituteId: token.instituteId
        }
      }
    }
    // SuperAdmin has no filter

    // Apply query params (SuperAdmin can use arbitrary courseId)
    if (courseId && token.role === "SuperAdmin") {
      whereClause.courseId = courseId
    }

    const assignments = await db.assignment.findMany({
      where: whereClause,
      include: {
        course: {
          select: { id: true, code: true, title: true },
        },
        _count: {
          select: {
            submissions: true,
            comments: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    // Get submission stats for each assignment
    const assignmentIds = assignments.map((a) => a.id)

    let submissionStats: Record<string, { submitted: number; graded: number; avgMarks: number }> = {}
    if (assignmentIds.length > 0) {
      const allSubmissions = await db.submission.findMany({
        where: { assignmentId: { in: assignmentIds } },
        select: { assignmentId: true, status: true, marks: true },
      })

      const maxMarksMap: Record<string, number> = {}
      assignments.forEach((a) => {
        maxMarksMap[a.id] = a.maxMarks
      })

      submissionStats = assignmentIds.reduce((acc, aId) => {
        const subs = allSubmissions.filter((s) => s.assignmentId === aId)
        const submitted = subs.filter((s) => s.status === 'Submitted').length
        const graded = subs.filter((s) => s.status === 'Graded' && s.marks !== null).length
        const gradedSubs = subs.filter((s) => s.marks !== null)
        const avgMarks =
          gradedSubs.length > 0
            ? gradedSubs.reduce((sum, s) => sum + s.marks!, 0) / gradedSubs.length
            : 0

        acc[aId] = {
          submitted,
          graded,
          avgMarks: Math.round(avgMarks * 10) / 10,
        }
        return acc
      }, {} as Record<string, { submitted: number; graded: number; avgMarks: number }>)
    }

    const formattedAssignments = assignments.map((assignment) => ({
      id: assignment.id,
      title: assignment.title,
      instructions: assignment.instructions,
      dueDate: assignment.dueDate,
      maxMarks: assignment.maxMarks,
      allowedTypes: assignment.allowedTypes,
      maxSizeKB: assignment.maxSizeKB,
      maxAttempts: assignment.maxAttempts,
      allowLate: assignment.allowLate,
      latePenalty: assignment.latePenalty,
      isGroup: assignment.isGroup,
      isPublished: assignment.isPublished,
      course: assignment.course,
      totalSubmissions: assignment._count.submissions,
      totalComments: assignment._count.comments,
      submittedCount: submissionStats[assignment.id]?.submitted || 0,
      gradedCount: submissionStats[assignment.id]?.graded || 0,
      averageMarks: submissionStats[assignment.id]?.avgMarks || 0,
      createdAt: assignment.createdAt,
      updatedAt: assignment.updatedAt,
    }))

    return NextResponse.json({
      success: true,
      data: formattedAssignments,
    })
  } catch (error) {
    console.error('Assignments API error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch assignments' },
      { status: 500 }
    )
  }
}
