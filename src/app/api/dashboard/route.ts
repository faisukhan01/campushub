import { getRouteToken } from '@/lib/security'
import { NextRequest, NextResponse } from 'next/server'

import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const token = getRouteToken(request)
    
    const { searchParams } = request.nextUrl
    const role = searchParams.get('role') || token?.role || 'Student'
    const userId = searchParams.get('userId') || token?.sub

    switch (role) {
      case 'SuperAdmin': {
        const totalStudents = await db.user.count({ where: { role: 'Student', isActive: true } })
        const totalTeachers = await db.user.count({ where: { role: 'Teacher', isActive: true } })
        const totalCourses = await db.course.count()
        const totalBranches = await db.branch.count()
        const totalInstitutes = await db.institute.count()
        const totalEnrollments = await db.enrollment.count()
        const totalFeeCollected = await db.feePayment.aggregate({
          _sum: { amount: true },
          where: { status: 'Completed' },
        })

        return NextResponse.json({
          success: true,
          data: {
            totalInstitutes,
            totalStudents,
            totalTeachers,
            totalCourses,
            totalBranches,
            totalEnrollments,
            totalFeeCollected: totalFeeCollected._sum.amount || 0,
          },
        })
      }

      case 'InstituteAdmin': {
        // instituteId from JWT token is authoritative; query param is a fallback
        const instituteId = (token?.instituteId as string | undefined) || searchParams.get('instituteId')

        if (!instituteId) {
          return NextResponse.json(
            { success: false, error: 'instituteId is required for InstituteAdmin role' },
            { status: 400 }
          )
        }

        // All counts scoped to this institute only
        const instStudents = await db.user.count({
          where: { role: 'Student', instituteId, isActive: true },
        })
        const instTeachers = await db.user.count({
          where: { role: 'Teacher', instituteId, isActive: true },
        })
        const instBranches = await db.branch.count({
          where: { instituteId },
        })
        const instCourses = await db.course.count({
          where: { branch: { instituteId } },
        })
        const totalEnrollments = await db.enrollment.count({
          where: { course: { branch: { instituteId } } },
        })
        const totalAssignments = await db.assignment.count({
          where: { course: { branch: { instituteId } } },
        })
        const totalAnnouncements = await db.announcement.count({
          where: { instituteId },
        })
        const openTickets = await db.supportTicket.count({
          where: { status: 'Open', user: { instituteId } },
        })

        return NextResponse.json({
          success: true,
          data: {
            totalStudents: instStudents,
            totalTeachers: instTeachers,
            totalCourses: instCourses,
            totalBranches: instBranches,
            totalEnrollments,
            totalAssignments,
            totalAnnouncements,
            openTickets,
            avgAttendance: 0,
          },
        })
      }

      case 'BranchAdmin': {
        // branchId from JWT token is authoritative
        const branchId = (token?.branchId as string | undefined) || searchParams.get('branchId')
        if (!branchId) {
          return NextResponse.json(
            { success: false, error: 'branchId is required for BranchAdmin role' },
            { status: 400 }
          )
        }

        const branchStudents = await db.user.count({
          where: { role: 'Student', branchId, isActive: true },
        })
        const branchTeachers = await db.user.count({
          where: { role: 'Teacher', branchId, isActive: true },
        })
        const branchCourses = await db.course.count({
          where: { branchId },
        })
        const branchEnrollments = await db.enrollment.count({
          where: { course: { branchId } },
        })

        return NextResponse.json({
          success: true,
          data: {
            totalStudents: branchStudents,
            totalTeachers: branchTeachers,
            totalCourses: branchCourses,
            totalEnrollments: branchEnrollments,
            avgAttendance: 0,
          },
        })
      }

      case 'Teacher': {
        if (!userId) {
          return NextResponse.json(
            { success: false, error: 'userId is required for Teacher role' },
            { status: 400 }
          )
        }

        const taughtCourses = await db.courseTeacher.findMany({
          where: { teacherId: userId },
          include: {
            course: {
              include: {
                enrollments: true,
              },
            },
          },
        })

        const totalEnrolledStudents = taughtCourses.reduce(
          (sum, ct) => sum + ct.course.enrollments.length,
          0
        )

        const myCourseIds = taughtCourses.map((ct) => ct.courseId)

        const totalAssignments = myCourseIds.length === 0 ? 0 : await db.assignment.count({
          where: { courseId: { in: myCourseIds } },
        })

        const pendingSubmissions = myCourseIds.length === 0 ? 0 : await db.submission.count({
          where: { assignment: { courseId: { in: myCourseIds } }, status: 'Submitted' },
        })

        const upcomingSessions = myCourseIds.length === 0 ? 0 : await db.attendanceSession.count({
          where: { courseId: { in: myCourseIds }, date: { gte: new Date() } },
        })

        return NextResponse.json({
          success: true,
          data: {
            totalCourses: taughtCourses.length,
            totalEnrolledStudents,
            totalAssignments,
            pendingSubmissions,
            upcomingSessions,
          },
        })
      }

      case 'Student': {
        if (!userId) {
          return NextResponse.json(
            { success: false, error: 'userId is required for Student role' },
            { status: 400 }
          )
        }

        const enrollments = await db.enrollment.findMany({
          where: { studentId: userId },
          include: {
            course: {
              include: {
                assignments: true,
              },
            },
          },
        })

        const totalAssignments = enrollments.reduce(
          (sum, e) => sum + e.course.assignments.length,
          0
        )

        const pendingAssignments = enrollments.reduce(
          (sum, e) =>
            sum +
            e.course.assignments.filter(
              (a) =>
                a.dueDate >= new Date() &&
                !e.course.assignments.some(
                  (check) => check.id === a.id
                )
            ).length,
          0
        )

        const submittedCount = await db.submission.count({
          where: { studentId: userId, status: 'Submitted' },
        })

        const myGrades = await db.grade.findMany({
          where: { studentId: userId },
        })

        const averageGrade =
          myGrades.length > 0
            ? myGrades.reduce((sum, g) => sum + (g.marks / g.maxMarks) * 100, 0) /
              myGrades.length
            : 0

        // Attendance percentage
        const attendanceRecords = await db.attendanceRecord.findMany({
          where: { studentId: userId },
        })
        const presentCount = attendanceRecords.filter(
          (r) => r.status === 'Present'
        ).length
        const attendancePercentage =
          attendanceRecords.length > 0
            ? (presentCount / attendanceRecords.length) * 100
            : 0

        // Fee info
        const invoices = await db.feeInvoice.findMany({
          where: { studentId: userId },
        })
        const pendingFees = invoices
          .filter((i) => i.status === 'Pending')
          .reduce((sum, i) => sum + (i.amount - i.paid), 0)

        return NextResponse.json({
          success: true,
          data: {
            totalCourses: enrollments.length,
            totalAssignments,
            pendingAssignments,
            submittedAssignments: submittedCount,
            averageGrade: Math.round(averageGrade * 10) / 10,
            attendancePercentage: Math.round(attendancePercentage * 10) / 10,
            pendingFees,
          },
        })
      }

      case 'Parent': {
        if (!userId) {
          return NextResponse.json(
            { success: false, error: 'userId is required for Parent role' },
            { status: 400 }
          )
        }

        // For a parent, return child's info
        const childId = searchParams.get('childId') || userId
        const childEnrollments = await db.enrollment.count({
          where: { studentId: childId },
        })

        const childGrades = await db.grade.findMany({
          where: { studentId: childId },
        })
        const averageGrade =
          childGrades.length > 0
            ? childGrades.reduce((sum, g) => sum + (g.marks / g.maxMarks) * 100, 0) /
              childGrades.length
            : 0

        const childAttendance = await db.attendanceRecord.findMany({
          where: { studentId: childId },
        })
        const presentCount = childAttendance.filter(
          (r) => r.status === 'Present'
        ).length
        const attendancePercentage =
          childAttendance.length > 0
            ? (presentCount / childAttendance.length) * 100
            : 0

        const childInvoices = await db.feeInvoice.findMany({
          where: { studentId: childId },
        })
        const pendingFees = childInvoices
          .filter((i) => i.status === 'Pending')
          .reduce((sum, i) => sum + (i.amount - i.paid), 0)

        return NextResponse.json({
          success: true,
          data: {
            totalCourses: childEnrollments,
            averageGrade: Math.round(averageGrade * 10) / 10,
            attendancePercentage: Math.round(attendancePercentage * 10) / 10,
            pendingFees,
          },
        })
      }

      default:
        return NextResponse.json(
          { success: false, error: `Unknown role: ${role}` },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Dashboard API error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    )
  }
}
