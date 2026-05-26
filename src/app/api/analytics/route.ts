import { getRouteToken } from '@/lib/security'
import { NextRequest, NextResponse } from 'next/server'

import { db } from '@/lib/db'

function monthLabel(date: Date): string {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${months[date.getMonth()]} ${date.getFullYear()}`
}

function last12Months(): string[] {
  const now = new Date()
  return Array.from({ length: 12 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1)
    return monthLabel(d)
  })
}

export async function GET(request: NextRequest) {
  const token = getRouteToken(request)
  if (!token) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  const role = token.role as string
  const instituteId = token.instituteId as string | null
  const branchId = token.branchId as string | null

  // Only admins can access analytics
  const allowed = ['SuperAdmin', 'InstituteAdmin', 'BranchAdmin']
  if (!allowed.includes(role)) {
    return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
  }

  // Role-scoped filters
  const studentScope =
    role === 'SuperAdmin' ? {} :
    role === 'InstituteAdmin' ? { instituteId: instituteId! } :
    { branchId: branchId! }

  const courseScope =
    role === 'SuperAdmin' ? {} :
    role === 'InstituteAdmin' ? { branch: { instituteId: instituteId! } } :
    { branchId: branchId! }

  const paymentScope = Object.keys(studentScope).length ? { student: studentScope } : {}

  try {
    const cutoff = new Date()
    cutoff.setMonth(cutoff.getMonth() - 12)

    // KPI counts
    const [totalStudents, totalTeachers, totalCourses, totalEnrollments] = await Promise.all([
      db.user.count({ where: { ...studentScope, role: 'Student' } }),
      db.user.count({ where: { ...studentScope, role: 'Teacher' } }),
      db.course.count({ where: courseScope }),
      db.enrollment.count({ where: { status: 'Active', course: courseScope } }),
    ])

    // Attendance rate
    const attendanceSummary = await db.attendanceRecord.groupBy({
      by: ['status'],
      where: { session: { course: courseScope } },
      _count: { id: true },
    })
    const totalAttendance = attendanceSummary.reduce((s, a) => s + a._count.id, 0)
    const presentLate = attendanceSummary
      .filter(a => a.status === 'Present' || a.status === 'Late')
      .reduce((s, a) => s + a._count.id, 0)
    const attendanceRate = totalAttendance > 0
      ? Math.round((presentLate / totalAttendance) * 10000) / 100
      : 0

    // Fee collection rate
    const feeAgg = await db.feeInvoice.aggregate({
      where: paymentScope,
      _sum: { amount: true, paid: true },
    })
    const feeCollectionRate = feeAgg._sum.amount && feeAgg._sum.amount > 0
      ? Math.round(((feeAgg._sum.paid || 0) / feeAgg._sum.amount) * 10000) / 100
      : 0

    // Monthly new students (last 12 months)
    const recentStudents = await db.user.findMany({
      where: { ...studentScope, role: 'Student', createdAt: { gte: cutoff } },
      select: { createdAt: true },
    })

    // Monthly fee payments (last 12 months)
    const recentPayments = await db.feePayment.findMany({
      where: { ...paymentScope, createdAt: { gte: cutoff }, status: 'Completed' },
      select: { amount: true, createdAt: true },
    })

    const months = last12Months()
    const studentMap: Record<string, number> = Object.fromEntries(months.map(m => [m, 0]))
    const feeMap: Record<string, number> = Object.fromEntries(months.map(m => [m, 0]))

    recentStudents.forEach(s => {
      const k = monthLabel(new Date(s.createdAt))
      if (k in studentMap) studentMap[k]++
    })
    recentPayments.forEach(p => {
      const k = monthLabel(new Date(p.createdAt))
      if (k in feeMap) feeMap[k] += p.amount
    })

    const monthlyEnrollments = months.map(m => ({ month: m, count: studentMap[m] }))
    const monthlyFees = months.map(m => ({ month: m, amount: Math.round(feeMap[m]) }))

    // Grade distribution
    const gradeGroups = await db.grade.groupBy({
      by: ['gradeLetter'],
      where: { course: courseScope },
      _count: { id: true },
    })
    const gradeDistribution = gradeGroups
      .map(g => ({ grade: g.gradeLetter || 'Ungraded', count: g._count.id }))
      .sort((a, b) => a.grade.localeCompare(b.grade))

    // Attendance breakdown
    const attendanceBreakdown = attendanceSummary.map(a => ({ status: a.status, count: a._count.id }))

    // Students by class (for non-SuperAdmin)
    let studentsByClass: { classLevel: string; count: number }[] = []
    if (role !== 'SuperAdmin') {
      const classGroups = await db.user.groupBy({
        by: ['classLevel'],
        where: { ...studentScope, role: 'Student', classLevel: { not: null } },
        _count: { id: true },
      })
      studentsByClass = classGroups
        .filter(g => g.classLevel)
        .map(g => ({ classLevel: g.classLevel!, count: g._count.id }))
        .sort((a, b) => parseInt(a.classLevel) - parseInt(b.classLevel))
    }

    // Top courses by enrollment
    const topEnrollments = await db.enrollment.groupBy({
      by: ['courseId'],
      where: { status: 'Active', course: courseScope },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 8,
    })
    const topCourseIds = topEnrollments.map(e => e.courseId)
    const topCourseData = topCourseIds.length > 0
      ? await db.course.findMany({
          where: { id: { in: topCourseIds } },
          select: { id: true, title: true, classLevel: true },
        })
      : []
    const topCourses = topCourseData.map(c => ({
      title: c.title,
      classLevel: c.classLevel,
      enrollmentCount: topEnrollments.find(e => e.courseId === c.id)?._count.id || 0,
    })).sort((a, b) => b.enrollmentCount - a.enrollmentCount)

    return NextResponse.json({
      success: true,
      data: {
        role,
        kpis: {
          totalStudents,
          totalTeachers,
          totalCourses,
          totalEnrollments,
          attendanceRate,
          feeCollectionRate,
        },
        monthlyEnrollments,
        monthlyFees,
        gradeDistribution,
        attendanceBreakdown,
        studentsByClass,
        topCourses,
      },
    })
  } catch (error) {
    console.error('Analytics API error:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch analytics' }, { status: 500 })
  }
}
