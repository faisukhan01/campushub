import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (!['Teacher', 'BranchAdmin', 'InstituteAdmin', 'SuperAdmin'].includes(token.role as string)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { title, content, type = 'General', courseId, branchId, link } = body

    if (!title || !content) {
      return NextResponse.json({ error: 'title and content are required' }, { status: 400 })
    }

    const authorId = (token.userId ?? token.sub) as string
    const instituteId = token.instituteId as string
    if (!authorId || !instituteId) {
      return NextResponse.json({ error: 'Cannot identify author or institute' }, { status: 401 })
    }

    const announcement = await db.announcement.create({
      data: {
        title,
        content: link ? `${content}\n\n[Link]: ${link}` : content,
        type,
        courseId: courseId || null,
        branchId: branchId || (token.branchId as string) || null,
        instituteId,
        authorId,
        isPublished: true,
      },
    })

    return NextResponse.json({ success: true, data: announcement }, { status: 201 })
  } catch (error) {
    console.error('POST /api/announcements error:', error)
    return NextResponse.json({ success: false, error: 'Failed to create announcement' }, { status: 500 })
  }
}

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
