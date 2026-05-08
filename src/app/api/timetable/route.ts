import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
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
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { searchParams } = request.nextUrl
    const teacherId = searchParams.get('teacherId')
    const branchId = searchParams.get('branchId')

    const whereClause: any = {}

    // Role-based scoping
    if (token.role === "Student") {
      // Students can only see timetable for courses they're enrolled in
      whereClause.course = {
        enrollments: {
          some: { studentId: token.userId }
        }
      }
    } else if (token.role === "Teacher") {
      // Teachers can only see timetable for courses they teach
      whereClause.course = {
        teachers: {
          some: { teacherId: token.userId }
        }
      }
    } else if (token.role === "BranchAdmin") {
      // BranchAdmin can see timetable for courses in their branch
      whereClause.course = {
        branchId: token.branchId
      }
    } else if (token.role === "InstituteAdmin") {
      // InstituteAdmin can see timetable for courses in their institute
      whereClause.course = {
        branch: {
          instituteId: token.instituteId
        }
      }
    }
    // SuperAdmin has no filter

    // Apply query params (SuperAdmin can use arbitrary filters)
    if (token.role === "SuperAdmin") {
      if (branchId) {
        whereClause.course = { ...whereClause.course, branchId }
      }
      if (teacherId) {
        whereClause.course = {
          ...whereClause.course,
          teachers: {
            some: { teacherId }
          }
        }
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

export async function POST(request: NextRequest) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    if (!["SuperAdmin", "InstituteAdmin", "BranchAdmin"].includes(token.role as string)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const { courseId, dayOfWeek, startTime, endTime, room } = body

    if (!courseId || dayOfWeek === undefined || !startTime || !endTime || !room) {
      return NextResponse.json({ error: "courseId, dayOfWeek, startTime, endTime, and room are required" }, { status: 400 })
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

    // Create timetable slot
    const slot = await db.timetableSlot.create({
      data: {
        courseId,
        dayOfWeek: parseInt(dayOfWeek.toString()),
        startTime,
        endTime,
        room,
      },
      include: {
        course: {
          select: {
            id: true,
            code: true,
            title: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      data: slot,
    }, { status: 201 })
  } catch (error) {
    console.error('POST /api/timetable error:', error)
    return NextResponse.json({ success: false, error: 'Failed to create timetable slot' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    if (!["SuperAdmin", "InstituteAdmin", "BranchAdmin"].includes(token.role as string)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { searchParams } = request.nextUrl
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: "Slot id is required" }, { status: 400 })
    }

    const slot = await db.timetableSlot.findUnique({
      where: { id },
      include: {
        course: {
          include: { branch: true },
        },
      },
    })

    if (!slot) {
      return NextResponse.json({ error: "Timetable slot not found" }, { status: 404 })
    }

    // Check permissions
    if (token.role === "BranchAdmin" && slot.course.branchId !== token.branchId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }
    if (token.role === "InstituteAdmin" && slot.course.branch.instituteId !== token.instituteId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    await db.timetableSlot.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/timetable error:', error)
    return NextResponse.json({ success: false, error: 'Failed to delete timetable slot' }, { status: 500 })
  }
}
