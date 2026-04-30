import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const courseId = searchParams.get('courseId')

    const whereClause: any = { isPublished: true }

    if (courseId) {
      whereClause.courseId = courseId
    }

    const announcements = await db.announcement.findMany({
      where: whereClause,
      include: {
        course: {
          select: { id: true, code: true, title: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    const formattedAnnouncements = announcements.map((announcement) => ({
      id: announcement.id,
      title: announcement.title,
      content: announcement.content,
      type: announcement.type,
      course: announcement.course,
      instituteId: announcement.instituteId,
      isPublished: announcement.isPublished,
      createdAt: announcement.createdAt,
      updatedAt: announcement.updatedAt,
    }))

    return NextResponse.json({
      success: true,
      data: formattedAnnouncements,
    })
  } catch (error) {
    console.error('Announcements API error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch announcements' },
      { status: 500 }
    )
  }
}
