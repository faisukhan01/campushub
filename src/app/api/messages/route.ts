import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const userId = searchParams.get('userId')
    const courseId = searchParams.get('courseId')

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'userId is required' },
        { status: 400 }
      )
    }

    const whereClause: any = {
      OR: [{ senderId: userId }, { receiverId: userId }],
    }

    if (courseId) {
      whereClause.courseId = courseId
    }

    const messages = await db.message.findMany({
      where: whereClause,
      include: {
        sender: {
          select: { id: true, name: true, email: true, avatar: true, role: true },
        },
        receiver: {
          select: { id: true, name: true, email: true, avatar: true, role: true },
        },
        course: {
          select: { id: true, code: true, title: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    // Group conversations by the other user
    const conversations: Record<string, any[]> = {}
    messages.forEach((message) => {
      const otherUser =
        message.senderId === userId ? message.receiver : message.sender
      const key = otherUser.id
      if (!conversations[key]) {
        conversations[key] = []
      }
      conversations[key].push(message)
    })

    const formattedConversations = Object.entries(conversations).map(
      ([otherUserId, msgs]) => {
        const otherUser = msgs[0].senderId === userId ? msgs[0].receiver : msgs[0].sender
        const unreadCount = msgs.filter(
          (m) => !m.isRead && m.receiverId === userId
        ).length
        const lastMessage = msgs[0]

        return {
          userId: otherUser.id,
          userName: otherUser.name,
          userEmail: otherUser.email,
          userAvatar: otherUser.avatar,
          userRole: otherUser.role,
          lastMessage: {
            id: lastMessage.id,
            content: lastMessage.content,
            senderId: lastMessage.senderId,
            isRead: lastMessage.isRead,
            createdAt: lastMessage.createdAt,
          },
          unreadCount,
          totalMessages: msgs.length,
        }
      }
    )

    return NextResponse.json({
      success: true,
      data: {
        conversations: formattedConversations,
        totalMessages: messages.length,
      },
    })
  } catch (error) {
    console.error('Messages API error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch messages' },
      { status: 500 }
    )
  }
}
