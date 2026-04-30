import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const userId = searchParams.get('userId')
    const status = searchParams.get('status')

    const whereClause: any = {}

    if (userId) whereClause.userId = userId
    if (status) whereClause.status = status

    const leaveRequests = await db.leaveRequest.findMany({
      where: whereClause,
      include: {
        user: {
          select: { id: true, name: true, email: true, avatar: true, role: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    const formattedLeaveRequests = leaveRequests.map((leave) => {
      const startDate = new Date(leave.startDate)
      const endDate = new Date(leave.endDate)
      const diffTime = Math.abs(endDate.getTime() - startDate.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1

      return {
        id: leave.id,
        userId: leave.userId,
        user: leave.user,
        startDate: leave.startDate,
        endDate: leave.endDate,
        durationDays: diffDays,
        type: leave.type,
        reason: leave.reason,
        status: leave.status,
        approverComment: leave.approverComment,
        createdAt: leave.createdAt,
        updatedAt: leave.updatedAt,
      }
    })

    // Summary
    const totalRequests = formattedLeaveRequests.length
    const pendingCount = formattedLeaveRequests.filter(
      (l) => l.status === 'Pending'
    ).length
    const approvedCount = formattedLeaveRequests.filter(
      (l) => l.status === 'Approved'
    ).length
    const rejectedCount = formattedLeaveRequests.filter(
      (l) => l.status === 'Rejected'
    ).length

    // Group by type
    const typeDistribution = formattedLeaveRequests.reduce(
      (acc, l) => {
        acc[l.type] = (acc[l.type] || 0) + 1
        return acc
      },
      {} as Record<string, number>
    )

    return NextResponse.json({
      success: true,
      data: {
        leaveRequests: formattedLeaveRequests,
        summary: {
          totalRequests,
          pendingCount,
          approvedCount,
          rejectedCount,
          typeDistribution,
        },
      },
    })
  } catch (error) {
    console.error('Leave API error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch leave requests' },
      { status: 500 }
    )
  }
}
