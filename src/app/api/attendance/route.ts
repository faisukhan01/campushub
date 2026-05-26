import { getRouteToken } from '@/lib/security'
import { NextRequest, NextResponse } from 'next/server'

import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const token = getRouteToken(request)
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (!['Teacher', 'BranchAdmin', 'InstituteAdmin', 'SuperAdmin'].includes(token.role as string)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { courseId, date, records } = body

    if (!courseId || !date || !records || !Array.isArray(records) || records.length === 0) {
      return NextResponse.json({ error: 'courseId, date and records are required' }, { status: 400 })
    }

    const markerId = (token.userId ?? token.sub) as string
    if (!markerId) return NextResponse.json({ error: 'Cannot identify teacher' }, { status: 401 })

    const session = await db.attendanceSession.create({
      data: {
        courseId,
        date: new Date(date),
        markedBy: markerId,
        records: {
          create: records.map((r: { studentId: string; status?: string; comment?: string }) => ({
            studentId: r.studentId,
            status: r.status ?? 'Present',
            comment: r.comment ?? '',
          })),
        },
      },
      include: { records: { select: { id: true, studentId: true, status: true } } },
    })

    return NextResponse.json({ success: true, data: session }, { status: 201 })
  } catch (error) {
    console.error('POST /api/attendance error:', error)
    return NextResponse.json({ success: false, error: 'Failed to mark attendance' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const courseId = searchParams.get('courseId')
    const studentId = searchParams.get('studentId')

    const whereClause: any = {}

    if (courseId) {
      whereClause.courseId = courseId
    }

    const sessions = await db.attendanceSession.findMany({
      where: whereClause,
      include: {
        course: {
          select: { id: true, code: true, title: true },
        },
        marker: {
          select: { id: true, name: true, email: true },
        },
        records: {
          include: {
            student: {
              select: { id: true, name: true, email: true, avatar: true },
            },
          },
        },
      },
      orderBy: { date: 'desc' },
    })

    // If studentId is provided, filter records to only that student
    const formattedSessions = sessions.map((session) => {
      let records = session.records
      if (studentId) {
        records = records.filter((r) => r.studentId === studentId)
      }

      const presentCount = records.filter((r) => r.status === 'Present').length
      const absentCount = records.filter((r) => r.status === 'Absent').length
      const lateCount = records.filter((r) => r.status === 'Late').length

      return {
        id: session.id,
        date: session.date,
        course: session.course,
        markedBy: session.marker,
        totalRecords: records.length,
        presentCount,
        absentCount,
        lateCount,
        records: records.map((record) => ({
          id: record.id,
          status: record.status,
          comment: record.comment,
          student: record.student,
          createdAt: record.createdAt,
        })),
        createdAt: session.createdAt,
        updatedAt: session.updatedAt,
      }
    })

    // Compute overall attendance summary
    const allRecords = formattedSessions.flatMap((s) => s.records)
    const totalPresent = allRecords.filter((r) => r.status === 'Present').length
    const totalAbsent = allRecords.filter((r) => r.status === 'Absent').length
    const totalLate = allRecords.filter((r) => r.status === 'Late').length
    const totalAll = allRecords.length
    const attendanceRate =
      totalAll > 0 ? Math.round(((totalPresent + totalLate) / totalAll) * 10000) / 100 : 0

    return NextResponse.json({
      success: true,
      data: {
        sessions: formattedSessions,
        summary: {
          totalSessions: formattedSessions.length,
          totalRecords: totalAll,
          presentCount: totalPresent,
          absentCount: totalAbsent,
          lateCount: totalLate,
          attendanceRate,
        },
      },
    })
  } catch (error) {
    console.error('Attendance API error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch attendance records' },
      { status: 500 }
    )
  }
}
