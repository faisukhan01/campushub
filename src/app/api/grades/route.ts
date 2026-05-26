import { getRouteToken } from '@/lib/security'
import { NextRequest, NextResponse } from 'next/server'

import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const token = getRouteToken(request)
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { searchParams } = request.nextUrl
    const studentId = searchParams.get('studentId')
    const courseId = searchParams.get('courseId')

    const whereClause: any = {}

    // Role-based scoping
    if (token.role === "Student") {
      // Students can only see their own grades
      whereClause.studentId = token.userId
    } else if (token.role === "Teacher") {
      // Teachers can only see grades for courses they teach
      whereClause.course = {
        teachers: {
          some: { teacherId: token.userId }
        }
      }
    } else if (token.role === "BranchAdmin") {
      // BranchAdmin can see grades for courses in their branch
      whereClause.course = {
        branchId: token.branchId
      }
    } else if (token.role === "InstituteAdmin") {
      // InstituteAdmin can see grades for courses in their institute
      whereClause.course = {
        branch: {
          instituteId: token.instituteId
        }
      }
    }
    // SuperAdmin has no filter (can see all grades)

    // Apply query params (SuperAdmin can use arbitrary IDs)
    if (studentId && token.role === "SuperAdmin") whereClause.studentId = studentId
    if (courseId && token.role === "SuperAdmin") whereClause.courseId = courseId

    const grades = await db.grade.findMany({
      where: whereClause,
      select: {
        id: true, courseId: true, studentId: true, category: true,
        marks: true, maxMarks: true, weight: true, gradeLetter: true,
        comments: true, createdAt: true, updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    // Compute grade letter if not set
    const formattedGrades = grades.map((grade) => {
      const percentage = grade.maxMarks > 0 ? (grade.marks / grade.maxMarks) * 100 : 0
      let computedLetter = grade.gradeLetter

      if (!computedLetter) {
        if (percentage >= 90) computedLetter = 'A+'
        else if (percentage >= 85) computedLetter = 'A'
        else if (percentage >= 80) computedLetter = 'A-'
        else if (percentage >= 75) computedLetter = 'B+'
        else if (percentage >= 70) computedLetter = 'B'
        else if (percentage >= 65) computedLetter = 'B-'
        else if (percentage >= 60) computedLetter = 'C+'
        else if (percentage >= 55) computedLetter = 'C'
        else if (percentage >= 50) computedLetter = 'D'
        else computedLetter = 'F'
      }

      return {
        id: grade.id,
        courseId: grade.courseId,
        studentId: grade.studentId,
        category: grade.category,
        marks: grade.marks,
        maxMarks: grade.maxMarks,
        weight: grade.weight,
        percentage: Math.round(percentage * 10) / 10,
        gradeLetter: computedLetter,
        comments: grade.comments,
        createdAt: grade.createdAt,
        updatedAt: grade.updatedAt,
      }
    })

    // Compute summary stats
    const totalGrades = formattedGrades.length
    const averagePercentage =
      totalGrades > 0
        ? formattedGrades.reduce((sum, g) => sum + g.percentage, 0) / totalGrades
        : 0

    const gradeDistribution = formattedGrades.reduce(
      (acc, g) => {
        const letter = g.gradeLetter || 'N/A'
        acc[letter] = (acc[letter] || 0) + 1
        return acc
      },
      {} as Record<string, number>
    )

    return NextResponse.json({
      success: true,
      data: {
        grades: formattedGrades,
        summary: {
          totalGrades,
          averagePercentage: Math.round(averagePercentage * 10) / 10,
          gradeDistribution,
        },
      },
    })
  } catch (error) {
    console.error('Grades API error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch grades' },
      { status: 500 }
    )
  }
}
