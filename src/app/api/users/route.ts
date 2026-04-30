import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const role = searchParams.get('role')
    const branchId = searchParams.get('branchId')

    const whereClause: any = { isActive: true }

    if (role) {
      whereClause.role = role
    }

    if (branchId) {
      whereClause.branchId = branchId
    }

    const users = await db.user.findMany({
      where: whereClause,
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        phone: true,
        role: true,
        branchId: true,
        isActive: true,
        lastLogin: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            enrollments: true,
            taughtCourses: true,
            submissions: true,
            notifications: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    const formattedUsers = users.map((user) => ({
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      phone: user.phone,
      role: user.role,
      branchId: user.branchId,
      isActive: user.isActive,
      lastLogin: user.lastLogin,
      enrollmentsCount: user._count.enrollments,
      taughtCoursesCount: user._count.taughtCourses,
      submissionsCount: user._count.submissions,
      unreadNotifications: user._count.notifications,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }))

    // Count by role
    const roleCounts = await db.user.groupBy({
      by: ['role'],
      where: { isActive: true },
      _count: { id: true },
    })

    const roleDistribution = roleCounts.reduce(
      (acc, item) => {
        acc[item.role] = item._count.id
        return acc
      },
      {} as Record<string, number>
    )

    return NextResponse.json({
      success: true,
      data: {
        users: formattedUsers,
        totalUsers: formattedUsers.length,
        roleDistribution,
      },
    })
  } catch (error) {
    console.error('Users API error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}
