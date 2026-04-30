import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

const DAY_NAMES = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const teacherId = searchParams.get('teacherId')
    const branchId = searchParams.get('branchId')

    const whereClause: any = {}

    if (branchId) {
      whereClause.course = { ...whereClause.course, branchId }
    }

    if (teacherId) {
      whereClause.course = {
        ...whereClause.course,
        teachers: {
          some: { teacherId },
        },
      }
    }

    const slots = await db.timetableSlot.findMany({
      where: whereClause,
      include: {
        course: {
          include: {
            branch: {
              select: { id: true, name: true },
            },
            teachers: {
              include: {
                teacher: {
                  select: { id: true, name: true, email: true, avatar: true },
                },
              },
            },
            batch: {
              select: { id: true, name: true },
            },
          },
        },
      },
      orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
    })

    // Group by day of week
    const groupedByDay: Record<number, any[]> = {}
    for (let i = 0; i <= 6; i++) {
      groupedByDay[i] = []
    }

    slots.forEach((slot) => {
      const formattedSlot = {
        id: slot.id,
        dayOfWeek: slot.dayOfWeek,
        dayName: DAY_NAMES[slot.dayOfWeek] || `Day ${slot.dayOfWeek}`,
        startTime: slot.startTime,
        endTime: slot.endTime,
        room: slot.room,
        course: {
          id: slot.course.id,
          code: slot.course.code,
          title: slot.course.title,
          section: slot.course.section,
          creditHours: slot.course.creditHours,
          branch: slot.course.branch,
          batch: slot.course.batch,
          teachers: slot.course.teachers.map((ct) => ({
            id: ct.teacher.id,
            name: ct.teacher.name,
            email: ct.teacher.email,
            avatar: ct.teacher.avatar,
            isPrimary: ct.isPrimary,
          })),
        },
      }
      groupedByDay[slot.dayOfWeek].push(formattedSlot)
    })

    // Build the final days array (only days with classes)
    const days = Object.entries(groupedByDay)
      .filter(([, daySlots]) => daySlots.length > 0)
      .map(([day, daySlots]) => ({
        dayOfWeek: Number(day),
        dayName: DAY_NAMES[Number(day)] || `Day ${day}`,
        slots: daySlots,
      }))

    return NextResponse.json({
      success: true,
      data: {
        days,
        totalSlots: slots.length,
      },
    })
  } catch (error) {
    console.error('Timetable API error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch timetable' },
      { status: 500 }
    )
  }
}
