import { getRouteToken } from '@/lib/security'
import { NextRequest, NextResponse } from 'next/server'

import { db } from '@/lib/db'

const PLAN_LIMITS: Record<string, { maxBranches: number | 'Unlimited'; maxUsers: number | 'Unlimited'; storage: string }> = {
  Starter:      { maxBranches: 2,          maxUsers: 100,         storage: '5 GB' },
  Professional: { maxBranches: 10,         maxUsers: 1000,        storage: '25 GB' },
  Enterprise:   { maxBranches: 'Unlimited', maxUsers: 'Unlimited', storage: '100 GB' },
}

export async function GET(request: NextRequest) {
  try {
    const token = getRouteToken(request)
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (token.role !== 'SuperAdmin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const subscriptions = await db.subscription.findMany({
      include: {
        institute: {
          include: {
            _count: { select: { branches: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    // Enrich with real user counts
    const enriched = await Promise.all(subscriptions.map(async (sub) => {
      const [userCount, studentCount, teacherCount] = await Promise.all([
        db.user.count({ where: { instituteId: sub.instituteId, isActive: true, role: { not: 'SuperAdmin' } } }),
        db.user.count({ where: { instituteId: sub.instituteId, isActive: true, role: 'Student' } }),
        db.user.count({ where: { instituteId: sub.instituteId, isActive: true, role: 'Teacher' } }),
      ])
      const limits = PLAN_LIMITS[sub.plan] || PLAN_LIMITS.Starter
      const daysLeft = Math.max(0, Math.ceil((new Date(sub.endDate).getTime() - Date.now()) / 86_400_000))
      return {
        id: sub.id,
        instituteId: sub.instituteId,
        instituteName: sub.institute.name,
        instituteCode: sub.institute.code,
        plan: sub.plan,
        features: sub.features,
        maxUsers: sub.maxUsers,
        startDate: sub.startDate,
        endDate: sub.endDate,
        isActive: sub.isActive,
        createdAt: sub.createdAt,
        updatedAt: sub.updatedAt,
        usage: {
          userCount,
          studentCount,
          teacherCount,
          branchCount: sub.institute._count.branches,
        },
        limits,
        daysLeft,
        isExpired: new Date(sub.endDate) < new Date(),
        isExpiringSoon: daysLeft <= 30 && daysLeft > 0,
      }
    }))

    // Platform-wide totals
    const [totalInstitutes, totalUsers, totalStudents, totalTeachers, totalBranches] = await Promise.all([
      db.institute.count(),
      db.user.count({ where: { isActive: true, role: { not: 'SuperAdmin' } } }),
      db.user.count({ where: { isActive: true, role: 'Student' } }),
      db.user.count({ where: { isActive: true, role: 'Teacher' } }),
      db.branch.count(),
    ])

    return NextResponse.json({
      success: true,
      data: enriched,
      totals: { totalInstitutes, totalUsers, totalStudents, totalTeachers, totalBranches },
    })
  } catch (err) {
    console.error('subscriptions GET error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = getRouteToken(request)
    if (!token || token.role !== 'SuperAdmin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const body = await request.json()
    const { instituteId, plan, maxUsers, endDate } = body
    if (!instituteId || !plan || !endDate) {
      return NextResponse.json({ error: 'instituteId, plan, endDate required' }, { status: 400 })
    }

    // Deactivate existing subscriptions for this institute
    await db.subscription.updateMany({
      where: { instituteId, isActive: true },
      data: { isActive: false },
    })

    const planLimits = PLAN_LIMITS[plan] || PLAN_LIMITS.Starter
    const features = ['Branches','Users','Courses','Attendance','Grades','Fees','Announcements','Reports']
    if (plan === 'Professional' || plan === 'Enterprise') features.push('Analytics','Messages')
    if (plan === 'Enterprise') features.push('API Access','White Label','Priority Support')

    const sub = await db.subscription.create({
      data: {
        instituteId,
        plan,
        maxUsers: typeof planLimits.maxUsers === 'number' ? planLimits.maxUsers : (maxUsers || 9999),
        features: JSON.stringify(features),
        endDate: new Date(endDate),
        isActive: true,
      },
    })

    return NextResponse.json({ success: true, data: sub })
  } catch (err) {
    console.error('subscriptions POST error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const token = getRouteToken(request)
    if (!token || token.role !== 'SuperAdmin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const body = await request.json()
    const { id, plan, maxUsers, endDate, isActive } = body
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

    const updateData: Record<string, unknown> = { updatedAt: new Date() }
    if (plan !== undefined) updateData.plan = plan
    if (maxUsers !== undefined) updateData.maxUsers = maxUsers
    if (endDate !== undefined) updateData.endDate = new Date(endDate)
    if (isActive !== undefined) updateData.isActive = isActive

    const sub = await db.subscription.update({ where: { id }, data: updateData })
    return NextResponse.json({ success: true, data: sub })
  } catch (err) {
    console.error('subscriptions PATCH error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
