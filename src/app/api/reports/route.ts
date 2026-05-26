import { getRouteToken } from '@/lib/security'
import { NextRequest, NextResponse } from 'next/server'

import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  const token = getRouteToken(request)
  if (!token) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  const role = token.role as string
  const instituteId = token.instituteId as string | null
  const branchId = token.branchId as string | null

  // Role-based data scoping — enforced on every query
  const studentScope =
    role === 'SuperAdmin' ? {} :
    role === 'InstituteAdmin' ? { instituteId: instituteId! } :
    { branchId: branchId! }

  const courseScope =
    role === 'SuperAdmin' ? {} :
    role === 'InstituteAdmin' ? { branch: { instituteId: instituteId! } } :
    { branchId: branchId! }

  try {
    const { searchParams } = request.nextUrl
    const reportType = searchParams.get('type') || 'all'

    const result: Record<string, unknown> = {}

    if (reportType === 'all' || reportType === 'enrollment') {
      const totalStudents = await db.user.count({ where: { ...studentScope, role: 'Student' } })
      const totalEnrollments = await db.enrollment.count({ where: { status: 'Active', course: courseScope } })

      const enrollmentsByCourse = await db.enrollment.groupBy({
        by: ['courseId'],
        where: { status: 'Active', course: courseScope },
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
        take: 10,
      })

      const topCourseIds = enrollmentsByCourse.map(e => e.courseId)
      const topCourses = topCourseIds.length > 0
        ? await db.course.findMany({
            where: { id: { in: topCourseIds } },
            select: { id: true, code: true, title: true, classLevel: true },
          })
        : []

      const topCoursesWithCount = topCourses.map(course => ({
        ...course,
        enrollmentCount: enrollmentsByCourse.find(e => e.courseId === course.id)?._count.id || 0,
      }))

      const usersByRole = await db.user.groupBy({
        by: ['role'],
        where: studentScope,
        _count: { id: true },
      })

      result.enrollment = {
        totalActiveEnrollments: totalEnrollments,
        totalStudents,
        topCourses: topCoursesWithCount,
        usersByRole: usersByRole.map(u => ({ role: u.role, count: u._count.id })),
      }
    }

    if (reportType === 'all' || reportType === 'attendance') {
      const attendanceByStatus = await db.attendanceRecord.groupBy({
        by: ['status'],
        where: { session: { course: courseScope } },
        _count: { id: true },
      })

      const statusMap = attendanceByStatus.reduce((acc, item) => {
        acc[item.status] = item._count.id
        return acc
      }, {} as Record<string, number>)

      const totalRecords = attendanceByStatus.reduce((sum, a) => sum + a._count.id, 0)
      const present = statusMap['Present'] || 0
      const absent = statusMap['Absent'] || 0
      const late = statusMap['Late'] || 0
      const attendanceRate = totalRecords > 0
        ? Math.round(((present + late) / totalRecords) * 10000) / 100
        : 0

      const totalSessions = await db.attendanceSession.count({ where: { course: courseScope } })

      result.attendance = {
        totalSessions,
        totalRecords,
        present,
        absent,
        late,
        attendanceRate,
        statusDistribution: attendanceByStatus.map(a => ({ status: a.status, count: a._count.id })),
      }
    }

    if (reportType === 'all' || reportType === 'fees') {
      const feeWhere = Object.keys(studentScope).length ? { student: studentScope } : {}

      const totalInvoices = await db.feeInvoice.count({ where: feeWhere })
      const paidInvoices = await db.feeInvoice.count({ where: { ...feeWhere, status: 'Paid' } })
      const pendingInvoices = await db.feeInvoice.count({ where: { ...feeWhere, status: 'Pending' } })

      const totalAmount = await db.feeInvoice.aggregate({ where: feeWhere, _sum: { amount: true } })
      const totalPaid = await db.feeInvoice.aggregate({ where: feeWhere, _sum: { paid: true } })

      const paymentWhere = Object.keys(studentScope).length ? { student: studentScope } : {}
      const feePayments = await db.feePayment.findMany({
        where: paymentWhere,
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: { student: { select: { id: true, name: true, email: true } } },
      })

      const paymentsByMethod = await db.feePayment.groupBy({
        by: ['method'],
        where: paymentWhere,
        _count: { id: true },
        _sum: { amount: true },
      })

      const collectionRate = totalAmount._sum.amount && totalAmount._sum.amount > 0
        ? Math.round(((totalPaid._sum.paid || 0) / totalAmount._sum.amount) * 10000) / 100
        : 0

      result.fees = {
        totalInvoices,
        paidInvoices,
        pendingInvoices,
        totalAmount: totalAmount._sum.amount || 0,
        totalCollected: totalPaid._sum.paid || 0,
        totalOutstanding: (totalAmount._sum.amount || 0) - (totalPaid._sum.paid || 0),
        collectionRate,
        recentPayments: feePayments.map(p => ({
          id: p.id,
          amount: p.amount,
          method: p.method,
          status: p.status,
          studentName: p.student.name,
          createdAt: p.createdAt,
        })),
        paymentsByMethod: paymentsByMethod.map(p => ({
          method: p.method,
          count: p._count.id,
          totalAmount: p._sum.amount || 0,
        })),
      }
    }

    if (reportType === 'all' || reportType === 'academic') {
      const gradeDistribution = await db.grade.groupBy({
        by: ['gradeLetter'],
        where: { course: courseScope },
        _count: { id: true },
      })

      const avgMarks = await db.grade.aggregate({
        where: { course: courseScope },
        _avg: { marks: true },
      })

      const totalGrades = await db.grade.count({ where: { course: courseScope } })

      result.academic = {
        totalGrades,
        averageMarks: Math.round((avgMarks._avg.marks || 0) * 10) / 10,
        gradeDistribution: gradeDistribution
          .map(g => ({ grade: g.gradeLetter || 'Ungraded', count: g._count.id }))
          .sort((a, b) => a.grade.localeCompare(b.grade)),
      }
    }

    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    console.error('Reports API error:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch report data' }, { status: 500 })
  }
}
