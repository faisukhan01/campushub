import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { db } from '@/lib/db'

const GRADES = ['1','2','3','4','5','6','7','8','9','10','11','12']

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const allowed = ['BranchAdmin','InstituteAdmin','SuperAdmin','Teacher']
    if (!allowed.includes(token.role as string)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const branchId = (token.branchId as string | undefined)
      || request.nextUrl.searchParams.get('branchId')
    if (!branchId) return NextResponse.json({ error: 'branchId required' }, { status: 400 })

    const gradeParam = request.nextUrl.searchParams.get('grade')

    // Fetch all students and courses for this branch in one query each
    const [allStudents, allCourses, allTeachers] = await Promise.all([
      db.user.findMany({
        where: { role: 'Student', branchId, isActive: true },
        select: {
          id: true, name: true, email: true, section: true,
          rollNumber: true, phone: true, classLevel: true, createdAt: true,
        },
        orderBy: { name: 'asc' },
      }),
      db.course.findMany({
        where: { branchId, isActive: true },
        include: {
          teachers: {
            include: {
              teacher: { select: { id: true, name: true, email: true, employeeId: true } },
            },
          },
          _count: { select: { enrollments: true } },
        },
        orderBy: { title: 'asc' },
      }),
      db.user.findMany({
        where: { role: 'Teacher', branchId, isActive: true },
        select: { id: true, name: true, email: true, employeeId: true, phone: true },
        orderBy: { name: 'asc' },
      }),
    ])

    const gradesToProcess = gradeParam ? [gradeParam] : GRADES

    const classData = gradesToProcess.map((grade) => {
      const students = allStudents.filter(s => s.classLevel === grade)
      const courses = allCourses.filter(c => c.classLevel === grade)
      const teacherIds = new Set(
        courses.flatMap(c => c.teachers.map(t => t.teacherId))
      )
      const teachers = allTeachers.filter(t => teacherIds.has(t.id))
      const sections = [...new Set(students.map(s => s.section).filter(Boolean))] as string[]

      return {
        grade,
        label: `Class ${grade}`,
        studentCount: students.length,
        courseCount: courses.length,
        teacherCount: teachers.length,
        sections: sections.length > 0 ? sections.sort() : [],
        students,
        courses: courses.map(c => ({
          id: c.id, code: c.code, title: c.title, subjectType: c.subjectType,
          section: c.section, color: c.color, icon: c.icon,
          enrollmentCount: c._count.enrollments,
          teachers: c.teachers.map(ct => ({
            id: ct.teacher.id, name: ct.teacher.name,
            email: ct.teacher.email, employeeId: ct.teacher.employeeId,
            isPrimary: ct.isPrimary,
          })),
        })),
        teachers,
      }
    })

    return NextResponse.json({ success: true, data: classData, allTeachers })
  } catch (err) {
    console.error('school-classes GET error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Enroll a student into a class (set classLevel + section on the user)
export async function PATCH(request: NextRequest) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (token.role !== 'BranchAdmin' && token.role !== 'InstituteAdmin' && token.role !== 'SuperAdmin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { action } = body

    if (action === 'move-student') {
      const { studentId, grade, section } = body
      await db.user.update({
        where: { id: studentId },
        data: { classLevel: grade, section: section || 'A' },
      })
      return NextResponse.json({ success: true, message: 'Student moved to class' })
    }

    if (action === 'assign-teacher') {
      const { courseId, teacherId, isPrimary } = body
      // Remove existing primary if setting new one
      if (isPrimary) {
        await db.courseTeacher.updateMany({
          where: { courseId, isPrimary: true },
          data: { isPrimary: false },
        })
      }
      // Upsert teacher assignment
      const existing = await db.courseTeacher.findFirst({ where: { courseId, teacherId } })
      if (existing) {
        await db.courseTeacher.update({ where: { id: existing.id }, data: { isPrimary: isPrimary ?? false } })
      } else {
        await db.courseTeacher.create({ data: { courseId, teacherId, isPrimary: isPrimary ?? false } })
      }
      return NextResponse.json({ success: true, message: 'Teacher assigned' })
    }

    if (action === 'remove-teacher') {
      const { courseId, teacherId } = body
      await db.courseTeacher.deleteMany({ where: { courseId, teacherId } })
      return NextResponse.json({ success: true, message: 'Teacher removed' })
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
  } catch (err) {
    console.error('school-classes PATCH error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
