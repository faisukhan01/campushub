import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const userId = searchParams.get('userId')
    const status = searchParams.get('status')
    const priority = searchParams.get('priority')

    const whereClause: any = {}

    if (userId) whereClause.userId = userId
    if (status) whereClause.status = status
    if (priority) whereClause.priority = priority

    const tickets = await db.supportTicket.findMany({
      where: whereClause,
      include: {
        user: {
          select: { id: true, name: true, email: true, avatar: true, role: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    const formattedTickets = tickets.map((ticket) => ({
      id: ticket.id,
      userId: ticket.userId,
      user: ticket.user,
      subject: ticket.subject,
      description: ticket.description,
      status: ticket.status,
      priority: ticket.priority,
      createdAt: ticket.createdAt,
      updatedAt: ticket.updatedAt,
    }))

    // Summary
    const totalTickets = formattedTickets.length
    const openCount = formattedTickets.filter((t) => t.status === 'Open').length
    const inProgressCount = formattedTickets.filter(
      (t) => t.status === 'In Progress'
    ).length
    const resolvedCount = formattedTickets.filter(
      (t) => t.status === 'Resolved'
    ).length
    const closedCount = formattedTickets.filter(
      (t) => t.status === 'Closed'
    ).length

    // Group by priority
    const priorityDistribution = formattedTickets.reduce(
      (acc, t) => {
        acc[t.priority] = (acc[t.priority] || 0) + 1
        return acc
      },
      {} as Record<string, number>
    )

    return NextResponse.json({
      success: true,
      data: {
        tickets: formattedTickets,
        summary: {
          totalTickets,
          openCount,
          inProgressCount,
          resolvedCount,
          closedCount,
          priorityDistribution,
        },
      },
    })
  } catch (error) {
    console.error('Support API error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch support tickets' },
      { status: 500 }
    )
  }
}
