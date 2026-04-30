import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'userId is required' },
        { status: 400 }
      )
    }

    const notifications = await db.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    })

    const unreadCount = notifications.filter((n) => !n.isRead).length

    const formattedNotifications = notifications.map((notification) => ({
      id: notification.id,
      title: notification.title,
      content: notification.content,
      category: notification.category,
      type: notification.type,
      isRead: notification.isRead,
      link: notification.link,
      createdAt: notification.createdAt,
    }))

    // Group by category
    const groupedByCategory = formattedNotifications.reduce(
      (acc, n) => {
        const cat = n.category
        if (!acc[cat]) acc[cat] = []
        acc[cat].push(n)
        return acc
      },
      {} as Record<string, any[]>
    )

    return NextResponse.json({
      success: true,
      data: {
        notifications: formattedNotifications,
        unreadCount,
        totalNotifications: notifications.length,
        groupedByCategory,
      },
    })
  } catch (error) {
    console.error('Notifications API error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch notifications' },
      { status: 500 }
    )
  }
}
